const CALENDLY_API = "https://api.calendly.com";

function getHeaders() {
  const token = process.env.CALENDLY_ACCESS_TOKEN;
  if (!token) {
    const error = new Error("CALENDLY_ACCESS_TOKEN is not configured");
    error.status = 500;
    throw error;
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function calendlyRequest(path) {
  const response = await fetch(`${CALENDLY_API}${path}`, {
    headers: getHeaders(),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || data.title || "Calendly API request failed"
    );
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
}

async function getCurrentCalendlyUser() {
  const data = await calendlyRequest("/users/me");
  return data.resource;
}

async function getCalendlyEventTypes() {
  const user = await getCurrentCalendlyUser();
  const params = new URLSearchParams({
    user: user.uri,
    count: "100",
    sort: "name:asc",
  });
  const data = await calendlyRequest(`/event_types?${params.toString()}`);

  return {
    user: {
      name: user.name,
      email: user.email,
      uri: user.uri,
    },
    eventTypes: (data.collection || []).map((event) => ({
      uri: event.uri,
      name: event.name,
      duration: event.duration,
      schedulingUrl: event.scheduling_url,
      active: event.active,
      kind: event.kind,
    })),
  };
}

module.exports = { getCurrentCalendlyUser, getCalendlyEventTypes };
