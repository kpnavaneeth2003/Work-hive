import React, { useEffect, useRef, useState } from "react";
import "./message.scss";
import { useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";

function Message() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef();

  // ✅ get current user
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // ✅ fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await newRequest.get(`/messages/${id}`);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();
  }, [id]);

  // ✅ auto scroll to latest
  useEffect(() => {
  const markRead = async () => {
    try {
      await newRequest.put(`/conversations/${id}/read`);
    } catch (err) {
      console.log(err);
    }
  };

  markRead();
}, [id]);


  // ✅ send message
  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const res = await newRequest.post("/messages", {
        conversationId: id,
        desc: text,
      });

      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatPage">
      <div className="chatContainer">
        
        {/* HEADER */}
        <div className="chatHeader">
          Messages
        </div>

        {/* MESSAGE LIST */}
        <div className="messages">
          {messages.map((m) => (
            <div
              key={m._id}
              className={`message ${
                m.userId === currentUser._id ? "owner" : ""
              }`}
            >
              <div className="bubble">{m.desc}</div>
            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>

        {/* WRITE AREA */}
        <div className="write">
          <textarea
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && handleSend()
            }
          />
          <button onClick={handleSend}>Send</button>
        </div>

      </div>
    </div>
  );
}

export default Message;
