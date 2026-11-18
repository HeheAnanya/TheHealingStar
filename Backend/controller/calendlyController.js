const {
  getCurrentCalendlyUser,
  getCalendlyEventTypes,
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

module.exports = { calendlyConnection, listCalendlyEventTypes };
