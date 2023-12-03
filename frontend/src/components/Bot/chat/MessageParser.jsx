import React from "react";

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    return actions.handleMessage(message);
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
        });
      })}
    </div>
  );
};

export default MessageParser;
