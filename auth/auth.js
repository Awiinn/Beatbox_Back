const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res, next) => {
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
  try {
    const user = await prisma.users.create({
      data: {
        email: req.body.email,
        password: hashPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      },
    });
    res.status(201).send({
      user: user,
      message: "You have successfully registered your account!",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await prisma.users.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(401).send({
        message:
          "Account with that email address does not exist. Please register an account before logging in.",
      });
    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user?.password
    );
    if (!passwordMatch) {
      return res.status(401).send({ message: "Invalid login credentials" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    return res.status(200).send({ token, message: "Successfully logged in!" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
