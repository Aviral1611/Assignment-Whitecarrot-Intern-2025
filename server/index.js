import 'dotenv/config'; // automatically loads .env
import express from 'express';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';


const app = express();
app.use(cors());
app.use(express.json());

// Load the Google client ID and secret from your .env
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Endpoint to verify Google token
app.post("/api/auth/google", async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: "Missing credential" });
  }

  try {
    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });

    // Payload has the user's profile info
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    console.log("User verified:", { sub, email, name, picture });

    // TODO: check if user exists in DB; if not, create new user; etc.

    return res.json({
      success: true,
      user: {
        id: sub,
        email,
        name,
        picture,
      },
      message: "User verified successfully",
    });
  } catch (error) {
    console.error("Error verifying Google ID token:", error);
    return res.status(401).json({ error: "Invalid ID token" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
