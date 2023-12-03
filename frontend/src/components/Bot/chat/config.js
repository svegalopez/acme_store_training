import { createChatBotMessage } from "react-chatbot-kit";
import React from "react";
import logo from "../../../assets/logo.svg";

const config = {
  initialMessages: [
    createChatBotMessage(
      `Hey there, have a question about one of our products?`
    ),
  ],
  botName: "Acme-GPT",
  customComponents: {
    botAvatar: (props) => (
      <span
        className="bobby-chat-avatar"
        style={{ backgroundImage: `url(${logo})` }}
      ></span>
    ),
  },
  customMessages: {
    custom: (props) => <CustomMessage {...props} />,
  },
};

export default config;

function CustomMessage(props) {
  return (
    <div
      className="react-chatbot-kit-chat-bot-message-container"
      data-custom="true"
    >
      <span
        className="bobby-chat-avatar"
        style={{ backgroundImage: `url(${logo})` }}
      ></span>
      <div className="react-chatbot-kit-chat-bot-message custom-message">
        <div dangerouslySetInnerHTML={{ __html: props.payload }}></div>
        <div className="react-chatbot-kit-chat-bot-message-arrow"></div>
      </div>
    </div>
  );
}
