import React, { useEffect, useState } from 'react';
import api from '../api';

export default function ReviewSection({ restaurantId }) {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    api.get(`/reviews/restaurant/${restaurantId}`).then(({ data }) => { if (active) setReviews(data); })
      .catch(() => { if (active) setError('Unable to load reviews'); });
    return () => { active = false; };
  }, [restaurantId]);
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const { data } = await api.post('/reviews', { restaurant_id: Number(restaurantId), comment, rating });
      setReviews((current) => [data, ...current]); setComment('');
    } catch (failure) { setError(failure.response?.data?.error || 'Unable to post review'); }
    finally { setBusy(false); }
  };
  return <section className="comment-section-container"><h3>Reviews</h3>
    <form onSubmit={submit} className="comment-form">
      <label>Rating <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
        {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value}</option>)}
      </select></label>
      <textarea aria-label="Your review" value={comment} onChange={(event) => setComment(event.target.value)} maxLength={2000} required />
      <button disabled={busy}>{busy ? 'Posting…' : 'Post review'}</button>
    </form>
    {error && <p role="alert">{error}</p>}
    {reviews.map((review) => <article key={review.id}><strong>{review.author} — {review.rating}/5</strong><p>{review.comment}</p></article>)}
  </section>;
}
