const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../server");
const request = require("supertest");

describe("Recenzje API", () => {
  let userId, productId;

  beforeAll(async () => {
    const category = await prisma.category.create({
      data: { name: "Testowa", description: "Opis" },
    });

    const product = await prisma.product.create({
      data: {
        name: "Produkt",
        description: "Opis",
        price: 123,
        stockCount: 10,
        brand: "Brand",
        imageUrl: "https://img.jpg",
        categoryId: category.id,
      },
    });

    const user = await prisma.user.create({
      data: {
        username: "recenzent",
        email: "rec@example.com",
        passwordHash: "tajne",
        firstName: "Imie",
        lastName: "Nazwisko",
      },
    });

    productId = product.id;
    userId = user.id;

    console.log("Product ID:", productId);
    console.log("User ID:", userId);
  });

  afterAll(async () => {
    await prisma.review.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();
    await prisma.$disconnect();
  });

  it("dodaje recenzję poprawnie", async () => {
    const response = await request(app).post("/api/reviews").send({
      productId: productId,
      userId: userId,
      rating: 5,
      comment: "Recenzja testowa",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.rating).toBe(5);
    expect(response.body.comment).toContain("Recenzja");
  });
});
