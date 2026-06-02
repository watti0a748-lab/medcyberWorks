import { useState, useEffect } from "react";
import { api } from "../api";

export default function Work() {
  const [tab, setTab]           = useState("available");
  const [available, setAvailable] = useState([]);
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [claiming, setClaiming] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getAvailableTasks(), api.getTaskHistory()])
      .then(([a, h]) => { setAvailable(a); setHistory(h); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const claim = async (id) => {
    setClaiming(id);
    try {
      await api.claimTask(id);
      setAvailable((prev) => prev.map((t) => t.id === id ? { ...t, claimed: true } : t));
    } catch (e) {
      alert(e.message);
    } finally {
      setClaiming(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Work</h1>
        <p>Pick up tasks and submit your transcriptions.</p>
      </div>

      <div className="tab-bar">
        <button className={`tab-btn ${tab === "available" ? "active" : ""}`} onClick={() => setTab("available")}>
          Available <span className="tab-count">{available.length}</span>
        </button>
        <button className={`tab-btn ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>
          History
        </button>
      </div>

      {loading ? <p className="muted">Loading…</p> : (
        <>
          {tab === "available" && (
            <div className="task-list">
              {available.length === 0 && <p className="muted">No tasks available right now — check back soon.</p>}
              {available.map((t) => (
                <div className="task-card" key={t.id}>
                  <div className="task-info">
                    <h3>{t.title}</h3>
                    <div className="task-meta">
                      <span className="specialty-tag">{t.specialty}</span>
                      <span className="muted">{t.length_est}</span>
                      <span className="muted">Due in {t.due_hours}h</span>
                    </div>
                  </div>
                  <div className="task-right">
                    <span className="task-pay">${Number(t.pay).toFixed(2)}</span>
                    {t.claimed
                      ? <span className="claimed-badge">Claimed</span>
                      : <button className="btn-primary small"
                          disabled={claiming === t.id}
                          onClick={() => claim(t.id)}>
                          {claiming === t.id ? "…" : "Claim"}
                        </button>
                    }
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "history" && (
            <table className="data-table">
              <thead><tr><th>Task</th><th>Status</th><th>Pay</th></tr></thead>
              <tbody>
                {history.length === 0 && <tr><td colSpan={3} className="muted">No history yet.</td></tr>}
                {history.map((h) => (
                  <tr key={h.id}>
                    <td>{h.title}</td>
                    <td><span className={`status-badge ${h.status}`}>{h.status}</span></td>
                    <td className="pay-cell">{h.pay ? `$${Number(h.pay).toFixed(2)}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
