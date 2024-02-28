const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    await prisma.users.deleteMany();

    // Reset auto-increment sequence
    await prisma.$executeRaw`ALTER SEQUENCE users_id_seq RESTART WITH 1;`;

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("password", saltRounds);

    // Users data
    const usersData = [
      {
        email: "admin@example.com",
        password: hashedPassword,
        firstName: "admin",
        lastName: "admin",
        role: "ADMIN", // Use enum value "ADMIN"
      },
      {
        email: "user@example.com",
        password: hashedPassword,
        firstName: "user",
        lastName: "user",
        role: "USER", // Use enum value "USER"
      },
    ];

    // Create users
    await Promise.all(
      usersData.map((userData) => prisma.users.create({ data: userData }))
    );

    console.log("Seeding successful");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
