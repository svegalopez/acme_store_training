import React from "react";
import { createCustomMessage } from "react-chatbot-kit";
import MarkdownIt from "markdown-it";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const threadId = React.useRef(null);

  const handleMessage = async (message) => {
    setState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        createChatBotMessage("I'll get back to you shortly..."),
      ],
    }));

    // Disable the send button and add a class
    const sendBtn = document.querySelector(".react-chatbot-kit-chat-btn-send");
    sendBtn.disabled = true;
    sendBtn.classList.add("react-chatbot-kit-chat-btn-send--disabled");

    const response = await fetch(`${process.env.HOST}/api/chat`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        thread_id: threadId.current,
      }),
    });

    const res = await response.json();
    threadId.current = res.threadId;

    const renderedMarkdown = markdownToHTML(res.response);
    const botMessage = createCustomMessage(null, "custom", {
      payload: renderedMarkdown,
    });

    setState((prev) => {
      const messages = [...prev.messages];
      messages.pop();
      return {
        ...prev,
        messages: [...messages, botMessage],
      };
    });

    //Enable the send button
    sendBtn.disabled = false;
    sendBtn.classList.remove("react-chatbot-kit-chat-btn-send--disabled");
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleMessage,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;

function markdownToHTML(markdown) {
  // Remove the following pattern 【whatever】from the string
  const quoteRegex = /【.*?】/g;
  markdown = markdown.replace(quoteRegex, "");

  // Render the markup to html
  const md = new MarkdownIt();
  return md.render(markdown);
}
