import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        <header className="modal-header">
          <h2>{title}</h2>
          <button onClick={onCancel} className="close-btn">&times;</button>
        </header>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <footer className="modal-footer">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-primary" onClick={onConfirm}>Confirm Action</button>
        </footer>
      </div>
    </div>
  );
};

export default ConfirmModal;