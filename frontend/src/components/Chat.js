import React, { useEffect, useState, useRef } from "react";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import ReactMarkdown from "react-markdown";

function generateRandomString(length) {
  return [...Array(length)]
    .map(() => (~~(Math.random() * 36)).toString(36))
    .join("");
}

const Chat = ({ showCart }) => {
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState([]);

  const [sessId, setSessId] = useState();

  const scrollContainerRef = useRef();

  const addNewMessage = (message) => {
    // const contentDiv = scrollContainerRef.current;
    setMessages((oldMessages) => {
      const msgs = [...oldMessages];
      msgs.push(message);

      return msgs;
    });
  };

  useEffect(() => {
    setSessId(generateRandomString(30));
  }, []);

  useEffect(() => {
    function scrollToBottom() {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight;
      }
    }

    scrollToBottom();
  }, [messages, scrollContainerRef]);

  return (
    <div
      className={`flex relative h-full flex-col justify-between ${
        showCart ? "hidden" : ""
      }`}
      ref={scrollContainerRef}
    >
      <div className="flex place-content-center place-items-center overflow-hidden mb-24">
        <div className="flex flex-col h-[60%] w-full justify-center gap-4 md:gap-8">
          {chatStarted ? (
            messages.map((msg, index) => {
              let component;

              if (msg.isHuman) {
                component = (
                  <div className="chat chat-end" key={index}>
                    <div className="chat-bubble">{msg.content}</div>
                  </div>
                );
              } else {
                component = (
                  <div className="chat chat-start" key={index}>
                    <div className="chat-bubble">
                      <ReactMarkdown
                        children={msg.content}
                        components={{
                          img({ node, className }) {
                            let imgSrc = node.properties.src;
                            if (imgSrc.startsWith("imgs/")) {
                              imgSrc = `/${imgSrc}`;
                            }

                            return (
                              <img
                                className={`${className ?? ""} rounded-lg`}
                                src={imgSrc}
                                alt={node.properties.alt}
                                height={node.properties.height ?? 300}
                                width={node.properties.width ?? 180}
                              />
                            );
                          },
                        }}
                      />
                    </div>
                  </div>
                );
              }

              return component;
            })
          ) : (
            <h1 className="text-2xl text-base-100 font-semibold text-center">
              ✨Ask away all your fashion queries or shop for something
            </h1>
          )}
        </div>
      </div>

      <form
        className="absolute bottom-20 rigth-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2 md:pl-2 md:w-[calc(100%-.5rem)]"
        onSubmit={async (e) => {
          e.preventDefault();

          if (!chatStarted) setChatStarted(true);
          const inputField = document.getElementById("text-box");
          const userMsg = inputField.value;
          inputField.value = "";

          addNewMessage({
            isHuman: true,
            content: userMsg,
          });

          console.log("SESS ID: ", sessId);
          const response = await fetch(
            "http://127.0.0.1:2000/api/v1/chatbot/input",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
                sess_id: sessId,
                input: userMsg,
              }),
            }
          );

          const output = (await response.json()).output;

          addNewMessage({
            isHuman: false,
            content: output,
          });
        }}
      >
        <div className="flex gap-4 w-full">
          <button className="btn btn-square btn-outline">
            <UploadFileIcon />
          </button>
          <button className="btn btn-square btn-outline">
            <MicIcon />
          </button>
          <input
            id="text-box"
            type="text"
            placeholder="Start Typing"
            defaultValue=""
            className="input w-full input-bordered text-black !bg-neutral-200"
          />
          <button className="btn btn-square btn-outline !bg-primary">
            <SendIcon className="text-white fill-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

function PromptTile({ title, desc, className }) {
  return (
    <button
      className={`btn btn-outline w-[80%] xl:w-[60%] normal-case ${className}`}
    >
      <div className="grid text-black text-opacity-60">
        <span>{title}</span>
        <span>{desc}</span>
      </div>
    </button>
  );
}

export default Chat;
