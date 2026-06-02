const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("mcw_token");
}

async function request(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  // Auth
  register: (body)          => request("POST", "/auth/register", body),
  login:    (body)          => request("POST", "/auth/login",    body),

  // Jobs
  getJobs:  (type)          => request("GET",  `/jobs${type && type !== "All" ? `?type=${encodeURIComponent(type)}` : ""}`),

  // Tasks
  getAvailableTasks: ()     => request("GET",  "/tasks/available"),
  claimTask: (id)           => request("POST", `/tasks/${id}/claim`),
  submitTask: (id, transcript) => request("POST", `/tasks/${id}/submit`, { transcript }),
  getTaskHistory: ()        => request("GET",  "/tasks/history"),

  // Test
  getTestSample: ()         => request("GET",  "/test/sample"),
  submitTest: (taskId, transcript) => request("POST", "/test/submit", { taskId, transcript }),

  // Earnings
  getEarningsSummary:      () => request("GET", "/earnings/summary"),
  getEarningsTransactions: () => request("GET", "/earnings/transactions"),

  // Profile
  getProfile:    ()         => request("GET",  "/profile"),
  updateProfile: (body)     => request("PUT",  "/profile", body),

  // Contact
  sendContact: (body)       => request("POST", "/contact", body),
};
