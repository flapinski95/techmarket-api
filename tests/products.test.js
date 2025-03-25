const request = require("supertest");
const app = require("../server");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("Produkty API - CRUD + walidacja", () => {
  let categoryId, productId;

  beforeAll(async () => {
    const category = await prisma.category.create({
      data: {
        name: "Testowa Kategoria",
        description: "Opis testowy",
      },
    });
    categoryId = category.id;
  });

  afterAll(async () => {
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.$disconnect();
  });

  it("powinien dodać produkt poprawnie", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Testowy Produkt",
      description: "Opis",
      price: 123.45,
      stockCount: 10,
      brand: "TestBrand",
      imageUrl: "https://example.com/test.jpg",
      categoryId: categoryId,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Testowy Produkt");
    productId = res.body.id;
  });

  it("powinien zwrócić błąd, gdy brakuje categoryId", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Zły Produkt",
      description: "Opis",
      price: 99.99,
      stockCount: 5,
      brand: "Brand",
      imageUrl: "https://example.com/test.jpg",
    });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body.error).toBeDefined();
  });

  it("powinien zwrócić produkt po ID", async () => {
    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(productId);
  });

  it("powinien zaktualizować produkt", async () => {
    const res = await request(app).put(`/api/products/${productId}`).send({
      name: "Zmieniony Produkt",
      description: "Nowy opis",
      price: 149.99,
      stockCount: 8,
      brand: "NowyBrand",
      imageUrl: "https://example.com/updated.jpg",
      categoryId: categoryId,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Zmieniony Produkt");
  });

  it("powinien usunąć produkt", async () => {
    const res = await request(app).delete(`/api/products/${productId}`);
    expect(res.statusCode).toBe(204);

    const check = await request(app).get(`/api/products/${productId}`);
    expect(check.statusCode).toBe(404);
  });
});
