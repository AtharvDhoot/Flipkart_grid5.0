import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    setSessId(generateRandomString(30));
  }, []);

  return (
    <div
      className={`flex flex-col justify-between h-[80%] hd:h-[85%] md:!h-[95%] ${
        showCart ? "hidden" : ""
      }`}
    >
      <div className="flex place-content-center place-items-center h-full">
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
        onSubmit={async (e) => {
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

          setMessages((oldMessages) => {
            const msgs = [...oldMessages];
            msgs.push({
              isHuman: false,
              content: output,
            });

            return msgs;
          });
          // console.log(
          //   response.body
          //     .getReader()
          //     .read()
          //     .then((e) => e.value)
          // );
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
            defaultValue=""
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
