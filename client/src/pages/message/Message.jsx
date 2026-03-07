import React, { useEffect, useRef, useState } from "react";
import "./message.scss";
import { useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";

function Message() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendingLocation, setSendingLocation] = useState(false);
  const scrollRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

  useEffect(() => {
    const markRead = async () => {
      try {
        await newRequest.put(`/messages/read/${id}`);
      } catch (err) {
        console.log(err);
      }
    };

    if (id) markRead();
  }, [id]);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const res = await newRequest.get(`/conversations/single/${id}`);
        const convo = res.data;
        setConversation(convo);

        const otherUserId =
          convo.sellerId === currentUser._id ? convo.buyerId : convo.sellerId;

        if (otherUserId) {
          const userRes = await newRequest.get(`/users/${otherUserId}`);
          setOtherUser(userRes.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (id && currentUser?._id) fetchConversation();
  }, [id, currentUser?._id]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await newRequest.get(`/messages/${id}`);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (id) fetchMessages();
  }, [id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isLocationMessage = (m) => {
    return (
      m.location &&
      Array.isArray(m.location.coordinates) &&
      m.location.coordinates.length === 2
    );
  };

  const getLocationLink = (m) => {
    const [lng, lat] = m.location.coordinates;
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  const handleSendText = async () => {
    const msg = text.trim();
    if (!msg || sending) return;

    try {
      setSending(true);

      const res = await newRequest.post("/messages", {
        conversationId: id,
        desc: msg,
      });

      setMessages((prev) => [...prev, res.data]);
      setText("");

      await newRequest.put(`/messages/read/${id}`);
    } catch (err) {
      console.log(err);
    } finally {
      setSending(false);
    }
  };

  const handleSendLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    if (sendingLocation) return;

    setSendingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await newRequest.post("/messages", {
            conversationId: id,
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
          });

          setMessages((prev) => [...prev, res.data]);
          await newRequest.put(`/messages/read/${id}`);
        } catch (err) {
          console.log(err);
        } finally {
          setSendingLocation(false);
        }
      },
      () => {
        setSendingLocation(false);
        alert("Unable to get your location");
      }
    );
  };

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="chatHeader">
          <div className="chatUser">
            <img
              src={otherUser?.img || "/img/noavatar.jpg"}
              alt={otherUser?.username || "User"}
              className="chatUserAvatar"
            />
            <div className="chatUserInfo">
              <span className="chatUserName">
                {otherUser?.username || "Conversation"}
              </span>
              <small className="chatUserMeta">
                {otherUser ? "Active conversation" : "Loading user..."}
              </small>
            </div>
          </div>
        </div>

        <div className="messages">
          {messages.length === 0 ? (
            <div className="emptyChatState">
              No messages yet. Start the conversation below.
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m._id}
                className={`message ${m.userId === currentUser._id ? "owner" : ""}`}
              >
                <div className="bubble">
                  {isLocationMessage(m) ? (
                    <a
                      href={getLocationLink(m)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      📍 View shared location
                    </a>
                  ) : (
                    m.desc
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={scrollRef}></div>
        </div>

        <div className="write">
          <textarea
            placeholder="Write your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendText();
              }
            }}
          />

          <button onClick={handleSendText} disabled={!text.trim() || sending}>
            {sending ? "Sending..." : "Send"}
          </button>

          <button
            className="locationBtn"
            onClick={handleSendLocation}
            disabled={sendingLocation}
          >
            {sendingLocation ? "Sharing..." : "Location"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Message;