import { useState, useEffect } from "react";
import { api } from "../api";

export default function Earnings() {
  const [summary, setSummary]         = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([api.getEarningsSummary(), api.getEarningsTransactions()])
      .then(([s, t]) => { setSummary(s); setTransactions(t); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container"><p className="muted">Loading…</p></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Earnings</h1>
        <p>Your payment history and current balance.</p>
      </div>

      <div className="stats-row">
        {[
          { label: "Available balance",  value: `$${summary?.balance ?? "0.00"}` },
          { label: "Paid out (all time)",value: `$${summary?.allTime ?? "0.00"}` },
          { label: "This month",         value: `$${summary?.thisMonth ?? "0.00"}` },
          { label: "Next payout",        value: summary?.nextPayout ?? "—" },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-block">
        <div className="block-header">
          <h2>Transaction history</h2>
          <span className="muted" style={{ fontSize: 13 }}>Payouts every Monday</span>
        </div>
        <table className="data-table">
          <thead><tr><th>Description</th><th>Date</th><th>Amount</th></tr></thead>
          <tbody>
            {transactions.length === 0 && (
              <tr><td colSpan={3} className="muted">No transactions yet.</td></tr>
            )}
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.description}</td>
                <td className="muted">{t.date}</td>
                <td className={`amount-cell ${t.type}`}>
                  {t.type === "credit" ? "+" : "-"}${Number(t.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
