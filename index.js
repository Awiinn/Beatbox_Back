const express = require("express");
// const cors = require('cors');
// const path = require('path');
const dotenv = require("dotenv");
const request = require("request");
// const SpotifyWebApi = require('spotify-web-api-node');

const port = 5000;

dotenv.config();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/auth/callback";

let access_token = '';

const generateRandomString = (length) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const app = express();

app.get("/auth/login", (req, res) => {
  const scope = "streaming user-read-email user-read-private";
  const state = generateRandomString(16);

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state
  });

  res.redirect("https://accounts.spotify.com/authorize/?" + auth_query_parameters.toString());
});

app.get("/auth/callback", (req, res) => {
  const code = req.query.code;

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code"
    },
    headers: {
      Authorization: "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.redirect("/");
    }
  });
});

app.get("/auth/token", (req, res) => {
  res.json({ access_token: access_token });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

module.exports = app;

// const app = express();
// const port = process.env.PORT || 3000;

// dotenv.config();

// app.use(cors());
// app.use(express.json());

// // Initialize Spotify Web API instance
// const spotifyApi = new SpotifyWebApi({
//   clientId: process.env.CLIENT_ID,
//   clientSecret: process.env.CLIENT_SECRET,
//   redirectUri: process.env.AUTH_ENDPOINT,
// });

// // Redirect to Spotify authorization page
// app.get('/auth/login', (req, res) => {
//   const scopes = ['user-read-private', 'user-read-email', 'user-modify-playback-state'];
//   const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
//   res.redirect(authorizeURL);
// });

// // Callback route after Spotify authorization
// app.get('/auth/callback', async (req, res) => {
//   const { code } = req.query;
//   try {
//     const { body } = await spotifyApi.authorizationCodeGrant(code);
//     const { access_token, refresh_token } = body;
//     // Set access token for subsequent requests
//     spotifyApi.setAccessToken(access_token);
//     spotifyApi.setRefreshToken(refresh_token);
//     res.redirect('/');
//   } catch (error) {
//     console.error('Error exchanging authorization code for access token:', error);
//     res.status(500).send('Error exchanging authorization code for access token');
//   }
// });

// // Example endpoint to control playback
// app.post('/play', async (req, res) => {
//   try {
//     await spotifyApi.play();
//     res.status(204).end();
//   } catch (error) {
//     console.error('Error controlling playback:', error);
//     res.status(500).send('Error controlling playback');
//   }
// });

// // Serve static files in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'client/build')));
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client/build/index.html'));
//   });
// }

// // Start server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// module.exports = app;
