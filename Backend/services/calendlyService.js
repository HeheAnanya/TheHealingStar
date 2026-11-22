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

async function calendlyRequest(path, options = {}) {
  const response = await fetch(`${CALENDLY_API}${path}`, {
    method: options.method || "GET",
    headers: getHeaders(),
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
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

async function createCalendlyWebhookSubscription(webhookUrl) {
  if (!webhookUrl || !webhookUrl.startsWith("https://")) {
    const error = new Error("Set CALENDLY_WEBHOOK_URL to your public HTTPS webhook endpoint");
    error.status = 400;
    throw error;
  }
  const user = await getCurrentCalendlyUser();
  if (!user.current_organization) {
    const error = new Error("Calendly account organization could not be determined");
    error.status = 502;
    throw error;
  }
  const data = await calendlyRequest("/webhook_subscriptions", {
    method: "POST",
    body: {
      url: webhookUrl,
      events: ["invitee.created", "invitee.canceled"],
      organization: user.current_organization,
      scope: "user",
      user: user.uri,
    },
  });
  return data.resource;
}

module.exports = {
  getCurrentCalendlyUser,
  getCalendlyEventTypes,
  createCalendlyWebhookSubscription,
};
