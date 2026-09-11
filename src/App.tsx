import { useEffect, useState } from 'react';

function App() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/message`)
      .then((response) => response.text())
      .then(setMessage)
      .catch((error: unknown) => {
        setMessage(error instanceof Error ? error.message : String(error));
      });
  }, []);

  return (
    <main>
      <h1>API message</h1>
      <p>Configured API URL: {apiUrl}</p>
      <pre>{message}</pre>
    </main>
  );
}

export default App;
