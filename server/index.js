import 'dotenv/config';      // or require('dotenv').config() if using CommonJS
import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';

const app = express();
app.use(cors());
app.use(express.json());

// Load env vars
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  PORT
} = process.env;

// Create an OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

// SCOPES we want (read-only access to calendars and events)
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly'
];

// 1) Endpoint to start OAuth flow (redirect user to Google's consent screen)
app.get('/api/auth/google', (req, res) => {
  // Generate a URL to Google's consent page
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',     // Request refresh token
    prompt: 'consent',          // Force consent to get refresh token every time
    scope: SCOPES
  });
  // Redirect user to that URL
  res.redirect(authUrl);
});

// 2) OAuth2 Callback: Google redirects here with ?code=...
app.get('/api/auth/google/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('No code returned from Google');
  }

  try {
    // Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    // tokens.access_token and tokens.refresh_token are now available

    // Store tokens in session/DB if needed, or attach to query params, or a JWT.
    // For simplicity, let's redirect to the frontend with the tokens in the URL.
    const frontEndUrl = `http://localhost:5173?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`;
    res.redirect(frontEndUrl);

  } catch (err) {
    console.error('Error exchanging code for tokens:', err);
    res.status(500).send('Authentication error');
  }
});

// 3) Fetch Calendar Events: a protected route that uses the user's access token
app.post('/api/calendar/events', async (req, res) => {
  const { accessToken } = req.body; // or read from session, etc.

  if (!accessToken) {
    return res.status(400).json({ error: 'No access token provided' });
  }

  try {
    // Set OAuth2 client credentials
    oauth2Client.setCredentials({ access_token: accessToken });

    // Create a Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Fetch events (example: 'primary' calendar, up to 50 upcoming events)
    const response = await calendar.events.list({
      calendarId: 'primary',
      maxResults: 50,
      orderBy: 'startTime',
      singleEvents: true,
      // timeMin: (new Date()).toISOString(), // for only upcoming
    });

    // Return the events
    const events = response.data.items || [];
    res.json({ events });
  } catch (err) {
    console.error('Error fetching calendar events:', err);
    res.status(500).json({ error: 'Unable to fetch events' });
  }
});

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
