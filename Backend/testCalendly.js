
require("dotenv").config();

async function testCalendly() {
  try {
    const response = await fetch("https://api.calendly.com/users/me", {
      headers: {
        Authorization: `Bearer ${process.env.CALENDLY_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    console.log("Status:", response.status);

    if (!response.ok) {
      console.log("API Error:", data);
      return;
    }

    console.log("Calendly connected successfully!");
    console.log("User:", data.resource.name);
    console.log("Email:", data.resource.email);
    console.log("Organization:", data.resource.current_organization);
  } catch (error) {
    console.error("Connection failed:", error.message);
  }
}

testCalendly();
