import React, { useContext, useEffect, useState } from "react";
import "../index.css";
import menuIcon from "../assets/menu_icon.png";
import plusIcon from "../assets/plus_icon.png";
import questionIcon from "../assets/question_icon.png";
import historyIcon from "../assets/history_icon.png";
import settingsIcon from "../assets/setting_icon.png";
import message_icon from "../assets/message_icon.png";
import { Context } from "../Context";
import { useAuth } from "../AuthProvider";
const Sidebar = ({ extended, setExtended }) => {
  const [recent, setRecent] = useState([]);
  let { prevPrompt, setPrevPrompt, newChat, onSent, setRecentPrompt } =
    useContext(Context);
const{user} = useAuth()
  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  return (
    <div className="p-2 w-full fade h-screen hidden md:block m-0  bg-[#f0f4f9] ">
      <div className="flex   h-full flex-col justify-between items-center w-full ">
        <div className="flex max-w-full w-full cursor-pointer flex-col gap-10 mx-auto py-5 flex-start">
          <div>
            <img
              onClick={() => setExtended((prev) => !prev)}
              className=" cursor-pointer w-9"
              src={menuIcon}
              alt=""
            />
            {recent}
          </div>

          <div
            onClick={() => newChat()}
            className="flex bg-slate-200 rounded-full  items-center w-full gap-2 px-2 justify-between"
          >
            <img
              className="bg-[#e6eaf1] px-2  py-1  rounded-full  cursor-pointer opacity-100 w-9 h-9"
              src={plusIcon}
              alt=""
            />

            {extended && <span className="chat w-full">New Chat</span>}
          </div>

          {extended && (
            <span className="chat inline-block font-bold w-full">Recent</span>
          )}
          {extended || user &&
            <div className="flex gap-2 relative flex-col">
              <div className="flex overflow-y-scroll recent relative h-[300px] flex-col gap-2">
                {prevPrompt?.map((query, id) => {
                  return (
                    <div key={id} className="flex gap-22 items-center">
                      {extended || user && (
                        <div
                          onClick={() => loadPrompt(query)}
                          className="flex hover:bg-gray-300 px-1 w-full rounded-xl cursor-pointer gap-2 items-center"
                        >
                          <div>
                            <img src={message_icon} className="w-6" alt="" />
                          </div>

                          <span className="w-full cursor-pointer   text-sm font-semibold p-1">
                            {query?.slice(0, 18)} ...
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          }
        </div>

        <div className="flex gap-4 flex-col w-full  ">
          <div
            className={` ${
              extended && "  justify-start items-center"
            } flex gap-2 justify-center  items-center`}
          >
            <img className=" cursor-pointer w-9" src={questionIcon} alt="" />
            {extended && <p>Question</p>}
          </div>

          <div
            className={` ${
              extended && "  justify-start flex-start items-center"
            } flex gap-2 justify-center  items-center`}
          >
            <img
              onClick={() => {
                const clearHistory = () => {
                  localStorage.removeItem("previousPrompts");
                  setPrevPrompt([]);
                };
                clearHistory();
              }}
              className=" cursor-pointer  w-9"
              src={historyIcon}
              alt=""
            />
            {extended && <p>Activity</p>}
          </div>

          <div
            className={` ${
              extended && "  justify-start items-center"
            } flex gap-2 justify-center  items-center`}
          >
            <img className=" cursor-pointer  w-9" src={settingsIcon} alt="" />
            {extended && <p>Settings</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
