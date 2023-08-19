import React, { useState } from "react";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";

const Chat = ({ showCart }) => {
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState([]);

  return (
    <div
      className={`flex flex-col justify-between h-[80%] hd:h-[85%] md:!h-[95%] ${
        showCart ? "hidden" : ""
      }`}
    >
      <div className="flex place-content-center place-items-center h-full">
        <div className="flex flex-col h-[60%] w-full justify-center gap-4 md:gap-8">
          {chatStarted ? (
            messages.map((msg) => {
              let component;

              if (msg.isHuman) {
                component = (
                  <div className="chat chat-end">
                    <div className="chat-bubble">{msg.content}</div>
                  </div>
                );
              } else {
                component = (
                  <div className="chat chat-start">
                    <div className="chat-bubble">{msg.content}</div>
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

          <div className="chat chat-start hidden">
            <div className="chat-bubble">
              It's over Anakin, <br />I have the high ground.
            </div>
          </div>
          <div className="chat chat-end hidden">
            <div className="chat-bubble">You underestimate my power!</div>
          </div>
        </div>
      </div>
      <form
        className="grid place-items-end mb-[5%] mx-4"
        onSubmit={(e) => {
          e.preventDefault();

          if (!chatStarted) setChatStarted(true);
          const inputField = document.getElementById("text-box");
          const userMsg = inputField.value;
          inputField.value = "";

          setMessages((oldMessages) => {
            const msgs = [...oldMessages];
            msgs.push({
              isHuman: true,
              content: userMsg,
            });

            return msgs;
          });
        }}
      >
        <div className="flex w-full gap-4">
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
            className="input input-bordered w-full text-black !bg-neutral-200"
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
