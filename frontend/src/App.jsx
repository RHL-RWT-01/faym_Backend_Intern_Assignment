import { useEffect } from "react";

const userId = "user-123"; // Replace with dynamic user_id if needed

export default function App() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("Service Worker registered"))
        .catch(console.error);
    }

    const viewEvent = {
      user_id: userId,
      event_type: "view",
      payload: {
        url: window.location.href,
        title: document.title,
      },
      timestamp: new Date().toISOString(),
    };

    navigator.serviceWorker.ready.then((registration) => {
      registration.active?.postMessage(viewEvent);
    });
  }, []);

  const sendClickEvent = () => {
    const clickEvent = {
      user_id: userId,
      event_type: "click",
      payload: {
        element_id: "click-button",
        text: "Click Me",
        xpath: "/html/body/button[1]",
      },
      timestamp: new Date().toISOString(),
    };
    navigator.serviceWorker.controller?.postMessage(clickEvent);
  };

  const sendLocationEvent = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude, accuracy } = position.coords;
      const locationEvent = {
        user_id: userId,
        event_type: "location",
        payload: { latitude, longitude, accuracy },
        timestamp: new Date().toISOString(),
      };
      navigator.serviceWorker.controller?.postMessage(locationEvent);
    });
  };

  const apiSpec = [
    {
      method: "POST",
      endpoint: "/events",
      description: "Submit an event",
      fields: {
        user_id: "string",
        event_type: '"view" | "click" | "location"',
        payload: {
          view: "{ url: string, title: string }",
          click: "{ element_id: string, text: string, xpath: string }",
          location: "{ latitude: number, longitude: number, accuracy: number }",
        },
        timestamp: "ISO string",
      },
    },
    {
      method: "GET",
      endpoint: "/events",
      description: "List events with optional filters (type, user_id, date)",
    },
    {
      method: "GET",
      endpoint: "/events/stats",
      description: "Aggregated event counts per type per day",
    },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>React Event Tracker</h1>

      <div style={{ marginBottom: "1rem" }}>
        <button id="click-button" onClick={sendClickEvent}>
          Click Me
        </button>{" "}
        <button id="get-location" onClick={sendLocationEvent}>
          Get Location
        </button>
      </div>

      <hr />

      <h2>📘 API Interface</h2>
      {apiSpec.map((api, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <strong>{api.method}</strong> <code>{api.endpoint}</code>
          <div>{api.description}</div>
          {api.fields && (
            <pre
              style={{
                background: "#f0f0f0",
                padding: "0.75rem",
                marginTop: "0.5rem",
                fontSize: "0.9rem",
              }}
            >
              {JSON.stringify(api.fields, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}
