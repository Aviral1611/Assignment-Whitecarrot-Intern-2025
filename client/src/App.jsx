import React, { useEffect } from "react";

function App() {
  useEffect(() => {
    /* global google */
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // <-- Read from .env
        callback: handleCredentialResponse
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleButtonDiv"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  const handleCredentialResponse = (response) => {
    // response.credential is the ID token from Google
    console.log("Encoded JWT ID token:", response.credential);

    // Send token to the backend for verification
    fetch("http://localhost:4000/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Server response:", data);
        // Handle the server response here (e.g., store user, redirect, etc.)
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div style={{ margin: "2rem" }}>
      <h1>Google SSO with Vite + React</h1>
      <div id="googleButtonDiv"></div>
    </div>
  );
}

export default App;
