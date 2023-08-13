import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

import ToggleButton from "./ToggleButton";
import Chat from "./Chat";
import Cart from "./Cart";

const PersistentDrawer = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCartClick = () => {
    setShowCart(!showCart);
  };

  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content px-6 pb-6 pt-6 h-screen">
          <ToggleButton />
          <div className="bg-white rounded-3xl h-[95%] lg:h-full">
            <div className="grid md:grid-cols-12 h-full">
              <div className="md:col-span-9 2xl:col-span-10">
                <div className="h-full md:border-r-2">
                  <div className="flex bg-white rounded-3xl">
                    <div className="flex w-full justify-between">
                      <div className="text-xl text-black font-semibold ml-8 mt-4">
                        AI Chat Helper
                      </div>
                      <div className="mr-2 mt-4 gap-4 grid grid-cols-2 md:grid-cols-1 md:flex">
                        <input
                          type="text"
                          placeholder="Search"
                          className="input input-bordered w-full max-w-xs !bg-neutral hidden md:flex"
                        />
                        <button
                          className={`btn btn-square btn-outline shadow-md md:hidden ${
                            showCart ? "hidden" : ""
                          }`}
                          onClick={handleCartClick}
                        >
                          <ShoppingCartIcon />
                        </button>

                        <button
                          className={`btn btn-square btn-outline shadow-md md:hidden ${
                            showCart ? "" : "hidden"
                          }`}
                          onClick={handleCartClick}
                        >
                          <ChatBubbleIcon />
                        </button>

                        <button className="btn btn-square btn-outline shadow-md md:hidden">
                          <SearchIcon />
                        </button>
                        <button className="btn btn-square btn-outline shadow-md">
                          <NotificationsOutlinedIcon />
                        </button>
                        <button className="btn btn-square btn-outline shadow-md">
                          <InfoOutlinedIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                  <Chat showCart={showCart} />
                </div>
              </div>
              <div
                className={`bg-neutral md:rounded-r-3xl md:col-span-3 2xl:col-span-2 mt-4 md:mt-0 ${
                  showCart ? "block" : "hidden"
                } md:block overflow-y-scroll`}
              >
                <Cart />
              </div>
            </div>
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="drawer" className="drawer-overlay"></label>
          <nav className="menu p-4 w-80 h-full bg-base-200 text-base-content flex flex-col justify-between">
            <div>
              <div className="flex justify-between gap-4">
                <span className="p-2 px-4 pt-[4px] text-2xl font-semibold border rounded-md border-opacity-60 border-gray-400 w-full">
                  History
                </span>
              </div>
              <div className="flex my-4">
                <button className="btn btn-outline w-full">
                  <AddIcon />
                  New Chat
                </button>
              </div>
              <ul className="grid gap-4">
                <li>
                  <ChatTile title="Test 1" />
                </li>
                <li>
                  <ChatTile title="Test 1" desc="Test" />
                </li>
                <li>
                  <ChatTile title="Test 1" desc="Test" />
                </li>
                <li>
                  <ChatTile title="Test 1" desc="Test" />
                </li>
              </ul>
            </div>
            <div className="grid gap-4">
              <button className="btn w-full">
                <DeleteOutlineOutlinedIcon /> Clear History
              </button>
              <div className="relative inline-block">
                <button
                  className="btn w-full justify-between"
                  onClick={toggleMenu}
                >
                  <span>
                    <AccountBoxIcon /> <span className="ml-2">Name</span>
                  </span>
                  <MoreHorizIcon />
                </button>
                <div
                  className={`absolute bottom-0 mb-14 w-full shadow-md rounded z-20 ${
                    isMenuOpen ? "" : "hidden"
                  }`}
                >
                  <div className="btn btn-active w-full">
                    <SettingsOutlinedIcon /> Settings
                  </div>
                  <div className="btn btn-active w-full  mt-2">
                    <LoginOutlinedIcon /> Log Out
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

function ChatTile({ title, isSelected }) {
  return (
    <div
      className={`p-2 rounded-md hover:bg-slate-700 cursor-pointer ${
        isSelected && "bg-slate-600 hover:!bg-slate-600 "
      }`}
    >
      <div className="flex justify-between">
        <div className="flex w-52">
          <ChatBubbleOutlineOutlinedIcon className="opacity-80" />
          <span className="ml-2 text-ellipsis line-clamp-1">{title}</span>
        </div>
        <div>
          <button>
            <ModeEditOutlineOutlinedIcon />
          </button>
          <button className="ml-0.5">
            <DeleteOutlineOutlinedIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersistentDrawer;
