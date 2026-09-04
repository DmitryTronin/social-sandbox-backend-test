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
  const publishedAt = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(tweet.createdAt));

  return (
    <article className="tweet">
      <img
        src={tweet.author.avatarUrl}
        alt={tweet.author.name}
        className="avatar"
      />
      <div className="tweet-body">
        <div className="tweet-header">
          <span className="name">{tweet.author.name}</span>
          <span className="handle">@{tweet.author.handle}</span>
          <span className="dot">·</span>
          <time dateTime={tweet.createdAt}>{publishedAt}</time>
        </div>
        <p className="tweet-text">{tweet.text}</p>
        <div className="tweet-actions">
          <button onClick={() => onReply?.(tweet.id)}>
            Reply ({tweet.replies})
          </button>
          <button
            onClick={() => onRetweet?.(tweet.id)}
            aria-pressed={!!tweet.retweetedByMe}
            className={tweet.retweetedByMe ? 'is-retweeted' : ''}
          >
            {tweet.retweetedByMe ? 'Retweeted' : 'Retweet'} ({tweet.retweets})
          </button>
          <button
            onClick={() => onLike?.(tweet.id)}
            aria-pressed={!!tweet.likedByMe}
            className={tweet.likedByMe ? 'is-liked' : ''}
          >
            {tweet.likedByMe ? 'Liked' : 'Like'} ({tweet.likes})
          </button>
        </div>
      </div>
    </article>
  );
};

export default Tweet;
