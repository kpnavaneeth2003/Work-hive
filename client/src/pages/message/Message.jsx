import React, { useEffect, useRef, useState } from "react";
import "./message.scss";
import { useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";

function Message() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Fetch messages
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

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send text message
  const handleSendText = async () => {
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

  // Send location message
  const handleSendLocation = () => {
    if (!navigator.geolocation) {
      return alert("Geolocation not supported by your browser");
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await newRequest.post("/messages", {
            conversationId: id,
            location: { type: "Point", coordinates: [longitude, latitude] },
          });
          setMessages((prev) => [...prev, res.data]);
        } catch (err) {
          console.log(err);
        }
      },
      () => alert("Unable to get your location")
    );
  };

  return (
    <div className="chatPage">
      <div className="chatContainer">
        {/* HEADER */}
        <div className="chatHeader">Messages</div>

        {/* MESSAGE LIST */}
        <div className="messages">
          {messages.map((m) => (
            <div
              key={m._id}
              className={`message ${m.userId === currentUser._id ? "owner" : ""}`}
            >
              <div className="bubble">
                {m.location &&
                m.location.coordinates &&
                Array.isArray(m.location.coordinates) &&
                m.location.coordinates.length === 2 ? (
                  <a
                    href={`https://www.google.com/maps?q=${m.location.coordinates[1]},${m.location.coordinates[0]}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📍 User Location
                  </a>
                ) : (
                  m.desc
                )}
              </div>
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
              e.key === "Enter" && !e.shiftKey && handleSendText()
            }
          />
          <button onClick={handleSendText}>Send</button>
          <button
            onClick={handleSendLocation}
            style={{ background: "#ff7a5c", marginLeft: "5px" }}
          >
            Send Location
          </button>
        </div>
      </div>
    </div>
  );
}

export default Message;
