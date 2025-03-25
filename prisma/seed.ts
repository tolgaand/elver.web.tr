import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  try {
    await db.helpPostTag.deleteMany();
    await db.needPostTag.deleteMany();
    await db.helpOffer.deleteMany();
    await db.helpPost.deleteMany();
    await db.needPost.deleteMany();
    await db.tag.deleteMany();
    await db.subCategory.deleteMany();
    await db.category.deleteMany();
    await db.user.deleteMany();

    console.log("Cleared existing data");

    const categories = [
      {
        name: "Temel İhtiyaçlar",
        slug: "basic-needs",
        description: "Gıda, su, barınma, giyim",
        icon: "home",
      },
      {
        name: "Sağlık",
        slug: "health",
        description: "İlaç, sağlık hizmetleri, psikolojik destek",
        icon: "heart",
      },
      {
        name: "Ulaşım",
        slug: "transportation",
        description: "Ulaşım hizmetleri, araç paylaşımı",
        icon: "car",
      },
      {
        name: "Barınma",
        slug: "accommodation",
        description: "Geçici barınma, konaklama",
        icon: "home",
      },
      {
        name: "Eğitim",
        slug: "education",
        description: "Eğitim materyalleri, özel ders, kurslar",
        icon: "book",
      },
      {
        name: "Teknik Destek",
        slug: "technical-support",
        description: "Bilişim desteği, elektrik, mekanik, tamirat",
        icon: "tool",
      },
      {
        name: "Hukuki Destek",
        slug: "legal-support",
        description: "Hukuki yardım, belgelendirme",
        icon: "briefcase",
      },
      {
        name: "Diğer",
        slug: "others",
        description: "Diğer yardım türleri",
        icon: "more-horizontal",
      },
    ];

    for (const category of categories) {
      await db.category.create({
        data: category,
      });
    }

    console.log("Categories seeded");

    const tags = [
      { name: "Acil", value: "urgent" },
      { name: "Çocuklar İçin", value: "for-children" },
      { name: "Yaşlılar İçin", value: "for-elderly" },
      { name: "Engelliler İçin", value: "for-disabled" },
      { name: "Afet Bölgesi", value: "disaster-area" },
      { name: "Uzun Vadeli", value: "long-term" },
      { name: "Tek Seferlik", value: "one-time" },
      { name: "Düzenli", value: "regular" },
    ];

    for (const tag of tags) {
      await db.tag.create({
        data: tag,
      });
    }

    console.log("Tags seeded");

    const otherCategory = await db.category.findFirst({
      where: { slug: "others" },
    });

    if (otherCategory) {
      const subCategories = [
        {
          name: "Diğer Hizmetler",
          slug: "other-services",
          categoryId: otherCategory.id,
        },
        {
          name: "Diğer Malzemeler",
          slug: "other-materials",
          categoryId: otherCategory.id,
        },
      ];

      for (const subCategory of subCategories) {
        await db.subCategory.create({
          data: subCategory,
        });
      }

      console.log("SubCategories seeded");
    }

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main()
  .then(() => console.log("Seeding complete"))
  .catch((e) => {
    console.error("Error in seed process:", e);
    process.exit(1);
  });
