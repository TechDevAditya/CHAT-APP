import { useEffect, useState } from "react";
import { socket } from "../socket";

function TypingIndicator({ selectedUser }) {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket.on("user_typing", ({ from }) => {
      if (from === selectedUser._id) 
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
    });

    socket.on("stop_typing", ({ from }) => {
      if (from === selectedUser._id) setIsTyping(false);
    });

    return () => {
      socket.off("user_typing");
      socket.off("stop_typing");
    };
  }, [selectedUser]);

  if (!isTyping) return null;

  return (
    <p style={{ fontStyle: "italic", color: "grey" }}>
      {selectedUser.name} is typing...
    </p>
  );
}

export default TypingIndicator;
