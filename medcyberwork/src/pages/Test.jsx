import { useState, useEffect } from "react";
import { api } from "../api";

export default function Test({ navigate }) {
  const [stage, setStage]         = useState("instructions");
  const [sample, setSample]       = useState(null);
  const [transcript, setTranscript] = useState("");
  const [score, setScore]         = useState(null);
  const [timer, setTimer]         = useState(180);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");

  // Fetch sample task on mount
  useEffect(() => {
    api.getTestSample().then(setSample).catch((e) => setError(e.message));
  }, []);

  const startTest = () => {
    setStage("test");
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(interval); submitTest(); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const submitTest = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await api.submitTest(sample?.id, transcript);
      setScore(result.score);
      setStage("results");
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const retry = () => { setStage("instructions"); setTranscript(""); setTimer(180); setScore(null); };

  const mins = String(Math.floor(timer / 60)).padStart(2, "0");
  const secs = String(timer % 60).padStart(2, "0");

  if (error) return <div className="page-container narrow"><div className="error-banner">{error}</div></div>;

  if (stage === "instructions") return (
    <div className="page-container narrow">
      <div className="page-header">
        <h1>Transcription assessment</h1>
        <p>Pass this test to unlock paid work.</p>
      </div>
      <div className="info-list">
        {[
          "Read the sample text and type it out as accurately as possible.",
          "The test is timed at 3 minutes.",
          "A score of 80% or higher unlocks access to paid work.",
          "Medical terminology will appear — accuracy matters more than speed.",
        ].map((s, i) => (
          <div className="info-item" key={i}>
            <span className="info-num">{i + 1}</span>
            <p>{s}</p>
          </div>
        ))}
      </div>
      <button className="btn-primary large" onClick={startTest} disabled={!sample}>
        {sample ? "Start test" : "Loading…"}
      </button>
    </div>
  );

  if (stage === "test") return (
    <div className="page-container narrow">
      <div className="test-header">
        <h2>Transcription test</h2>
        <div className={`timer ${timer < 30 ? "urgent" : ""}`}>{mins}:{secs}</div>
      </div>

      <div className="audio-block">
        <div className="audio-label">Sample text — {sample?.title}</div>
        <div className="mock-transcript-preview">{sample?.sample_text}</div>
      </div>

      <div className="form-group">
        <label htmlFor="transcript">Your transcription</label>
        <textarea id="transcript" rows={8}
          placeholder="Type the text above as accurately as you can…"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
        <span className="char-count">{transcript.trim().split(/\s+/).filter(Boolean).length} words</span>
      </div>

      <button className="btn-primary full-width" onClick={submitTest} disabled={submitting}>
        {submitting ? "Submitting…" : "Submit"}
      </button>
    </div>
  );

  return (
    <div className="page-container narrow centered">
      <div className={`score-circle ${score >= 80 ? "pass" : "fail"}`}>
        <span className="score-num">{score}%</span>
        <span className="score-label">{score >= 80 ? "Pass" : "Fail"}</span>
      </div>
      <h2>{score >= 80 ? "Well done!" : "Not quite there yet"}</h2>
      <p>{score >= 80
        ? "You've unlocked paid transcription work. Head to Work to get started."
        : "You need 80% or higher. Review the sample and try again."
      }</p>
      <div className="result-actions">
        {score >= 80
          ? <button className="btn-primary" onClick={() => navigate("/work")}>Browse work</button>
          : <button className="btn-primary" onClick={retry}>Retry</button>
        }
        <button className="btn-outline" onClick={() => navigate("/dashboard")}>Dashboard</button>
      </div>
    </div>
  );
}
