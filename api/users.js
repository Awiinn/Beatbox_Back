const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.users.findMany();
    res.send(users);
  } catch (error) {
    next(error);
  }
});


router.get("/:id", async (req, res, next) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User was not found" });
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
});


router.put("/:id", async (req, res, next) => {
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
  try {
    const userId = parseInt(req.params.id);
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        email: req.body.email,
        password: hashPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      },
    });
    if (!updatedUser) {
      return res.status(401).send("User not found.");
    }
    return res.status(200).send("User information updated successfully!");
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const deletedUser = await prisma.users.delete({
      where: { id: userId },
    });
    if (!deletedUser) {
      return res.status(401).send("User not found.");
    }
    res.status(200).send("User deleted successfully!");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
