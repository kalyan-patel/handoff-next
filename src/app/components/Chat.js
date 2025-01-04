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
  const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 767px)').matches);
  const [showSidebar, setShowSidebar] = useState(isMobile)



  const [loading, setLoading] = useState(true);


  const handleBackClick = () => setShowSidebar(true);
  const handleConversationClick = (c) => {
    setActiveConversation(c)
    setShowSidebar(false)
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia('(max-width: 767px)').matches);
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


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
    console.log(conversations)
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
    <div className="h-[calc(100dvh-6rem)]">
      {/* Main Container */}
      <MainContainer  className="flex-grow overflow-hidden">
        <Sidebar position="left" scrollable style={showSidebar ? {display: "flex", flexBasis: "auto", width: "100%", maxWidth: "100%"} : (isMobile ? {display: "none"} : {})} className="bg-gray-100 p-2">
          <ConversationHeader className="mb-2 bg-transparent">
            <ConversationHeader.Content className="text-xl font-bold">
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
                  className="hover:bg-gray-200 rounded-md p-3 cursor-pointer mb-1"
                >
                </Conversation>
              );
            })}
          </ConversationList>
        </Sidebar>

        <ChatContainer style={{display: showSidebar ? "none" : ""}} className="flex-grow flex flex-col bg-white border-l">
          {activeConversation && (
            <ConversationHeader className="border-b p-3">
              {isMobile ? <ConversationHeader.Back onClick={handleBackClick}/> : null}
              <ConversationHeader.Content className="text-lg font-bold pl-3"
                userName={(activeConversation.users.find((u) => u !== userEmail))}
                info={activeConversation.topic}
              />
            </ConversationHeader>
          )}
          <MessageList className="overflow-y-auto pt-2 lg:p-4">
            {activeConversation.messages.map((m) => (
              <Message
                key={m._id}
                model={{
                  message: m.content,
                  direction: userEmail === m.sender ? "outgoing" : "incoming",
                }}
                className={`rounded-lg ${
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
            className="p-2 border-t"
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};