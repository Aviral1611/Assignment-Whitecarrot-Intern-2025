
# Google Calendar Integration App

A simple React + Vite front-end and Node/Express back-end that uses Google OAuth to:

- Sign in with Google
- Fetch and display Google Calendar events
- Filter events by date

Deployed on Render for both the front end and the back end.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Local Setup](#local-setup)
  - [Server (Back End)](#server-back-end)
  - [Client (Front End)](#client-front-end)
- [Deployment (Render)](#deployment-render)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Description

This project demonstrates a full-stack integration with Google Calendar using OAuth2. Users can sign in with Google, authorize the app to access their Google Calendar events, and see those events displayed in a React application. They can also filter events by date range.

## Features

- Google OAuth2 Login (redirect flow)
- Calendar API Integration: retrieve user's primary calendar events
- Date Filtering: show events in a table, sorted with optional start/end date filters
- Client/Server Separation: front end (React) is a Static Site on Render; back end (Node) is a Web Service on Render

## Tech Stack

### Front end:

- React (powered by Vite)
- Deployed as a Static Site on Render

### Back end:

- Node.js + Express
- `googleapis` / `google-auth-library` for Calendar API requests
- Deployed as a Web Service on Render

### OAuth:

- Google Cloud Console credentials (Web Application)
- Exchanging authorization codes for access tokens via `oauth2Client`

## Local Setup

You can run and test everything on your local machine before deploying to Render.

### Server (Back End)

cd server


2. **Install dependencies:**


npm install


3. **Create a `.env` file (this is where you put sensitive info). For example:**

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI=http://localhost:4000/api/auth/google/callback
PORT=4000


4. **Run the server:**

npm start

By default, it will listen on `http://localhost:4000`.

## Google Cloud Console Setup (for local testing)

- **Authorized JavaScript origins:** `http://localhost:5173` (or your React dev server port)
- **Authorized redirect URIs:** `http://localhost:4000/api/auth/google/callback`

## Client (Front End)

1. **Open a new terminal, navigate to the client folder:**

cd ../client


By default, this runs at `http://localhost:5173`.

## Deployment (Render)

1. **Push your code to GitHub**
- Make sure your code (including `client/` and `server/` folders) is in a GitHub repo.

2. **Deploy the Server:**
- Go to Render Dashboard.
- Click on New + → Web Service.
  - Root Directory: point to your server folder (or set build commands accordingly).
  - Build command:
    ```
    cd server && npm install
    ```
  - Start command:
    ```
    cd server && npm start
    ```
  - Add environment variables (the same ones from your `server/.env`).

3. **Deploy the Client:**
- Click on New + → Static Site.
  - Root Directory: point to `client/`.
  - Build command:
    ```
    cd client && npm install && npm run build
    ```
  - Publish Directory: `client/dist`.
  - Add any VITE_ environment variables if needed (e.g., `VITE_GOOGLE_CLIENT_ID`).

## Google Cloud Console (Production)

- **Authorized JavaScript origins:** `https://<your-client>.onrender.com`
- **Authorized redirect URIs:** `https://<your-server>.onrender.com/api/auth/google/callback`

## Update your front-end code

Replace:

window.location.href = "http://localhost:4000/api/auth/google";

With:

window.location.href = "https://<your-server>.onrender.com/api/auth/google";
