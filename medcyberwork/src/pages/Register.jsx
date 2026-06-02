import { useState } from "react";
import { useAuth } from "../App";
import { api } from "../api";

export default function Register() {
  const { login } = useAuth();
  const [form, setForm]   = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) return setError("Passwords don't match.");
    if (form.password.length < 8)      return setError("Password must be at least 8 characters.");
    setLoading(true);
    try {
      const data = await api.register({ name: form.name, email: form.email, password: form.password });
      login(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">MedCyberWork</div>
        <h2>Create account</h2>
        <p className="auth-sub">Start earning as a medical transcriptionist</p>
        {error && <div className="error-banner">{error}</div>}
        <div className="form-group">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" placeholder="Jane Doe"
            value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" placeholder="you@example.com"
            value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Min. 8 characters"
            value={form.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="confirm">Confirm password</label>
          <input id="confirm" name="confirm" type="password" placeholder="Repeat password"
            value={form.confirm} onChange={handleChange} required />
        </div>
        <button className="btn-primary full-width" type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>
        <p className="auth-footer">Already have an account? <a href="#/login">Log in</a></p>
      </form>
    </div>
  );
}
