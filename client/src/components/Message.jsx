function Message({ text, senderName, isOwner }) {
  const classNames = isOwner ? "message message-owner" : "message";

  return (
    <div className={classNames}>
      <div className="message-box">
        {!isOwner && <h4 className="message-author">{senderName}</h4>}
        <p className="message-text">{text}</p>
      </div>
    </div>
  );
}

export default Message;
