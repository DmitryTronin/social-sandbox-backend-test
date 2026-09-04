import React from 'react';
import type { TweetData } from '@/types/tweet';

interface TweetProps {
  tweet: TweetData;
  onLike?: (id: string) => void;
  onRetweet?: (id: string) => void;
  onReply?: (id: string) => void;
}

export const Tweet: React.FC<TweetProps> = ({
  tweet,
  onLike,
  onRetweet,
  onReply,
}) => {
  const postedAt = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(tweet.createdAt));

  return (
    <article className="tweet" style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid #e1e8ed' }}>
      <img
        src={tweet.author.avatarUrl}
        alt={tweet.author.name}
        style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0, backgroundColor: '#f0f0f0' }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="tweet-header" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="name" style={{ fontWeight: 700 }}>{tweet.author.name}</span>
          <span className="handle" style={{ color: '#536471' }}>@{tweet.author.handle}</span>
          <span aria-hidden="true" style={{ color: '#536471' }}>·</span>
          <time dateTime={tweet.createdAt} style={{ color: '#536471' }}>{postedAt}</time>
        </div>
        <p className="tweet-text" style={{ margin: '4px 0 8px' }}>{tweet.text}</p>
        <div className="tweet-actions" style={{ display: 'flex', gap: 24 }}>
          <button onClick={() => onReply?.(tweet.id)} style={{ background: 'none', border: 'none', color: '#536471', cursor: 'pointer' }}>
            Reply ({tweet.replies})
          </button>
          <button
            onClick={() => onRetweet?.(tweet.id)}
            aria-pressed={!!tweet.retweetedByMe}
            style={{
              background: 'none',
              border: 'none',
              color: tweet.retweetedByMe ? '#00ba7c' : '#536471',
              fontWeight: tweet.retweetedByMe ? 700 : 400,
              cursor: 'pointer',
            }}
          >
            {tweet.retweetedByMe ? 'Retweeted' : 'Retweet'} ({tweet.retweets})
          </button>
          <button
            onClick={() => onLike?.(tweet.id)}
            aria-pressed={!!tweet.likedByMe}
            style={{
              background: 'none',
              border: 'none',
              color: tweet.likedByMe ? '#f91880' : '#536471',
              fontWeight: tweet.likedByMe ? 700 : 400,
              cursor: 'pointer',
            }}
          >
            {tweet.likedByMe ? 'Liked' : 'Like'} ({tweet.likes})
          </button>
        </div>
      </div>
    </article>
  );
};

export default Tweet;
