const request = require("supertest");
const app = require("../server");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("Koszyk API - CRUD + logika dodawania produktu", () => {
  let userId, productId, basketId;

  beforeAll(async () => {
    const category = await prisma.category.create({
      data: { name: "Koszykowa", description: "Do testu" },
    });

    const product = await prisma.product.create({
      data: {
        name: "Produkt do koszyka",
        description: "Opis produktu",
        price: 99.99,
        stockCount: 100,
        brand: "TestBrand",
        imageUrl: "https://example.com/prod.jpg",
        categoryId: category.id,
      },
    });

    const user = await prisma.user.create({
      data: {
        username: "koszykowy",
        email: "basket@example.com",
        passwordHash: "sekret",
        firstName: "Jan",
        lastName: "Koszyk",
      },
    });

    productId = product.id;
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.basket.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("powinien dodać produkt do koszyka", async () => {
    const res = await request(app).post("/api/basket").send({
      userId,
      productId,
      amount: 3,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.userId).toBe(userId);
    expect(res.body.productId).toBe(productId);
    expect(res.body.amount).toBe(3);
    basketId = res.body.id;
  });

  it("powinien zaktualizować ilość jeśli produkt już jest w koszyku", async () => {
    const res = await request(app).post("/api/basket").send({
      userId,
      productId,
      amount: 2,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.amount).toBe(5); // 3 + 2
  });

  it("powinien pobrać koszyk po ID", async () => {
    const res = await request(app).get(`/api/basket/${basketId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(basketId);
  });

  it("powinien zaktualizować zawartość koszyka", async () => {
    const res = await request(app).put(`/api/basket/${basketId}`).send({
      userId,
      productId,
      amount: 7,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.amount).toBe(7);
  });

  it("powinien usunąć koszyk", async () => {
    const res = await request(app).delete(`/api/basket/${basketId}`);
    expect(res.statusCode).toBe(204);

    const check = await request(app).get(`/api/basket/${basketId}`);
    expect(check.statusCode).toBe(404);
  });
});
