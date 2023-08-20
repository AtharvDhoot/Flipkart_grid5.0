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
  const [isLoading, setIsLoading] = useState(false);
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
      className={`h-[72vh] md:h-[78vh] lg:h-full flex relative flex-col justify-between mt-4 ${
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
            <div>
              <h1 className="text-base md:text-2xl text-base-100 font-semibold text-center mt-52">
                ✨Ask away all your fashion queries or shop for something
              </h1>
              {/* <div className="grid grid-cols-2 justify-center place-items-center gap-4 mt-6">
                <PromptTile
                  title="Party Attire"
                  desc="What to wear for the party"
                  className="place-self-end"
                />
                <PromptTile
                  title="Casual Look"
                  desc="Relaxed outfit suggestion"
                  className="place-self-start"
                />
                <PromptTile
                  title="Formal Event"
                  desc="Elegant dress code recommendation"
                  className="place-self-end"
                />
                <PromptTile
                  title="Sporty Outfit"
                  desc="Athletic and comfortable clothing idea"
                  className="place-self-start"
                />
              </div> */}
            </div>
          )}
        </div>
      </div>

      <form
        className="absolute bottom-0 px-4 md:px-0 md:bottom-24 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white  md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2 md:pl-2 md:w-[calc(100%-.5rem)]"
        onSubmit={async (e) => {
          e.preventDefault();

          if (!chatStarted) setChatStarted(true);
          setIsLoading(true);
          const inputField = document.getElementById("text-box");
          const userMsg = inputField.value;
          inputField.value = "";
          if (userMsg.trim().length > 0) {
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
                  user_id:
                    "00000dbacae5abe5e23885899a1fa44253a17956c6d1c3d25f88aa139fdfc657",
                }),
              }
            );

            const output = (await response.json()).output;

            addNewMessage({
              isHuman: false,
              content: output,
            });
            setIsLoading(false);
          }
        }}
      >
        {isLoading ? (
          <div className="grid items-center justify-center">
            <div className="loading loading-dots loading-lg mx-2 my-1 "></div>
          </div>
        ) : null}
        <div className="flex gap-4 w-full">
          <button className="btn btn-square btn-outline">
            <UploadFileIcon />
          </button>
          <button className="btn btn-square btn-outline hidden md:flex">
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

// function PromptTile({ title, desc, className }) {
//   return (
//     <button
//       className={`btn btn-outline w-[80%] xl:w-[60%] normal-case ${className}`}
//     >
//       <div className="grid text-black text-opacity-60">
//         <span>{title}</span>
//         <span>{desc}</span>
//       </div>
//     </button>
//   );
// }

export default Chat;
