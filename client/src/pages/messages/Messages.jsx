import React, { useEffect, useState } from "react";
import "./messages.scss";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

function Messages() {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) || {};

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await newRequest.get("/conversations");
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchConversations();
  }, []);

  const isUnread = (c) => {
    return currentUser.isSeller
      ? !c.readBySeller
      : !c.readByBuyer;
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
            onClick={() => navigate(`/messages/${c.id}`)}
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

              <p className="preview">
                {c.lastMessage || "Open chat"}
              </p>
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
