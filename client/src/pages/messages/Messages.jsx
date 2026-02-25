import React, { useEffect, useState } from "react"; 
import "./messages.scss";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

function Messages() {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

  
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await newRequest.get("/conversations");

        
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
      return lastMsg.desc
        ? `📍 Location - ${lastMsg.desc}`
        : "📍 Location";
    }

    return lastMsg.desc || "Open chat";
  };


  const handleConversationClick = async (c) => {
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
        <h2>Messages</h2>

        {conversations.map((c) => (
          <div
            key={c._id}
            className={`conversationItem ${isUnread(c) ? "unread" : ""}`}
            onClick={() => handleConversationClick(c)}
          >
           
            <img
              src={c.user?.img || "/img/noavatar.jpg"}
              alt="avatar"
              className="avatar"
            />

            <div className="conversationInfo">
              
              <span className="username">
                {c.user?.username || "User"}
              </span>

              
              <p className="preview">{getPreviewText(c)}</p>
            </div>

            
            {isUnread(c) && <span className="badge"></span>}
          </div>
        ))}
      </div>

     
      <div className="chatWindow empty">
        Select a conversation
      </div>
    </div>
  );
}

export default Messages;
