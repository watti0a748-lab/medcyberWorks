export default function Home({ navigate }) {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">Healthcare Documentation</span>
          <h1 className="hero-title">
            Work from home as a<br />
            <span className="accent">Medical Transcriptionist</span>
          </h1>
          <p className="hero-sub">
            Join thousands of professionals transcribing healthcare records remotely.
            Flexible hours, competitive pay, no experience required to apply.
          </p>
          <div className="hero-cta">
            <button className="btn-primary large" onClick={() => navigate("/register")}>
              Get started
            </button>
            <button className="btn-outline large" onClick={() => navigate("/jobs")}>
              Browse jobs
            </button>
          </div>
        </div>
        <div className="hero-stats">
          {[
            { value: "5,000+", label: "Active transcriptionists" },
            { value: "$18–$28", label: "Average hourly rate" },
            { value: "100%", label: "Remote work" },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="how-it-works">
        <h2>How it works</h2>
        <div className="steps">
          {[
            { step: "01", title: "Create an account", desc: "Sign up in under 2 minutes with your basic details." },
            { step: "02", title: "Pass the test",     desc: "Take a short transcription assessment to verify your skills." },
            { step: "03", title: "Pick up work",      desc: "Browse available tasks and start earning immediately." },
            { step: "04", title: "Get paid",          desc: "Earnings are processed weekly directly to your account." },
          ].map((s) => (
            <div className="step" key={s.step}>
              <span className="step-num">{s.step}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
