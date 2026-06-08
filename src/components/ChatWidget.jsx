import { useState } from "react";
import { FaCommentDots } from "react-icons/fa";
import "./ChatWidget.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e && e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      await fetch("https://formspree.io/f/mdaledyg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ show: "Site Chat", comments: message, name }),
      });
      setSent(true);
      setMessage("");
      setName("");
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`chat-widget ${open ? "open" : "closed"}`}>
      {!open && (
        <button
          className="chat-toggle"
          aria-label="Open chat"
          onClick={() => setOpen(true)}
        >
          <FaCommentDots className="chat-icon" aria-hidden />
        </button>
      )}

      {open && (
        <form className="chat-panel" onSubmit={submit}>
          <div className="chat-header">Send me a message</div>
          <input
            className="chat-input"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className="chat-textarea"
            placeholder="Type a short message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
          <div className="chat-actions">
            <button
              type="submit"
              className="chat-send"
              disabled={sending || !message.trim()}
            >
              {sending ? "Sending..." : "Send"}
            </button>
            <button
              type="button"
              className="chat-cancel"
              onClick={() => { setOpen(false); }}
            >
              Close
            </button>
          </div>
          {sent && <div className="chat-sent">Thanks — message sent!</div>}
        </form>
      )}
    </div>
  );
}
