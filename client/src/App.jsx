import React, { useEffect, useState } from 'react';
import './App.css'; // <-- import the CSS

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [events, setEvents] = useState([]);
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    if (token) {
      setAccessToken(token);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const handleLogin = () => {
    window.location.href = 'https://assignment-whitecarrot-intern-2025-j46u.onrender.com/api/auth/google';
  };

  const fetchEvents = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch('https://assignment-whitecarrot-intern-2025-j46u.onrender.com/api/auth/google', {
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

  const getFilteredEvents = () => {
    const startDate = filterStart ? new Date(filterStart) : new Date('1970-01-01');
    const endDate = filterEnd ? new Date(filterEnd) : new Date('9999-12-31');

    return events.filter((event) => {
      const eventStart = new Date(event.start?.dateTime || event.start?.date);
      return eventStart >= startDate && eventStart <= endDate;
    });
  };

  // Sort by descending start time
  const filteredEvents = getFilteredEvents().sort(
    (a, b) =>
      new Date(b.start?.dateTime || b.start?.date) -
      new Date(a.start?.dateTime || a.start?.date)
  );

  return (
    <div className="app-container">
      <h1>Google Calendar Integration</h1>

      {/* If there's no access token yet, show the login button. */}
      {!accessToken && (
        <div className="button-center"> 
        <button className="button" onClick={handleLogin}>
          Login with Google (Calendar Scope)
        </button>
        </div>
      )}

      {/* If we do have an access token, show the "Fetch Events" button. */}
      {accessToken && (
        <div className="button-center"> 
        <button className="button" onClick={fetchEvents}>
          Fetch My Calendar Events
        </button>
        </div>
      )}

      {accessToken && (
        <div>
          {/* Filter fields */}
          <div className="filter-container">
            <div>
              <label>Start Date: </label>
              <input
                type="date"
                value={filterStart}
                onChange={(e) => setFilterStart(e.target.value)}
              />
            </div>

            <div>
              <label>End Date: </label>
              <input
                type="date"
                value={filterEnd}
                onChange={(e) => setFilterEnd(e.target.value)}
              />
            </div>
          </div>

          {/* Table of filtered events */}
          {filteredEvents.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Summary</th>
                  <th>Start</th>
                  <th>End</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => {
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
      )}
    </div>
  );
}

export default App;
