import { useEffect, useState } from "react";
import { useAuth } from "../App";
import { api } from "../api";

export default function Dashboard({ navigate }) {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getEarningsSummary(), api.getTaskHistory()])
      .then(([s, h]) => { setSummary(s); setHistory(h.slice(0, 3)); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = summary
    ? [
        { label: "Earnings this week", value: `$${summary.thisMonth}` },
        { label: "Tasks completed",    value: history.filter((h) => h.status === "approved").length },
        { label: "Balance",            value: `$${summary.balance}` },
        { label: "Account status",     value: user?.status === "active" ? "Active" : "Pending test" },
      ]
    : [];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome back, {user?.name}</h1>
        <p>Here's what's happening with your account today.</p>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <>
          <div className="stats-row">
            {stats.map((s) => (
              <div className="stat-card" key={s.label}>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-block">
              <div className="block-header">
                <h2>Recent work</h2>
                <button className="link-btn" onClick={() => navigate("/work")}>View all</button>
              </div>
              {history.length === 0 ? (
                <p className="muted" style={{ fontSize: 13 }}>No tasks yet — <button className="link-btn" onClick={() => navigate("/work")}>pick one up</button>.</p>
              ) : (
                <table className="data-table">
                  <thead><tr><th>Task</th><th>Status</th><th>Pay</th></tr></thead>
                  <tbody>
                    {history.map((r) => (
                      <tr key={r.id}>
                        <td>{r.title}</td>
                        <td><span className={`status-badge ${r.status}`}>{r.status}</span></td>
                        <td className="pay-cell">${Number(r.pay).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="dashboard-block">
              <div className="block-header"><h2>Quick actions</h2></div>
              <div className="quick-actions">
                {[
                  { icon: "📋", label: "Pick up new work",   path: "/work" },
                  { icon: "📝", label: "Retake assessment",  path: "/test" },
                  { icon: "💰", label: "View earnings",      path: "/earnings" },
                  { icon: "👤", label: "Update profile",     path: "/profile" },
                ].map((a) => (
                  <button className="action-btn" key={a.path} onClick={() => navigate(a.path)}>
                    <span className="action-icon">{a.icon}</span>
                    <span>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
