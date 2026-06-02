import { useState } from "react";
import { useAuth } from "../App";
import { api } from "../api";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm]   = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await api.login(form);
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
        <h2>Welcome back</h2>
        <p className="auth-sub">Log in to your account</p>
        {error && <div className="error-banner">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" placeholder="you@example.com"
            value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="••••••••"
            value={form.password} onChange={handleChange} required />
        </div>
        <button className="btn-primary full-width" type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>
        <p className="auth-footer">Don't have an account? <a href="#/register">Sign up</a></p>
      </form>
    </div>
  );
}
