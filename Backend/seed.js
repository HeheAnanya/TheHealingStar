const prisma = require("./prisma/client");

const bracelets = require("../src/Pages/Shop/data/bracelet.json");
const rings = require("../src/Pages/Shop/data/ring.json");
const salt = require("../src/Pages/Shop/data/salt.json");
const evileye = require("../src/Pages/Shop/data/evileye.json");
const trees = require("../src/Pages/Shop/data/tree.json");
const spheres = require("../src/Pages/Shop/data/sphere.json");
const earrings = require("../src/Pages/Shop/data/earring.json");
const pendants = require("../src/Pages/Shop/data/pendant.json");
const numerology = require("../src/Pages/Shop/data/numerology.json");
const reiki = require("../src/Pages/Shop/data/reiki.json");
const tarot = require("../src/Pages/Shop/data/tarot.json");

const categories = [
  { products: bracelets, category: "CRYSTAL" },
  { products: rings, category: "CRYSTAL" },
  { products: salt, category: "CRYSTAL" },
  { products: evileye, category: "CRYSTAL" },
  { products: trees, category: "CRYSTAL" },
  { products: spheres, category: "CRYSTAL" },
  { products: earrings, category: "CRYSTAL" },
  { products: pendants, category: "CRYSTAL" },
  { products: numerology, category: "NUMEROLOGY" },
  { products: reiki, category: "REIKI_HEALING" },
  { products: tarot, category: "TAROT" },
];

async function seedProducts() {
  let created = 0;
  let skipped = 0;

  for (const group of categories) {
    for (const item of group.products) {
      const productName = item.name?.trim();

      if (!productName) {
        console.warn("Skipping product without a name:", item);
        skipped++;
        continue;
      }

      // Convert "₹500" into 500
      const price = Number(
        String(item.price ?? "").replace(/[^\d.]/g, "")
      );

      if (!Number.isFinite(price) || price <= 0) {
        console.warn(`Skipping invalid price: ${productName}`);
        skipped++;
        continue;
      }

      // Avoid inserting the same product again on reruns
      const existingProduct = await prisma.product.findFirst({
        where: { productName },
      });

      if (existingProduct) {
        console.log(`Already exists: ${productName}`);
        skipped++;
        continue;
      }

      await prisma.product.create({
        data: {
          productName,
          description: item.des || "",
          price: Math.round(price),
          stock: 20,
          status: "ACTIVE",
          productCategory: group.category,
        },
      });

      console.log(`Added: ${productName}`);
      created++;
    }
  }

  console.log("\nProduct seeding completed!");
  console.log(`Products created: ${created}`);
  console.log(`Products skipped: ${skipped}`);
}

seedProducts()
//   .catch((error) => {
    
//     console.error("Product seeding failed:", error);
//     process.exitCode = 1;
//   })
.catch((error) => {
  console.error("Product seeding failed!");
  console.error("Error code:", error.code);
  console.error("Error message:", error.message);
  console.error("Error metadata:", error.meta);
  process.exitCode = 1;
})
  .finally(async () => {
    await prisma.$disconnect();
  });
