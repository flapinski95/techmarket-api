const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../server");
const request = require("supertest");

describe("Użytkownicy API - CRUD", () => {
  let userId;

  afterAll(async () => {
    await prisma.user.deleteMany();
  });

  it("powinien dodać użytkownika", async () => {
    const res = await request(app).post("/api/users").send({
      username: "janek.dev",
      email: "janek@example.com",
      passwordHash: "supertajne",
      firstName: "Jan",
      lastName: "Nowak",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe("janek.dev");
    userId = res.body.id;
  });

  it("powinien zwrócić użytkownika po ID", async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(userId);
  });

  it("powinien zaktualizować użytkownika", async () => {
    const res = await request(app).put(`/api/users/${userId}`).send({
      username: "zmieniony.dev",
      email: "zmieniony@example.com",
      passwordHash: "jeszczelepsze",
      firstName: "Zmieniony",
      lastName: "Użytkownik",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe("zmieniony.dev");
  });

  it("powinien usunąć użytkownika", async () => {
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.statusCode).toBe(204);

    const check = await request(app).get(`/api/users/${userId}`);
    expect(check.statusCode).toBe(404);
  });
});
