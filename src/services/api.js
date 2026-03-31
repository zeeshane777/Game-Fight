async function request(path, options = {}, token) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Erreur API");
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  get: (path, token) => request(path, { method: "GET" }, token),
  post: (path, body, token) =>
    request(path, { method: "POST", body: JSON.stringify(body) }, token),
  put: (path, body, token) =>
    request(path, { method: "PUT", body: JSON.stringify(body) }, token),
  patch: (path, body, token) =>
    request(
      path,
      body === undefined
        ? { method: "PATCH" }
        : { method: "PATCH", body: JSON.stringify(body) },
      token
    ),
  delete: (path, token) => request(path, { method: "DELETE" }, token),
};
