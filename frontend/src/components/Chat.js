import React from "react";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";

const Chat = ({ showCart }) => {
  return (
    <div
      className={`flex flex-col justify-between p-8 h-[80%] hd:h-[85%] md:!h-[95%] ${
        showCart ? "hidden" : ""
      }`}
    >
      <div className="flex place-content-center place-items-center h-full">
        <div className="flex flex-col h-[60%] w-full justify-center gap-16 md:gap-36">
          <h1 className="text-2xl text-black font-semibold text-center">
            Fashion
          </h1>
          <div className="grid grid-cols-2 justify-center place-items-center gap-4">
            <PromptTile
              title="Prompt 1"
              desc="Desc 1"
              className="place-self-end"
            />
            <PromptTile
              title="Prompt 1"
              desc="Desc 1"
              className="place-self-start"
            />
            <PromptTile
              title="Prompt 1"
              desc="Desc 1"
              className="place-self-end"
            />
            <PromptTile
              title="Prompt 1"
              desc="Desc 1"
              className="place-self-start"
            />
          </div>
        </div>
      </div>
      <div className="grid place-items-end ">
        <div className="flex w-full gap-4">
          <button className="btn btn-square btn-outline">
            <UploadFileIcon />
          </button>
          <button className="btn btn-square btn-outline">
            <MicIcon />
          </button>
          <input
            type="text"
            placeholder="Start Typing"
            className="input input-bordered w-full text-black !bg-neutral-200"
          />
          <button className="btn btn-square btn-outline !bg-primary">
            <SendIcon className="text-white fill-white" />
          </button>
        </div>
      </div>
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
