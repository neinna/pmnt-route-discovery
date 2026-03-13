"use client";

import { useState } from "react";

interface FeeBreakdown {
  transfer_fee_usd: number | null;
  fx_spread_usd: number | null;
  network_gas_usd: number | null;
}

interface Route {
  vendor: string;
  type: string;
  total_cost_usd: number | null;
  fee_breakdown: FeeBreakdown;
  settlement_time: string;
  how_it_works: string;
  best_if: string;
  caveat: string;
}

interface Parsed {
  amount_usd: number | null;
  origin_currency: string;
  destination_country: string;
  destination_currency: string;
  urgency: string;
  sender_context: string;
}

interface RouteResult {
  parsed: Parsed;
  recommended_routes: Route[];
  insight: string;
  stablecoin_disclaimer: boolean;
  remaining: number;
  cached?: boolean;
  error?: string;
}

const TYPE_COLORS: Record<string, string> = {
  stablecoin: "bg-indigo-50 text-indigo-700 border-indigo-200",
  psp: "bg-slate-100 text-slate-700 border-slate-200",
  crypto_psp: "bg-violet-50 text-violet-700 border-violet-200",
  legacy: "bg-amber-50 text-amber-700 border-amber-200",
};

const TYPE_LABELS: Record<string, string> = {
  stablecoin: "Stablecoin",
  psp: "PSP",
  crypto_psp: "Crypto PSP",
  legacy: "Legacy",
};

const EXAMPLES = [
  "Send $500K USD to our supplier in Mexico by end of week",
  "Pay a vendor in Brazil 200,000 USD, standard timing is fine",
  "Wire $2M from our US entity to our UK subsidiary today",
  "Monthly payroll: $80K to employees in the Philippines",
];

function fmt(n: number | null): string {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RouteResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(q?: string) {
    const input = q ?? query;
    if (!input.trim()) return;
    if (q) setQuery(q);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-gray-400 tracking-widest uppercase mb-1">Long Tail Studio</div>
            <h1 className="text-lg font-semibold text-gray-900">Payment Route Intelligence</h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="/rails" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              Rail comparison →
            </a>
            <div className="group relative">
              <button className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Tip in USDC
              </button>
              <div className="hidden group-hover:block absolute right-0 top-10 z-10 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-64">
                <p className="text-xs text-gray-500 mb-2">Find this useful? Send USDC on Base:</p>
                <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-700 break-all select-all border border-gray-200">
                  longstailstudio.base.eth
                </div>
                <p className="text-xs text-gray-400 mt-2">Any amount appreciated.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            Where should this payment go?
          </h2>
          <p className="text-gray-500 text-base max-w-2xl">
            Describe your payment in plain English. The agent identifies the best route, which PSP,
            which rail, estimated cost and settlement time, for your specific corridor and amount.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="e.g. Send $500K USD to our supplier in Mexico by end of week..."
            className="w-full resize-none text-base text-gray-900 placeholder-gray-400 border-0 outline-none bg-transparent"
            rows={3}
          />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">Press Enter to search, Shift+Enter for new line</p>
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !query.trim()}
              className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Routing..." : "Find route"}
            </button>
          </div>
        </div>

        {!result && !loading && (
          <div className="mb-10">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Try an example</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => handleSubmit(ex)}
                  className="text-sm text-gray-600 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:border-gray-400 hover:text-gray-900 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-3 text-gray-500 py-8">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
            <span className="text-sm">Analyzing corridor and matching vendors...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">What I understood</p>
              <div className="flex flex-wrap gap-3">
                {result.parsed.amount_usd && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                    <div className="text-xs text-gray-400 mb-0.5">Amount</div>
                    <div className="text-sm font-semibold text-gray-900">{fmt(result.parsed.amount_usd)}</div>
                  </div>
                )}
                {result.parsed.origin_currency && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                    <div className="text-xs text-gray-400 mb-0.5">From</div>
                    <div className="text-sm font-semibold text-gray-900">{result.parsed.origin_currency}</div>
                  </div>
                )}
                {result.parsed.destination_country && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                    <div className="text-xs text-gray-400 mb-0.5">To</div>
                    <div className="text-sm font-semibold text-gray-900">{result.parsed.destination_country} ({result.parsed.destination_currency})</div>
                  </div>
                )}
                {result.parsed.urgency && result.parsed.urgency !== "unknown" && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                    <div className="text-xs text-gray-400 mb-0.5">Urgency</div>
                    <div className="text-sm font-semibold text-gray-900 capitalize">{result.parsed.urgency}</div>
                  </div>
                )}
                {result.parsed.sender_context && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                    <div className="text-xs text-gray-400 mb-0.5">Context</div>
                    <div className="text-sm font-semibold text-gray-900">{result.parsed.sender_context}</div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Recommended routes</p>
              <div className="space-y-4">
                {result.recommended_routes.map((route, i) => (
                  <div
                    key={route.vendor}
                    className={`bg-white border rounded-2xl p-6 shadow-sm ${i === 0 ? "border-gray-900" : "border-gray-200"}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {i === 0 && (
                          <span className="text-xs font-medium bg-gray-900 text-white px-2.5 py-1 rounded-md">
                            Top pick
                          </span>
                        )}
                        <h3 className="text-base font-semibold text-gray-900">{route.vendor}</h3>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${TYPE_COLORS[route.type] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                          {TYPE_LABELS[route.type] ?? route.type}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-semibold text-gray-900">{fmt(route.total_cost_usd)}</div>
                        <div className="text-xs text-gray-400">estimated total cost</div>
                      </div>
                    </div>

                    {route.fee_breakdown && (
                      <div className="flex gap-4 mb-4 pb-4 border-b border-gray-100">
                        {route.fee_breakdown.transfer_fee_usd !== null && (
                          <div>
                            <div className="text-xs text-gray-400">Transfer fee</div>
                            <div className="text-sm font-medium text-gray-700">{fmt(route.fee_breakdown.transfer_fee_usd)}</div>
                          </div>
                        )}
                        {route.fee_breakdown.fx_spread_usd !== null && (
                          <div>
                            <div className="text-xs text-gray-400">FX spread</div>
                            <div className="text-sm font-medium text-gray-700">{fmt(route.fee_breakdown.fx_spread_usd)}</div>
                          </div>
                        )}
                        {route.fee_breakdown.network_gas_usd !== null && (
                          <div>
                            <div className="text-xs text-gray-400">Network gas</div>
                            <div className="text-sm font-medium text-gray-700">{fmt(route.fee_breakdown.network_gas_usd)}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-xs text-gray-400">Settlement</div>
                          <div className="text-sm font-medium text-gray-700">{route.settlement_time}</div>
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-gray-600 mb-3">{route.how_it_works}</p>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                        <div className="text-xs font-medium text-green-700 mb-1">Best if</div>
                        <div className="text-xs text-green-800">{route.best_if}</div>
                      </div>
                      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                        <div className="text-xs font-medium text-amber-700 mb-1">Watch out for</div>
                        <div className="text-xs text-amber-800">{route.caveat}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 text-white rounded-2xl p-6">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">The bottom line</p>
              <p className="text-sm leading-relaxed text-gray-200">{result.insight}</p>
              {result.stablecoin_disclaimer && (
                <p className="text-xs text-gray-500 mt-4 border-t border-gray-700 pt-4">
                  Disclaimer: USDC is assumed at 1:1 USD parity. Actual peg may deviate slightly.
                  Recipient requires a regulated offramp or exchange partner in the destination country
                  to convert USDC to local currency. This is not financial advice.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pb-4">
              <span>{result.cached ? "Cached result" : "Live analysis"} · Powered by Claude</span>
              <span>{result.remaining} queries remaining this hour</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}