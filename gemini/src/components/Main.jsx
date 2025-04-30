import React, { useEffect, useState, useCallback, useContext } from "react";
import userImg from "../assets/user_icon.png";
import sendIcon from "../assets/send_icon.png";
import micIcon from "../assets/mic_icon.png";
import messageIcon from "../assets/message_icon.png";
import compassIcon from "../assets/compass_icon.png";
import bulbIcon from "../assets/bulb_icon.png";
import codeIcon from "../assets/code_icon.png";
import debounce from "lodash.debounce";
import galleryIcon from "../assets/gallery_icon.png";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { Context } from "../Context";
import Login from "../Login";
import { FaUser } from "react-icons/fa6";
import { FaArrowAltCircleRight, FaTimes } from "react-icons/fa";
import { useAuth } from "../AuthProvider";

const Main = () => {
  const [popUp, setPopUp] = useState(false);
  useEffect(() => {
    let data;
    data = localStorage.getItem("query");
  }, []);
  const { user, logout } = useAuth();

  const [logOut, setLogOut] = useState(false);

  const {
    onSent,
    showResult,
    recentPrompt,
    loading,
    setLoading,
    resultData,
    setInput,
    input,
  } = useContext(Context);
  
  
    // Call your onSent function with the input
  

 
  useEffect(() => {}, [recentPrompt]);
  const [extended, setExtended] = useState(false);

  
  return (
    <div className=" w-full fade flex m-0 relative h-screen text-black ">
      <div
        className={` max-w-[80px] w-[100%] hidden md:block ${
          extended && "w-full max-w-[220px]"
        } `}
      >
        <Sidebar extended={extended} setExtended={setExtended} />
      </div>
      <div className="flex flex-col  flex-1 w-full">
        <div className="flex items-center w-full px-4 justify-between">
          <h2>Gemini</h2>
          <img
            onClick={() => {
              if (!user) {
                setPopUp(true);
                return;
              }
              setLogOut(!logOut);
            }}
            className="w-9 cursor-pointer rounded-full "
            src={user?.photoURL || userImg}
            alt="user_img"
          />
        </div>
        {logOut && (
          <div className="absolute fade right-4 p-2  z-300 top-10 bg-white shadow-md rounded-md">
            <span
              onClick={() => setLogOut(!logOut)}
              className="right-2 cursor-pointer flex justify-end"
            >
              <FaTimes size={30} className="bg-red-400 rounded-full p-2" />
            </span>
            <img className='w-9 flex m-auto items-center justify-center rounded-full' src={user?.photoURL} alt="" />
            <p
              className="cursor-pointer flex-col items-center flex gap-2  text-sky-400"
            >
              <span className="flex gap-1 mt-1 items-center text-purple-500">
                <FaUser />
                {user?.displayName}
              </span>

              <span className="hover:bg-slate-800 hover:text-center  hover:w-full hover:p-1 flex items-center gap-1" onClick={() => logout()}> <FaArrowAltCircleRight/> Logout</span>
            </p>
          </div>
        )}
        {console.log(user)}
        {popUp && (
          <div className="absolute fade z-1222 left-0 right-0 mx-auto  bottom-0 bg-[#333]  opacity-95 flex justify-center items-center h-screen">
            <div className=" absolute flex justify-center top-[-40%] items-center z-3000 h-screen right-[5%]">
              <FaTimes
                onClick={() => setPopUp(false)}
                className="bg-red-400 block cursor-pointer  rounded-full p-1 z-2000 text-black"
                size={30}
              />
            </div>
            <Login setPopUp={setPopUp} />
          </div>
        )}

        <div className="flex w-full  hero relative md:h-screen  px-3 flex-col mx-auto   justify-center">
          <div className=" mx-auto  h-screen wrapper relative max-w-[900px] flex flex-col gap-5 md:gap-6">
            <div className="items-left  flex-col relative flex justify-items-start">
              <h1 className="text-[#c1719c] font-semibold text-left text-3xl texts">
                Hello,{" "}
                <span className="text-[#757add]">
                  {user ? user?.displayName : "Dev"}
                </span>{" "}
              </h1>
              <p className="text-[#c4c7c5] font-semibold text-2xl texts">
                How can I help you today?
              </p>
            </div>
            {/* {loading && <p className=" loaded absolute  text-2xl"></p>} */}

            {showResult || loading ? (
              <div className="flex relative  xs:w-[600px] sm:w-[700px] md:w-[600px] lg:w-[900px]  gap-2">
                {
                  <p className="text-[#c1719c] absolute top-[-10px] mb-5 leading-relaxed flex gap-6 items-center  text-lg font-semibold">
                    Q: {recentPrompt}
                  </p>
                }

                <img
                  className="w-8 h-8 mt-9 rounded-full"
                  src={user?.photoURL || userImg}
                  alt=""
                />
                {loading && <p className=" loaded absolute  text-2xl"></p>}

                <div
                  dangerouslySetInnerHTML={{ __html: resultData }}
                  style={{ whiteSpace: "pre-line" }}
                  className=" mt-9  w-full overflow-scroll overflow-x-hidden answer h-[60vh]  text-md"
                />
              </div>
            ) : (
              <div className="md:flex cards grid grid-cols-2  justify-center  mx-auto items-center max-w-[900px] p-2 w-full gap-3 ">
                <div className="bg-[#f0f4f9] md:w-[203px] card h-[200px] relative p-2 rounded-md   ">
                  <h1 className="text-xl texts">
                    Sugest beautiful places to see on an upcoming road trip
                  </h1>
                  <div className="bottom-2 p-1 bg-white rounded-full  absolute right-1">
                    <img className="w-9" src={compassIcon} alt="" />
                  </div>
                </div>
                <div className="bg-[#f0f4f9] md:w-[203px] card h-[200px]  relative p-2 rounded-md   ">
                  <h1 className="text-xl texts">
                    Briefly summarize this concept: urban planning
                  </h1>
                  <div className="bottom-2 bg-white p-1 rounded-full  absolute right-1">
                    <img className="w-9" src={bulbIcon} alt="" />
                  </div>
                </div>
                <div className="bg-[#f0f4f9] md:w-[203px] sm:text-sm card w-full h-[200px]  relative p-2 rounded-md   ">
                  <h1 className="text-xl  texts">
                    Brainstorm team branding activities for our work retreat
                  </h1>
                  <div className="bottom-2 bg-white p-1 rounded-full  absolute right-1">
                    <img className="w-9" src={messageIcon} alt="" />
                  </div>
                </div>
                <div className="bg-[#f0f4f9] md:w-[203px] card w-full h-[200px]  relative p-2 rounded-md   ">
                  <h1 className="text-xl texts">
                    Tell me about React js and React native
                  </h1>
                  <div className="bottom-2 bg-white p-1 rounded-full  absolute right-1">
                    <img className="w-9" src={codeIcon} alt="" />
                  </div>
                </div>
              </div>
            )}
            <div className="  md:w-[100%] m-0 w-[100%] md:max-w-[900px]  absolute bottom-1 z-222 md:bottom-20   ">
              <div className="rounded-3xl texts relative  justify-between  items-center  flex  bg-[#f0f4f9] p-3">
                <input
                  className=" outline-0  md:w-full border-0 font-semibold"
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    // debouncedInput(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSent(input);
                      setInput("");

                      return;
                    }
                    if (e.target.value.trim() !== "") {
                      setInput(e.target.value);
                      setLoading(false);
                      // return;
                    }
                  }}
                  placeholder="Enter a prompt here"
                />

                <div className="flex items-center gap-3  ">
                  <img className="w-4 cursor-pointer" src={galleryIcon} />
                  <img
                    onClick={() => onSent()}
                    className="w-4 cursor-pointer"
                    src={input ? sendIcon : micIcon}
                  />
                </div>
              </div>
              <p className="text-center sm:text-sm md:text-md lg:text-lg text  font-semibold  texts ">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Laborum ea nobis maiores atque iste, veritatis incidunt eum
                fugiat sapiente ipsum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
