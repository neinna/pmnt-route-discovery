import Link from "next/link";

export default function RailsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-gray-400 tracking-widest uppercase mb-1">Long Tail Studio</div>
            <h1 className="text-lg font-semibold text-gray-900">Blockchain Rail Comparison</h1>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
            ← Route finder
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">Which blockchain rail should you use?</h2>
          <p className="text-gray-500 max-w-2xl">Solana, Base, Tempo, and Stellar evaluated for cross-border remittance and B2B payments. Updated March 2026.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { name: "Solana", color: "#9945FF", tagline: "High-throughput L1. Visa USDC settlement live Dec 2025.", status: "Mainnet Live", statusColor: "text-green-600 bg-green-50 border-green-200" },
            { name: "Base", color: "#0052FF", tagline: "Coinbase-built Ethereum L2. $3B+ USDC in circulation.", status: "Mainnet Live", statusColor: "text-green-600 bg-green-50 border-green-200" },
            { name: "Tempo", color: "#00C896", tagline: "Stripe + Paradigm payments-first L1. Currently public testnet only.", status: "Public Testnet", statusColor: "text-amber-600 bg-amber-50 border-amber-200" },
            { name: "Stellar", color: "#F5A623", tagline: "Built for remittances since 2014. MoneyGram runs on it.", status: "Mainnet Live", statusColor: "text-green-600 bg-green-50 border-green-200" },
          ].map((chain) => (
            <div key={chain.name} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: chain.color }} />
                <span className="font-semibold text-gray-900">{chain.name}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{chain.tagline}</p>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${chain.statusColor}`}>{chain.status}</span>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider w-36">Metric</th>
                  <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider" style={{ color: "#9945FF" }}>Solana</th>
                  <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider" style={{ color: "#0052FF" }}>Base</th>
                  <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider" style={{ color: "#00C896" }}>Tempo</th>
                  <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider" style={{ color: "#F5A623" }}>Stellar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    metric: "Throughput",
                    sol: { val: "~1,344 TPS", note: "Real-world sustained. Sufficient for consumer volumes." },
                    base: { val: "~2,000 TPS", note: "Ethereum L2. Scales well for payments." },
                    tempo: { val: "100,000 TPS", note: "Design target. Unproven in production.", warn: true },
                    stellar: { val: "~1,000 TPS", note: "Adequate for remittance corridors." },
                  },
                  {
                    metric: "Finality",
                    sol: { val: "~30 sec", note: "Appears in wallet in 1-2 sec.", good: true },
                    base: { val: "~2 sec", note: "Near-instant UX.", good: true },
                    tempo: { val: "Sub-second", note: "Theoretical. Not yet proven at scale.", warn: true },
                    stellar: { val: "3-5 sec", note: "Battle tested for remittance.", good: true },
                  },
                  {
                    metric: "Tx Cost",
                    sol: { val: "<$0.01", note: "Predictable, no congestion spikes.", good: true },
                    base: { val: "<$0.01", note: "Sub-cent under normal load.", good: true },
                    tempo: { val: "Sub-cent", note: "Gas paid in stablecoins. Smart design.", warn: true },
                    stellar: { val: "~$0.00001", note: "Lowest of all four.", good: true },
                  },
                  {
                    metric: "USDC",
                    sol: { val: "Native", note: "Circle-issued. $10.6B on Solana.", good: true },
                    base: { val: "Native", note: "Circle-issued. $3B+ in circulation.", good: true },
                    tempo: { val: "TBD", note: "No native USDC confirmed yet.", bad: true },
                    stellar: { val: "Native", note: "Used by MoneyGram today.", good: true },
                  },
                  {
                    metric: "EVM",
                    sol: { val: "No", note: "Own VM. Separate tooling." },
                    base: { val: "Yes", note: "Full EVM. Largest dev ecosystem.", good: true },
                    tempo: { val: "Yes", note: "EVM-compatible L1 on Reth.", good: true },
                    stellar: { val: "No", note: "Own protocol. Smaller ecosystem." },
                  },
                  {
                    metric: "Uptime",
                    sol: { val: "~99.8%", note: "Improved significantly since 2022." },
                    base: { val: "~99.9%+", note: "No major outages. Coinbase infra.", good: true },
                    tempo: { val: "Unknown", note: "No production track record.", bad: true },
                    stellar: { val: "~99.9%+", note: "10 years of operation.", good: true },
                  },
                ].map((row) => (
                  <tr key={row.metric} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">{row.metric}</td>
                    {[row.sol, row.base, row.tempo, row.stellar].map((cell, i) => (
                      <td key={i} className="px-6 py-4">
                        <div className={`font-semibold text-base mb-0.5 ${'good' in cell && cell.good ? "text-green-600" : 'warn' in cell && cell.warn ? "text-amber-500" : 'bad' in cell && cell.bad ? "text-red-500" : "text-gray-700"}`}>
                          {cell.val}
                        </div>
                        <div className="text-xs text-gray-400 leading-relaxed">{cell.note}</div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { name: "Solana", color: "#9945FF", verdict: "Best Now", verdictColor: "text-green-600", note: "Visa already runs USDC settlement on Solana for US banks. Strongest institutional validation available." },
            { name: "Base", color: "#0052FF", verdict: "Strong Alt", verdictColor: "text-amber-500", note: "Coinbase builder = strong US bank credibility. $3B USDC. Good fallback or multi-chain option." },
            { name: "Tempo", color: "#00C896", verdict: "Not Yet", verdictColor: "text-red-500", note: "Still in public testnet. No native USDC confirmed. Strong long-term potential. Revisit 2027." },
            { name: "Stellar", color: "#F5A623", verdict: "Proven Alt", verdictColor: "text-amber-500", note: "Most battle-tested for regulated remittance. MoneyGram runs on it today." },
          ].map((v) => (
            <div key={v.name} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: v.color }} />
                <span className="font-semibold text-gray-900 text-sm">{v.name}</span>
              </div>
              <div className={`text-2xl font-bold mb-2 ${v.verdictColor}`}>{v.verdict}</div>
              <p className="text-xs text-gray-500 leading-relaxed">{v.note}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 text-white rounded-2xl p-8">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">The long game</div>
          <h3 className="text-lg font-semibold mb-3">Proprietary stablecoin issuance</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Near term, <strong className="text-white">Solana + USDC</strong> is the defensible v1 choice. Visa validation,
            bank-grade reliability, lowest friction for a regulated remittance product. But the real strategic question
            for any bank-owned product is whether to issue its own stablecoin. With $1T+ in potential volume, relying on
            USDC means Circle captures the reserve yield. A <strong className="text-white">bank-consortium stablecoin</strong> enabled
            by the GENIUS Act would let the issuer own the full settlement stack. The playbook: start on Solana/USDC,
            prove the corridor, then evaluate proprietary issuance once volume justifies the licensing investment.
          </p>
        </div>
      </main>
    </div>
  );
}