import { useState, useEffect } from "react";
import { useAuth } from "../App";
import { api } from "../api";

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", specialty: "General", bio: "" });
  const [saved, setSaved]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    api.getProfile()
      .then((p) => setForm({ name: p.name, email: p.email, specialty: p.specialty, bio: p.bio || "" }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setSaved(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.updateProfile(form);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="page-container narrow"><p className="muted">Loading…</p></div>;

  return (
    <div className="page-container narrow">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your account details and preferences.</p>
      </div>
      {error && <div className="error-banner" style={{ marginBottom: "1rem" }}>{error}</div>}
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="p-name">Full name</label>
          <input id="p-name" name="name" type="text" value={form.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="p-email">Email address</label>
          <input id="p-email" name="email" type="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="p-specialty">Preferred specialty</label>
          <select id="p-specialty" name="specialty" value={form.specialty} onChange={handleChange}>
            {["General","Cardiology","Radiology","Orthopedics","Psychiatry","Surgery","Pathology"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="p-bio">Short bio</label>
          <textarea id="p-bio" name="bio" rows={4}
            placeholder="Tell us about your background…"
            value={form.bio} onChange={handleChange} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button className="btn-primary" type="submit">Save changes</button>
          {saved && <span className="save-confirm">✓ Saved</span>}
        </div>
      </form>
    </div>
  );
}
