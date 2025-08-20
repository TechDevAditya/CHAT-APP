import { useEffect, useState } from "react";
import { socket } from "../socket";

function TypingIndicator({selectedUser}) {
    const[isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        socket.on("typing", ({from}) => {
            if(from === selectedUser._id) setIsTyping(true);
        });

        socket.on("stop_typing", ({from}) => {
            if(from === selectedUser._id) setIsTyping(false);
        });

        return () => {
            socket.off("typing");
            socket.off("stop_typing");
        };
    }, [selectedUser]);

    if(!isTyping) return null;

    return (
        <p style={{ fontStyle: "italic" }}>
            {selectedUser.username} is typing...
        </p>
    );
}

export default TypingIndicator;