import { useState, useEffect } from "react";
import { api } from "../api";

export default function Jobs({ navigate }) {
  const [jobs, setJobs]     = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");
  const types = ["All", "Full-time", "Part-time", "Contract"];

  useEffect(() => {
    setLoading(true);
    api.getJobs(filter)
      .then(setJobs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Open positions</h1>
        <p>All roles are fully remote. Apply once, work for multiple clients.</p>
      </div>
      <div className="filter-bar">
        {types.map((t) => (
          <button key={t} className={`filter-btn ${filter === t ? "active" : ""}`}
            onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>
      {loading && <p className="muted">Loading jobs…</p>}
      {error   && <p style={{ color: "red" }}>{error}</p>}
      <div className="job-list">
        {jobs.map((job) => (
          <div className="job-card" key={job.id}>
            <div className="job-card-left">
              <h3>{job.title}</h3>
              <div className="job-meta">
                <span>{job.type}</span><span>·</span>
                <span>{job.location}</span><span>·</span>
                <span className="job-pay">{job.pay}</span>
              </div>
              <div className="job-tags">
                {job.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
              </div>
            </div>
            <button className="btn-primary" onClick={() => navigate("/register")}>Apply</button>
          </div>
        ))}
      </div>
    </div>
  );
}
