import React, { useEffect, useState } from "react";
import "./messages.scss";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeConversationId, setActiveConversationId] = useState(null);

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await newRequest.get("/conversations");

        const normalizedConvos = res.data.map((c) => ({
          ...c,
          readBySeller: !!c.readBySeller,
          readByBuyer: !!c.readByBuyer,
        }));

        setConversations(normalizedConvos);
      } catch (err) {
        console.log(err);
        setError("Failed to load conversations.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const isUnread = (c) => {
    const isSeller = currentUser.isSeller === true;
    return isSeller ? !c.readBySeller : !c.readByBuyer;
  };

  const isLastMessageLocation = (c) => {
    const lastMsg = c.lastMessageObj;
    return (
      lastMsg &&
      lastMsg.location &&
      Array.isArray(lastMsg.location.coordinates) &&
      lastMsg.location.coordinates.length === 2
    );
  };

  const getPreviewText = (c) => {
    const lastMsg = c.lastMessageObj;
    if (!lastMsg) return "Open chat";

    if (isLastMessageLocation(c)) {
      return lastMsg.desc ? `📍 Location - ${lastMsg.desc}` : "📍 Location";
    }

    return lastMsg.desc || "Open chat";
  };

  const handleConversationClick = async (c) => {
    setActiveConversationId(c._id);
    navigate(`/messages/${c.id}`);

    try {
      await newRequest.put(`/conversations/${c.id}/read`);

      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === c._id
            ? currentUser.isSeller
              ? { ...conv, readBySeller: true }
              : { ...conv, readByBuyer: true }
            : conv
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="messagesPage">
      <div className="sidebar">
        <div className="sidebarHeader">
          <div>
            <h2>Messages</h2>
            <p>Stay connected with buyers and sellers.</p>
          </div>
        </div>

        {loading ? (
          <div className="stateBox">Loading conversations...</div>
        ) : error ? (
          <div className="stateBox errorBox">{error}</div>
        ) : conversations.length === 0 ? (
          <div className="emptyState">
            <h3>No conversations yet</h3>
            <p>Your chats with buyers and sellers will appear here.</p>
          </div>
        ) : (
          <div className="conversationList">
            {conversations.map((c) => (
              <div
                key={c._id}
                className={`conversationItem ${isUnread(c) ? "unread" : ""} ${
                  activeConversationId === c._id ? "active" : ""
                }`}
                onClick={() => handleConversationClick(c)}
              >
                <img
                  src={c.user?.img || "/img/noavatar.jpg"}
                  alt="avatar"
                  className="avatar"
                />

                <div className="conversationContent">
                  <span className="username">{c.user?.username || "User"}</span>
                  <span className="lastMessage">{getPreviewText(c)}</span>
                </div>

                {isUnread(c) && <span className="badge"></span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="chatWindow empty">
        <div className="chatPlaceholder">
          <div className="placeholderIcon">💬</div>
          <h3>Select a conversation</h3>
          <p>Choose a chat from the left to view messages and reply.</p>
        </div>
      </div>
    </div>
  );
}

export default Messages;