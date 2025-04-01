const mongoose = require("mongoose");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../server");
const request = require("supertest");
const Review = require("../src/models/Review");

let productId = 101;
let userId = 12;
let reviewId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await prisma.basket.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
  await mongoose.disconnect();
});

describe("Recenzje API (MongoDB)", () => {
  it("dodaje recenzję poprawnie", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .send({
        productId,
        userId,
        rating: 5,
        title: "Super",
        content: "Recenzja testowa",
        pros: ["Szybki", "Wydajny"],
        cons: ["Głośny"],
        verifiedPurchase: true,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Super");
    reviewId = res.body._id;
  });

  it("pobiera recenzje dla produktu", async () => {
    const res = await request(app).get(
      `/api/reviews/${productId}?page=1&limit=5`
    );
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("aktualizuje recenzję", async () => {
    const res = await request(app).put(`/api/reviews/${reviewId}`).send({
      rating: 4,
      title: "Zmieniona recenzja",
      content: "Po czasie zauważyłem minusy",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toContain("Zmieniona");
  });

  it("liczy statystyki recenzji", async () => {
    const res = await request(app).get(`/api/reviews/${productId}/stats`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("average");
    expect(res.body).toHaveProperty("distribution");
  });

  it("wyszukuje recenzje", async () => {
    const res = await request(app).get(
      `/api/reviews/search/${productId}?q=minusy&minRating=3`
    );
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("głosuje na pomocność recenzji", async () => {
    const res = await request(app).post(`/api/reviews/${reviewId}/vote`);
    expect(res.statusCode).toBe(200);
    expect(res.body.helpfulVotes).toBe(1);
  });

  it("usuwa recenzję", async () => {
    const res = await request(app).delete(`/api/reviews/${reviewId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain("usunięta");
  });
});
