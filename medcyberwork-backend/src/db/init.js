import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

// Single shared pool — imported everywhere
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Helper: run a query and get rows back
export const query = (text, params) => pool.query(text, params);

// ── Schema + seed ─────────────────────────────────────────────
export async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id         SERIAL PRIMARY KEY,
      name       TEXT        NOT NULL,
      email      TEXT        NOT NULL UNIQUE,
      password   TEXT        NOT NULL,
      specialty  TEXT        NOT NULL DEFAULT 'General',
      bio        TEXT        NOT NULL DEFAULT '',
      test_score INTEGER     DEFAULT NULL,
      status     TEXT        NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id        SERIAL PRIMARY KEY,
      title     TEXT NOT NULL,
      type      TEXT NOT NULL,
      pay       TEXT NOT NULL,
      specialty TEXT NOT NULL,
      location  TEXT NOT NULL DEFAULT 'Remote',
      tags      JSONB NOT NULL DEFAULT '[]',
      active    BOOLEAN NOT NULL DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id          SERIAL PRIMARY KEY,
      title       TEXT    NOT NULL,
      specialty   TEXT    NOT NULL,
      audio_url   TEXT,
      sample_text TEXT    NOT NULL,
      length_est  TEXT    NOT NULL,
      pay         NUMERIC(8,2) NOT NULL,
      due_hours   INTEGER NOT NULL,
      available   BOOLEAN NOT NULL DEFAULT TRUE,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS claims (
      id           SERIAL PRIMARY KEY,
      user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      task_id      INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      transcript   TEXT,
      status       TEXT NOT NULL DEFAULT 'claimed',
      claimed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      submitted_at TIMESTAMPTZ,
      UNIQUE(user_id, task_id)
    );

    CREATE TABLE IF NOT EXISTS earnings (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      claim_id    INTEGER REFERENCES claims(id) ON DELETE SET NULL,
      amount      NUMERIC(8,2) NOT NULL,
      type        TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Seed jobs
  const { rows: [{ count: jobCount }] } = await query("SELECT COUNT(*) FROM jobs");
  if (Number(jobCount) === 0) {
    await query(`
      INSERT INTO jobs (title, type, pay, specialty, tags) VALUES
        ('Medical Transcriptionist – General Practice', 'Part-time',  '$18–$22/hr', 'General',    '["Entry level","Flexible hours"]'),
        ('Clinical Documentation Specialist',           'Full-time',  '$24–$28/hr', 'General',    '["2 yrs exp","HIPAA"]'),
        ('Radiology Transcriptionist',                  'Contract',   '$20–$25/hr', 'Radiology',  '["Radiology","Fast turnaround"]'),
        ('Pathology Report Transcriptionist',           'Part-time',  '$19–$23/hr', 'Pathology',  '["Pathology","Entry level"]'),
        ('Surgical Report Transcriptionist',            'Full-time',  '$22–$26/hr', 'Surgery',    '["Surgery","Detail-oriented"]'),
        ('Psychiatric Notes Transcriptionist',          'Contract',   '$21–$24/hr', 'Psychiatry', '["Mental health","Confidential"]')
    `);
  }

  // Seed tasks
  const { rows: [{ count: taskCount }] } = await query("SELECT COUNT(*) FROM tasks");
  if (Number(taskCount) === 0) {
    await query(`
      INSERT INTO tasks (title, specialty, sample_text, length_est, pay, due_hours) VALUES
        ('Cardiology consultation note',  'Cardiology',   'Patient is a 54-year-old male presenting with chest pain radiating to the left arm. Blood pressure 142/88. ECG shows mild ST-segment changes. Referred for cardiac evaluation. Prescribed aspirin 81mg daily.',          '~3 min', 4.50, 2),
        ('Orthopedic post-op report',     'Orthopedics',  'Post-operative report for right knee arthroplasty. Procedure completed without complications. Patient to begin physiotherapy in 48 hours. Prescribed paracetamol 500mg every 6 hours as needed.',                    '~5 min', 7.20, 4),
        ('GP referral letter',            'General',      'Referring patient to cardiology outpatient clinic for evaluation of recurrent palpitations. Patient has a history of hypertension managed with amlodipine 5mg daily.',                                              '~1 min', 1.80, 6),
        ('Radiology imaging report',      'Radiology',    'Chest X-ray PA view. Mild cardiomegaly noted. No acute consolidation or pleural effusion. Lung fields otherwise clear. Recommend follow-up CT if symptoms persist.',                                                '~4 min', 6.00, 3),
        ('Psychiatric assessment note',   'Psychiatry',   'Patient presents with persistent low mood, anhedonia and disturbed sleep for 6 weeks. PHQ-9 score 16. Commenced on sertraline 50mg daily. Follow-up in 4 weeks.',                                                  '~6 min', 8.50, 8)
    `);
  }

  console.log("✓ PostgreSQL schema ready");
}
