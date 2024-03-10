const Modal = ({ onClose, children }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal">
        <div className="close-btn" onClick={onClose}>&times;</div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;