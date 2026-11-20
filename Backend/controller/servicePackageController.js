const prisma = require("../prisma/client");

const categories = ["TAROT", "REIKI", "NUMEROLOGY"];

function packageInput(body) {
  const name = String(body.name || "").trim();
  const category = String(body.category || "").toUpperCase();
  const price = Number(body.price);
  const durationMinutes = Number(body.durationMinutes);
  const description = body.description == null ? null : String(body.description).trim();
  const calendlyEventTypeUri = body.calendlyEventTypeUri ? String(body.calendlyEventTypeUri).trim() : null;
  const schedulingUrl = body.schedulingUrl ? String(body.schedulingUrl).trim() : null;

  if (!name || name.length > 120) throw new Error("Package name is required (maximum 120 characters)");
  if (!categories.includes(category)) throw new Error("Choose Tarot, Reiki or Numerology");
  if (!Number.isInteger(price) || price < 1) throw new Error("Price must be a positive whole number in INR");
  if (!Number.isInteger(durationMinutes) || durationMinutes < 1) throw new Error("Duration must be a positive number of minutes");
  if (calendlyEventTypeUri && !calendlyEventTypeUri.startsWith("https://api.calendly.com/event_types/")) {
    throw new Error("Enter a valid Calendly Event Type URI");
  }
  if (schedulingUrl && !schedulingUrl.startsWith("https://")) {
    throw new Error("Calendly scheduling URL must start with https://");
  }
  return { name, category, price, durationMinutes, description, calendlyEventTypeUri, schedulingUrl };
}

async function publicPackages(req, res) {
  try {
    const packages = await prisma.servicePackage.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { durationMinutes: "asc" }],
      select: {
        id: true, name: true, category: true, description: true,
        price: true, durationMinutes: true, isActive: true,
      },
    });
    return res.json(packages);
  } catch (error) {
    console.error("Public service packages error:", error);
    return res.status(500).json({ message: "Unable to load service packages" });
  }
}

async function adminPackages(req, res) {
  try {
    const packages = await prisma.servicePackage.findMany({
      orderBy: [{ category: "asc" }, { durationMinutes: "asc" }],
    });
    return res.json(packages);
  } catch (error) {
    console.error("Admin service packages error:", error);
    return res.status(500).json({ message: "Unable to load service packages" });
  }
}

async function createPackage(req, res) {
  try {
    const data = packageInput(req.body);
    const created = await prisma.servicePackage.create({ data });
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Unable to create package" });
  }
}

async function updatePackage(req, res) {
  try {
    const id = Number(req.params.packageId);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Invalid package ID" });
    const data = packageInput(req.body);
    const updated = await prisma.servicePackage.update({ where: { id }, data });
    return res.json(updated);
  } catch (error) {
    return res.status(error.code === "P2025" ? 404 : 400).json({ message: error.message || "Unable to update package" });
  }
}

async function setPackageActive(req, res) {
  try {
    const id = Number(req.params.packageId);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Invalid package ID" });
    const updated = await prisma.servicePackage.update({
      where: { id },
      data: { isActive: Boolean(req.body.isActive) },
    });
    return res.json(updated);
  } catch (error) {
    return res.status(error.code === "P2025" ? 404 : 400).json({ message: error.message || "Unable to update package status" });
  }
}

module.exports = { publicPackages, adminPackages, createPackage, updatePackage, setPackageActive };
