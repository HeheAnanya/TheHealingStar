const {
  getCurrentCalendlyUser,
  getCalendlyEventTypes,
  createCalendlyWebhookSubscription,
} = require("../services/calendlyService");

async function calendlyConnection(req, res) {
  try {
    const user = await getCurrentCalendlyUser();
    return res.status(200).json({
      connected: true,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Calendly connection error:", error.message);
    return res.status(error.status || 502).json({
      message: error.message || "Unable to connect to Calendly",
    });
  }
}

async function listCalendlyEventTypes(req, res) {
  try {
    const result = await getCalendlyEventTypes();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Calendly event types error:", error.message);
    return res.status(error.status || 502).json({
      message: error.message || "Unable to fetch Calendly event types",
    });
  }
}

async function createCalendlyWebhook(req, res) {
  try {
    const webhookUrl = process.env.CALENDLY_WEBHOOK_URL ||
      `${req.protocol}://${req.get("host")}/calendly/webhook`;
    const subscription = await createCalendlyWebhookSubscription(webhookUrl);
    return res.status(201).json({
      message: "Calendly webhook subscription created. Save the signing key in CALENDLY_WEBHOOK_SIGNING_KEY.",
      webhook: {
        uri: subscription.uri,
        callbackUrl: subscription.callback_url,
        state: subscription.state,
        events: subscription.events,
      },
      signingKey: subscription.signing_key,
    });
  } catch (error) {
    console.error("Calendly webhook setup error:", error.message);
    return res.status(error.status || 502).json({
      message: error.message || "Unable to create Calendly webhook subscription",
    });
  }
}

module.exports = { calendlyConnection, listCalendlyEventTypes, createCalendlyWebhook };
