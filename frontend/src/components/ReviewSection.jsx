import React, { useState } from 'react';
import api from '../api';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await api.post(`/posts/${postId}/comments`, { text: newComment });
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (err) {
      alert("Failed to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="comment-section-container">
      <h3>Reviews</h3>
      <form onSubmit={handlePostComment} className="comment-form">
        <textarea 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your experience with this dish..."
          disabled={isSubmitting}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post Review'}
        </button>
      </form>
      
      <div className="comments-list">
        {comments.map((c, idx) => (
          <div key={idx} className="comment-item">
            <p>{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommentSection;