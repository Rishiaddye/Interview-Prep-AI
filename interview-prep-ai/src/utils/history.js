export const saveSessionToHistory = (session) => {
  let history = JSON.parse(localStorage.getItem("sessionHistory") || "[]");

  // Remove if exists (avoid duplicates)
  history = history.filter((item) => item.id !== session.id);

  // Add new entry to top
  history.unshift(session);

  // Limit to last 15 history items (optional)
  history = history.slice(0, 15);

  localStorage.setItem("sessionHistory", JSON.stringify(history));
};
