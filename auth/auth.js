const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/auth/callback";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";


function generateAccessToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "120m" }); // Adjust expiration time as see fits
}


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
    const authUrl = `${AUTH_ENDPOINT}?client_id=${client_id}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=code&scope=user-read-private%20user-read-email`;
    res.redirect(authUrl);
  } catch (error) {
    console.error("Error:", error.message); 
    return res.status(500).send({ message: "An error occurred during login" });
  }
});


router.get("/callback", async (req, res, next) => {
  try {
    const { code } = req.query;
    const tokenResponse = await axios.post(
      SPOTIFY_TOKEN_ENDPOINT,
      {
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: client_id,
        client_secret: client_secret,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;

    const userDataResponse = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData = userDataResponse.data;

    const generatedAccessToken = generateAccessToken(userData.id);

    return res.status(200).send({
      user: userData,
      accessToken: generatedAccessToken,
      message: "Successfully logged in!",
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).send({ message: "An error occurred during login" });
  }
});

module.exports = router;
