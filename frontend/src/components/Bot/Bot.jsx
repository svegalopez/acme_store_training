import React from "react";
import styles from "./Bot.module.css";
import Chatbot from "react-chatbot-kit";
import config from "./chat/config";
import MessageParser from "./chat/MessageParser";
import ActionProvider from "./chat/ActionProvider";
import classes from "../../utils/classes";
import isDescendant from "../../utils/isDescendant";

import "react-chatbot-kit/build/main.css";
import "./chatbot.css";

export default function Bot() {
  const [hidden, setHidden] = React.useState(true);
  const handleClick = () => setHidden((prev) => !prev);

  function handleClickOutside(e) {
    if (!isDescendant(document.getElementById(`chatbot`), e.target)) {
      setHidden(true);
    }
  }

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div id="chatbot">
      <div onClick={handleClick} className={styles.trigger}>
        ?
      </div>
      <div className={classes(styles.chat, hidden ? styles.hidden : "")}>
        <Chat />
      </div>
    </div>
  );
}

function Chat() {
  return (
    <Chatbot
      config={config}
      messageParser={MessageParser}
      actionProvider={ActionProvider}
      validator={(input) => input.length > 0 && input.length < 100}
    />
  );
}
