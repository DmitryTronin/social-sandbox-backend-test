import { useMemo, useState } from 'react';
import { Tweet } from './components/Tweet';
import { sampleTweets } from '@/data/tweets';
import './styles.css';

function App() {
  const [tweets, setTweets] = useState(sampleTweets);
  const [query, setQuery] = useState('');

  const visibleTweets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return tweets;

    return tweets.filter(({ text, author }) =>
      `${text} ${author.name} ${author.handle}`.toLowerCase().includes(normalizedQuery),
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

  const addReply = (id: string) => {
    setTweets((prev) =>
      prev.map((tweet) =>
        tweet.id === id ? { ...tweet, replies: tweet.replies + 1 } : tweet,
      ),
    );
  };

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Your social pulse</p>
          <h1>Tweet Viewer</h1>
        </div>
        <span className="tweet-total">{tweets.length} posts</span>
      </header>

      <label className="search-label" htmlFor="tweet-search">Search the conversation</label>
      <input
        id="tweet-search"
        className="search-input"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by post or person"
      />

      <section className="feed" aria-label="Tweets">
        {visibleTweets.length > 0 ? visibleTweets.map((tweet) => (
        <Tweet
          key={tweet.id}
          tweet={tweet}
          onLike={toggleLike}
          onRetweet={toggleRetweet}
          onReply={addReply}
        />
        )) : <p className="empty-state">No posts match “{query}”.</p>}
      </section>
    </main>
  );
}

export default App;
