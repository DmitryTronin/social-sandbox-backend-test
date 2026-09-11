import { useEffect, useState } from 'react';

interface ApiMessage {
  service: string;
  message: string;
}

interface RequestResult {
  state: 'loading' | 'success' | 'error';
  httpStatus?: number;
  service?: string;
  message: string;
}

function App() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const requestUrl = `${apiUrl}/api/message`;
  const [result, setResult] = useState<RequestResult>({
    state: 'loading',
    message: 'Waiting for the backend response.',
  });

  useEffect(() => {
    const requestBackend = async () => {
      try {
        const response = await fetch(requestUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`.trim());
        }

        const body = (await response.json()) as ApiMessage;
        setResult({
          state: 'success',
          httpStatus: response.status,
          service: body.service,
          message: body.message,
        });
      } catch (error: unknown) {
        setResult({
          state: 'error',
          message: error instanceof Error ? error.message : String(error),
        });
      }
    };

    void requestBackend();
  }, [requestUrl]);

  return (
    <main>
      <h1>AIRC-506 backend connection test</h1>
      <p>Configured API URL: {apiUrl}</p>
      <p>Browser request URL: {requestUrl}</p>
      <p>Result: {result.state}</p>
      {result.httpStatus !== undefined && <p>HTTP status: {result.httpStatus}</p>}
      {result.service !== undefined && <p>Backend service: {result.service}</p>}
      <p>{result.state === 'error' ? 'Error' : 'Message'}: {result.message}</p>
    </main>
  );
}

export default App;
