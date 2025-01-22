import { useEffect, useState } from 'react';

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [events, setEvents] = useState([]);

  // 1) Check if we got an access token via query params
  //    If so, store it in state (or localStorage)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    if (token) {
      setAccessToken(token);
      // Optionally remove it from the URL (for cleanliness)
      window.history.replaceState({}, '', '/');
    }
  }, []);

  // 2) Function to begin the OAuth flow
  const handleLogin = () => {
    // This will redirect the user to Google’s consent screen
    window.location.href = 'http://localhost:4000/api/auth/google';
  };

  // 3) Fetch events from the server, using the access token
  const fetchEvents = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch('http://localhost:4000/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken })
      });
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h1>Google Calendar Integration</h1>

      {/* 1) If no access token, show "Login with Google" button */}
      {!accessToken && (
        <button onClick={handleLogin}>Login with Google (Calendar Scope)</button>
      )}

      {/* 2) If we have an access token, show "Fetch Events" button */}
      {accessToken && (
        <button onClick={fetchEvents}>Fetch My Calendar Events</button>
      )}

      {/* 3) Display events in a simple table */}
      {events.length > 0 && (
        <table border="1" cellPadding="5" style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Summary</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            {events
              // Sort by descending start time (most recent first)
              .sort((a, b) => new Date(b.start?.dateTime || b.start?.date) - new Date(a.start?.dateTime || a.start?.date))
              .map((event) => {
                const start = event.start?.dateTime || event.start?.date;
                const end = event.end?.dateTime || event.end?.date;
                return (
                  <tr key={event.id}>
                    <td>{event.summary}</td>
                    <td>{start}</td>
                    <td>{end}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
