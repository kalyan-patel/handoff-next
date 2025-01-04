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
import { NodeNextRequest } from "next/dist/server/base-http/node";

export const Chat = () => {
  const { currentUser } = useAuth();
  const userEmail = currentUser.email;

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false)






  const [loading, setLoading] = useState(true);


  const handleBackClick = () => setShowSidebar(true);
  const handleConversationClick = (c) => {
    setActiveConversation(c)
    setShowSidebar(false)
  }


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
    <div className="flex flex-col h-[calc(100dvh-6rem)]">
      {/* Main Container */}
      <MainContainer responsive className="flex-grow overflow-hidden">
        <Sidebar position="left" scrollable className="bg-gray-100 p-2">
          <ConversationHeader className="mb-4 bg-transparent">
            <ConversationHeader.Content className="text-lg font-bold">
              {currentUser.displayName + "'s messages:"}
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
                  info={<span className="text-sm text-gray-500">{lastMessage}</span>}
                  active={activeConversation?._id === c._id}
                  onClick={() => handleConversationClick(c)}
                  className="hover:bg-gray-200 rounded-md p-2 cursor-pointer"
                />
              );
            })}
          </ConversationList>
        </Sidebar>

        <ChatContainer style={{display: showSidebar ? "none" : ""}} className="flex-grow flex flex-col bg-white border-l">
          {activeConversation && (
            <ConversationHeader className="border-b p-4">
              <ConversationHeader.Back onClick={handleBackClick}/>
              <ConversationHeader.Content className="text-xl font-bold"
                userName={(activeConversation.users.find((u) => u !== userEmail))}
                info={activeConversation.topic}
              />
            </ConversationHeader>
          )}
          <MessageList className="overflow-y-auto p-4 space-y-3">
            {activeConversation.messages.map((m) => (
              <Message
                key={m._id}
                model={{
                  message: m.content,
                  direction: userEmail === m.sender ? "outgoing" : "incoming",
                }}
                className={`p-0.5 rounded-lg ${
                  userEmail === m.sender
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-black self-start"
                }`}
              />
            ))}
          </MessageList>

          <MessageInput
            placeholder="Type a message..."
            onSend={handleSend}
            attachButton={false}
            className="p-3 border-t"
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};