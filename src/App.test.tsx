import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('requests the local backend message endpoint', async () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:8081');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValue({
        service: 'social-sandbox-backend-test',
        message: 'Hello from the API',
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    expect(screen.getByText('Configured API URL: http://localhost:8081')).toBeInTheDocument();
    expect(screen.getByText('Browser request URL: http://localhost:8081/api/message')).toBeInTheDocument();
    expect(await screen.findByText('Result: success')).toBeInTheDocument();
    expect(screen.getByText('HTTP status: 200')).toBeInTheDocument();
    expect(screen.getByText('Backend service: social-sandbox-backend-test')).toBeInTheDocument();
    expect(screen.getByText('Message: Hello from the API')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8081/api/message');
  });

  it('displays the exact network error', async () => {
    vi.stubEnv('VITE_API_URL', 'http://api.example.test');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    render(<App />);

    expect(await screen.findByText('Result: error')).toBeInTheDocument();
    expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
  });

  it('displays a non-successful backend status as an error', async () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:8081');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway',
    }));

    render(<App />);

    expect(await screen.findByText('Result: error')).toBeInTheDocument();
    expect(screen.getByText('Error: HTTP 502 Bad Gateway')).toBeInTheDocument();
  });
});
