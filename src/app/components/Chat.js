"use client";

import React, { useState, useEffect } from "react";
import {
  MainContainer,
  Sidebar,
  ConversationHeader,
  ConversationList,
  Conversation,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useAuth } from "../contexts/AuthContext";

export const Chat = () => {
  const { currentUser } = useAuth();
  const userEmail = currentUser.email;

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(`/api/conversations?email=${userEmail}`);
        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }
        const data = await response.json();
        setConversations(data);
        if (data.length > 0) {
          setActiveConversation(data[0]);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleSend = async (messageContent) => {
    if (!messageContent.trim()) return;

    try {
      const message = {
        sender: userEmail,
        content: messageContent,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(
        `/api/conversations/${activeConversation._id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setActiveConversation((prev) => ({
          ...prev,
          messages: [...prev.messages, { sender: userEmail, content: messageContent }],
        }));
      } else {
        console.error("Error sending message:", data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return <div>Loading conversations...</div>;
  }

  if (!conversations.length) {
    return <div>You have no conversations. Start a new one!</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 6rem)"}}>
      <MainContainer responsive>
        <Sidebar position="left" scrollable>
          <ConversationHeader style={{ backgroundColor: "#fff" }}>
            <ConversationHeader.Content>
              {currentUser.displayName + "'s conversations"}
            </ConversationHeader.Content>
          </ConversationHeader>
          <ConversationList>
            {conversations.map((c) => {
              const otherUser = c.users.find((u) => u !== userEmail);
              const lastMessage =
                c.messages.length > 0
                  ? c.messages[c.messages.length - 1].content
                  : "Start the conversation";

              return (
                <Conversation
                  key={c._id}
                  name={otherUser + " - " + c.topic}
                  info={lastMessage}
                  active={activeConversation?._id === c._id}
                  onClick={() => setActiveConversation(c)}
                />
              );
            })}
          </ConversationList>
        </Sidebar>

        <ChatContainer>
          {activeConversation && (
            <ConversationHeader>
              <ConversationHeader.Content>
                {(activeConversation.users.find((u) => u !== userEmail)) +
                  " - " +
                  activeConversation.topic}
              </ConversationHeader.Content>
            </ConversationHeader>
          )}
          <MessageList style={{ flexGrow: 1, overflowY: "auto" }}>
            {activeConversation.messages.map((m) => (
              <Message
                key={m._id}
                model={{
                  message: m.content,
                  direction: userEmail === m.sender ? "outgoing" : "incoming",
                }}
              />
            ))}
          </MessageList>
          <MessageInput
            placeholder="Type a message..."
            onSend={handleSend}
            attachButton={false}
            style={{ flexShrink: 0 }}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};