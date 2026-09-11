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
      text: vi.fn().mockResolvedValue('Hello from the API'),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    expect(screen.getByText('Configured API URL: http://localhost:8081')).toBeInTheDocument();
    expect(await screen.findByText('Hello from the API')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8081/api/message');
  });

  it('displays the exact network error', async () => {
    vi.stubEnv('VITE_API_URL', 'http://api.example.test');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    render(<App />);

    expect(await screen.findByText('Failed to fetch')).toBeInTheDocument();
  });
});
