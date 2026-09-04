import { useMemo, useState } from 'react';
import { Tweet } from './components/Tweet';
import { sampleTweets } from '@/data/tweets';

function App() {
  const [tweets, setTweets] = useState(sampleTweets);
  const [query, setQuery] = useState('');

  const visibleTweets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return tweets;

    return tweets.filter(({ text, author }) =>
      `${author.name} ${author.handle} ${text}`.toLowerCase().includes(normalizedQuery),
    );
  }, [query, tweets]);

  const toggleLike = (id: string) => {
    setTweets((prev) =>
      prev.map((tweet) =>
        tweet.id === id
          ? {
              ...tweet,
              likedByMe: !tweet.likedByMe,
              likes: tweet.likes + (tweet.likedByMe ? -1 : 1),
            }
          : tweet,
      ),
    );
  };

  const toggleRetweet = (id: string) => {
    setTweets((prev) =>
      prev.map((tweet) =>
        tweet.id === id
          ? {
              ...tweet,
              retweetedByMe: !tweet.retweetedByMe,
              retweets: tweet.retweets + (tweet.retweetedByMe ? -1 : 1),
            }
          : tweet,
      ),
    );
  };

  return (
    <main className="app" style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px' }}>
      <h1>Tweet Viewer</h1>
      <label style={{ display: 'block', marginBottom: 16 }}>
        <span style={{ display: 'block', marginBottom: 6, color: '#536471' }}>Tune the feed</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search posts or people"
          aria-label="Search posts or people"
          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1px solid #cfd9de', borderRadius: 999 }}
        />
      </label>
      <p role="status" style={{ color: '#536471', fontSize: 14 }}>
        {visibleTweets.length} {visibleTweets.length === 1 ? 'post' : 'posts'} in orbit
      </p>
      {visibleTweets.map((tweet) => (
        <Tweet
          key={tweet.id}
          tweet={tweet}
          onLike={toggleLike}
          onRetweet={toggleRetweet}
        />
      ))}
    </main>
  );
}

export default App;
