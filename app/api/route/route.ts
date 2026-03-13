import { NextRequest, NextResponse } from "next/server";
import vendors from "@/data/vendors.json";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

const responseCache = new Map<string, { result: unknown; cachedAt: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }
  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }
  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

function cacheKey(body: unknown): string {
  return JSON.stringify(body);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit reached. You can make 5 queries per hour." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { query } = body;

  if (!query || typeof query !== "string" || query.trim().length < 5) {
    return NextResponse.json({ error: "Please enter a payment scenario." }, { status: 400 });
  }

  const key = cacheKey({ query: query.trim().toLowerCase() });
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return NextResponse.json({ ...(cached.result as Record<string, unknown>), cached: true, remaining });
  }

  const vendorSummary = vendors.vendors.map((v) => ({
    name: v.name,
    type: v.type,
    input_rails: v.input_rails,
    output_rails: v.output_rails,
    corridors: v.supported_corridors,
    fee_pct: v.typical_fee_pct,
    fx_spread_pct: v.fx_spread_pct,
    settlement: v.settlement_time,
    best_for: v.best_for,
    notes: v.notes,
  }));

  const systemPrompt = `You are a B2B cross-border payments routing expert. A treasury or finance professional has described a payment they need to make.

Your job is to:
1. Extract the key parameters from their query (amount, origin currency, destination currency/country, urgency, sender type)
2. Select the 2-3 best vendors from the provided list for this specific corridor and amount
3. Calculate approximate costs and explain the tradeoff clearly

Available vendors:
${JSON.stringify(vendorSummary, null, 2)}

Respond ONLY with a valid JSON object in this exact structure, no markdown, no preamble:
{
  "parsed": {
    "amount_usd": number or null,
    "origin_currency": "string",
    "destination_country": "string",
    "destination_currency": "string",
    "urgency": "same-day|next-day|standard|unknown",
    "sender_context": "brief description of sender"
  },
  "recommended_routes": [
    {
      "vendor": "vendor name",
      "type": "stablecoin|psp|crypto_psp|legacy",
      "total_cost_usd": number or null,
      "fee_breakdown": {
        "transfer_fee_usd": number or null,
        "fx_spread_usd": number or null,
        "network_gas_usd": number or null
      },
      "settlement_time": "string",
      "how_it_works": "1 short sentence on the actual flow, max 20 words",
      "best_if": "max 10 words",
      "caveat": "max 10 words"
    }
  ],
  "insight": "2 sentences max. Be blunt. No filler. Include USDC disclaimer inline if stablecoin recommended.",
  "stablecoin_disclaimer": true or false
}`;

  const userMessage = `Payment scenario: ${query}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const raw = data.content?.[0]?.text ?? "";
    console.log("RAW RESPONSE:", raw);

    let parsed;
    try {
      const clean = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      return NextResponse.json(
        { error: "Could not parse routing response. Please try rephrasing." },
        { status: 500 }
      );
    }

    const result = { ...parsed, remaining };
    const responseCache = new Map<string, { result: object; cachedAt: number }>();

    return NextResponse.json(result);
  } catch (err) {
    console.error("Route API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}