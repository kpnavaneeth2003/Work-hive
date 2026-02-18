import React, { useEffect, useState } from "react"; 
import "./messages.scss";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

function Messages() {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await newRequest.get("/conversations");

        // ✅ Ensure readBySeller / readByBuyer are always booleans
        const normalizedConvos = res.data.map((c) => ({
          ...c,
          readBySeller: !!c.readBySeller,
          readByBuyer: !!c.readByBuyer,
        }));

        setConversations(normalizedConvos);
      } catch (err) {
        console.log(err);
      }
    };

    fetchConversations();
  }, []);

  // 🔴 Check if conversation is unread
  const isUnread = (c) => {
    const isSeller = currentUser.isSeller === true;
    return isSeller ? !c.readBySeller : !c.readByBuyer;
  };

  // 📍 Check if last message is a location message
  const isLastMessageLocation = (c) => {
    const lastMsg = c.lastMessageObj;
    return (
      lastMsg &&
      lastMsg.location &&
      Array.isArray(lastMsg.location.coordinates) &&
      lastMsg.location.coordinates.length === 2
    );
  };

  // 📝 Get sidebar preview text
  const getPreviewText = (c) => {
    const lastMsg = c.lastMessageObj;
    if (!lastMsg) return "Open chat";

    if (isLastMessageLocation(c)) {
      return lastMsg.desc
        ? `📍 Location - ${lastMsg.desc}`
        : "📍 Location";
    }

    return lastMsg.desc || "Open chat";
  };

  // ✅ Handle conversation click
  const handleConversationClick = async (c) => {
    navigate(`/messages/${c.id}`);

    // Mark conversation as read
    try {
      await newRequest.put(`/conversations/${c.id}/read`);

      // Update local state to remove unread dot immediately
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
      {/* LEFT SIDEBAR */}
      <div className="sidebar">
        <h2>Messages</h2>

        {conversations.map((c) => (
          <div
            key={c._id}
            className={`conversationItem ${isUnread(c) ? "unread" : ""}`}
            onClick={() => handleConversationClick(c)}
          >
            {/* PROFILE IMAGE */}
            <img
              src={c.user?.img || "/img/noavatar.jpg"}
              alt="avatar"
              className="avatar"
            />

            <div className="conversationInfo">
              {/* USERNAME */}
              <span className="username">
                {c.user?.username || "User"}
              </span>

              {/* PREVIEW */}
              <p className="preview">{getPreviewText(c)}</p>
            </div>

            {/* 🔴 UNREAD DOT */}
            {isUnread(c) && <span className="badge"></span>}
          </div>
        ))}
      </div>

      {/* RIGHT SIDE EMPTY STATE */}
      <div className="chatWindow empty">
        Select a conversation
      </div>
    </div>
  );
}

export default Messages;
