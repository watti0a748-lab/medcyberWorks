export default function About({ navigate }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>About MedCyberWork</h1>
        <p>We connect healthcare organisations with skilled remote transcriptionists worldwide.</p>
      </div>

      <div className="about-grid">
        <div className="about-block">
          <h2>Our mission</h2>
          <p>
            MedCyberWork was built to solve a real problem: hospitals, clinics, and
            healthcare providers need fast, accurate documentation — and talented people
            need flexible remote work. We bridge that gap.
          </p>
        </div>
        <div className="about-block">
          <h2>What we do</h2>
          <p>
            We provide a platform where certified and aspiring medical transcriptionists
            can find steady, well-paying work transcribing physician dictations, clinical
            notes, and patient records from home.
          </p>
        </div>
        <div className="about-block">
          <h2>Who we work with</h2>
          <p>
            Our clients include private practices, hospital networks, and health-tech
            companies across the US, UK, and beyond. All work is HIPAA-compliant and
            handled with strict confidentiality standards.
          </p>
        </div>
        <div className="about-block">
          <h2>Join the team</h2>
          <p>
            No prior experience? No problem. We offer onboarding resources and a
            structured assessment so anyone with the right skills can get started.
          </p>
          <button className="btn-primary" onClick={() => navigate("/register")} style={{ marginTop: "1rem" }}>
            Apply now
          </button>
        </div>
      </div>
    </div>
  );
}
