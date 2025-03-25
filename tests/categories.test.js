const request = require("supertest");
const app = require("../server");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("Kategorie API - CRUD", () => {
  let categoryId;

  afterAll(async () => {
    await prisma.category.deleteMany();
  });

  it("powinien dodać kategorię", async () => {
    const res = await request(app).post("/api/categories").send({
      name: "Nowa Kategoria",
      description: "Opis kategorii",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Nowa Kategoria");
    categoryId = res.body.id;
  });

  it("powinien zwrócić kategorię po ID", async () => {
    const res = await request(app).get(`/api/categories/${categoryId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(categoryId);
  });

  it("powinien zaktualizować kategorię", async () => {
    const res = await request(app).put(`/api/categories/${categoryId}`).send({
      name: "Zmieniona Kategoria",
      description: "Zmieniony opis",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Zmieniona Kategoria");
  });

  it("powinien usunąć kategorię", async () => {
    const res = await request(app).delete(`/api/categories/${categoryId}`);
    expect(res.statusCode).toBe(204);

    const check = await request(app).get(`/api/categories/${categoryId}`);
    expect(check.statusCode).toBe(404);
  });
});
