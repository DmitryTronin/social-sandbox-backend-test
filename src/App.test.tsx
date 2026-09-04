import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the tweet viewer with sample tweets', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Tweet Viewer' })).toBeInTheDocument();
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
  });

  it('mounts the app through the browser entry point', async () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    try {
      await import('./main');

      expect(await screen.findByRole('heading', { name: 'Tweet Viewer' })).toBeInTheDocument();
    } finally {
      root.remove();
    }
  });

  it('toggles a like on and off with live counts', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Like (42)' }));
    expect(screen.getByRole('button', { name: 'Liked (43)' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'Liked (43)' }));
    expect(screen.getByRole('button', { name: 'Like (42)' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('toggles a retweet on and off with live counts', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Retweet (10)' }));
    expect(screen.getByRole('button', { name: 'Retweeted (11)' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'Retweeted (11)' }));
    expect(screen.getByRole('button', { name: 'Retweet (10)' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('only affects the clicked tweet', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Like (42)' }));

    expect(screen.getByRole('button', { name: 'Like (128)' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Liked/ })).toHaveLength(1);
  });

  it('filters posts by text or author', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Search the conversation' }), 'Jane');

    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByText('Just shipped a new feature! Feeling great about the team effort.')).toBeInTheDocument();
  });

  it('increments the reply count for the selected post', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Reply (5)' }));

    expect(screen.getByRole('button', { name: 'Reply (6)' })).toBeInTheDocument();
  });
});
