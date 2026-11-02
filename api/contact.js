const json = (res, status, body) => {
  res.status(status).setHeader("Content-Type", "application/json").json(body);
};

const clean = (value, max) => String(value || "").trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { message: "Method not allowed." });
  }

  const { name, email, phone, message, website } = req.body || {};

  // Quiet bot trap: return a success response without storing spam.
  if (website) return json(res, 200, { message: "Message received." });

  const safeName = clean(name, 100);
  const safeEmail = clean(email, 254).toLowerCase();
  const safePhone = clean(phone, 30);
  const safeMessage = clean(message, 3000);

  if (!safeName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail) || !safeMessage) {
    return json(res, 400, { message: "Please enter a valid name, email and message." });
  }

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, CONTACT_NOTIFICATION_EMAIL } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(res, 503, { message: "The contact form is not configured yet. Please email or call us directly." });
  }

  try {
    const insertResponse = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/contact_enquiries`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify([{
        name: safeName,
        email: safeEmail,
        phone: safePhone || null,
        message: safeMessage,
      }]),
    });

    if (!insertResponse.ok) {
      const details = await insertResponse.text();
      console.error("Supabase contact insert failed:", details);
      return json(res, 502, { message: "We couldn't save your message. Please try again or contact us directly." });
    }

    let notificationSent = false;
    if (RESEND_API_KEY && CONTACT_NOTIFICATION_EMAIL) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "The Healing Star Website <onboarding@resend.dev>",
          to: [CONTACT_NOTIFICATION_EMAIL],
          subject: `New website enquiry from ${safeName}`,
          text: [
            "A new contact form enquiry was saved.",
            `Name: ${safeName}`,
            `Email: ${safeEmail}`,
            `Phone: ${safePhone || "Not provided"}`,
            "",
            "Message:",
            safeMessage,
          ].join("\n"),
          reply_to: safeEmail,
        }),
      });
      notificationSent = emailResponse.ok;
      if (!notificationSent) console.error("Resend notification failed:", await emailResponse.text());
    }

    return json(res, 200, {
      message: notificationSent
        ? "Your message has been received. We'll get back to you soon."
        : "Your message has been saved, but our email alert is not configured yet.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return json(res, 500, { message: "Something went wrong. Please try again later." });
  }
}
