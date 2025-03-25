const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../server");
const request = require("supertest");

describe("Recenzje API", () => {
  let userId, productId;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        username: "reviewer",
        email: "reviewer@example.com",
        passwordHash: "hash",
        firstName: "Rewiu",
        lastName: "Tester",
      },
    });

    const category = await prisma.category.create({
      data: {
        name: "Do recenzji",
      },
    });

    const product = await prisma.product.create({
      data: {
        name: "Produkt do recenzji",
        description: "Do testowania recenzji",
        price: 222,
        stockCount: 2,
        brand: "TestBrand",
        categoryId: category.id,
      },
    });

    userId = user.id;
    productId = product.id;
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
