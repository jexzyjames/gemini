import { useCallback, useContext, useRef, useState } from "react";
import userImg from "../assets/user_icon.png";
import sendIcon from "../assets/send_icon.png";
import messageIcon from "../assets/message_icon.png";
import compassIcon from "../assets/compass_icon.png";
import bulbIcon from "../assets/bulb_icon.png";
import codeIcon from "../assets/code_icon.png";
import galleryIcon from "../assets/gallery_icon.png";
import Sidebar from "./Sidebar";
import { Context } from "../Context";
import Login from "../Login";
import { FaBars, FaUser } from "react-icons/fa6";
import { FaArrowAltCircleRight, FaTimes } from "react-icons/fa";
import { useAuth } from "../AuthProvider";
import { toast } from "react-toastify";

const renderResponse = (response) =>
  response.split(/(<b>[\s\S]*?<\/b>|<br\/>)/g).map((part, index) => {
    if (part === "<br/>") return <br key={index} />;
    if (part.startsWith("<b>") && part.endsWith("</b>")) {
      return <b key={index}>{part.slice(3, -4)}</b>;
    }
    return part;
  });

const suggestions = [
  {
    prompt: "Suggest beautiful places to see on an upcoming road trip",
    icon: compassIcon,
  },
  {
    prompt: "Briefly summarize this concept: urban planning",
    icon: bulbIcon,
  },
  {
    prompt: "Brainstorm team branding activities for our work retreat",
    icon: messageIcon,
  },
  {
    prompt: "Tell me about React.js and React Native",
    icon: codeIcon,
  },
];

const Main = () => {
  const [popUp, setPopUp] = useState(false);
  const { user, logout } = useAuth();

  const [logOut, setLogOut] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const mobileMenuButtonRef = useRef(null);
  const closeMobileSidebar = useCallback(
    () => setMobileSidebarOpen(false),
    []
  );
  const {
    onSent,
    showResult,
    recentPrompt,
    loading,
    resultData,
    setInput,
    input,
  } = useContext(Context);

  const copyPrompt = async (prompt) => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success("Prompt copied");
    } catch (error) {
      console.error("Could not copy prompt:", error);
      toast.error("Could not copy prompt");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLogOut(false);
    } catch (error) {
      console.error("Could not log out:", error);
      toast.error("Could not log out. Please try again.");
    }
  };

  const [extended, setExtended] = useState(false);

  return (
    <div className="relative m-0 flex min-h-dvh w-full text-black">
      <Sidebar
        extended={extended}
        setExtended={setExtended}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
        mobileTriggerRef={mobileMenuButtonRef}
      />
      <div className="flex min-w-0 w-full flex-1 flex-col">
        <div className="flex w-full items-center justify-between px-4">
          <button
            type="button"
            ref={mobileMenuButtonRef}
            aria-label="Open navigation"
            aria-expanded={mobileSidebarOpen}
            onClick={() => setMobileSidebarOpen(true)}
            className="grid size-10 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-600 md:hidden"
          >
            <FaBars aria-hidden="true" size={18} />
          </button>
          <h2 className="texts text-[#757add]">Gemini</h2>
          <button
            type="button"
            aria-label={user ? "Open account menu" : "Log in"}
            aria-expanded={logOut}
            onClick={() => (user ? setLogOut((open) => !open) : setPopUp(true))}
            className="rounded-full"
          >
            <img
              className="w-9 cursor-pointer rounded-full"
              src={user?.photoURL || userImg}
              alt=""
            />
          </button>
        </div>
        {logOut && (
          <div className="absolute fade right-4 p-2  z-300 top-10 bg-white shadow-md rounded-md">
            <button
              type="button"
              aria-label="Close account menu"
              onClick={() => setLogOut(false)}
              className="right-2 cursor-pointer flex justify-end"
            >
              <FaTimes
                size={20}
                className="bg-red-400 text-white text-2xl rounded-full p-2"
              />
            </button>
            <p className="cursor-pointer flex-col items-center flex gap-2  text-sky-400">
              <span className="flex gap-1 mt-1 items-center text-purple-500">
                <FaUser />
                {user?.displayName || user?.email?.split("@")[0] || "Account"}
              </span>

              <button
                type="button"
                className="hover:bg-slate-800 hover:text-center hover:w-full hover:p-1 flex items-center gap-1"
                onClick={handleLogout}
              >
                <FaArrowAltCircleRight
                  className="cursor-pointer"
                />
                Log Out
              </button>
            </p>
          </div>
        )}
        {popUp && (
          <div className="absolute fade z-1222 left-0 right-0 mx-auto  bottom-0 bg-[#333]  opacity-95 flex justify-center items-center h-screen">
            <div className=" absolute flex justify-center lg:top-[-12%]   top-[-46%] items-center z-3000 h-screen lg:right-[30%] right-[4%]">
              <button
                type="button"
                aria-label="Close login"
                onClick={() => setPopUp(false)}
                className="bg-red-400 text-white block cursor-pointer rounded-full p-1 z-2000"
              >
                <FaTimes size={25} />
              </button>
            </div>
            <Login setPopUp={setPopUp} />
          </div>
        )}

        <div className="flex w-full  hero relative md:h-screen  px-3 flex-col mx-auto   justify-center">
          <div className=" mx-auto  h-screen wrapper relative max-w-[900px] flex flex-col gap-5 md:gap-6">
            {user ? (
              <div className="items-left  flex-col relative flex justify-items-start">
                <h1 className="text-[#c1719c] font-semibold text-left text-3xl texts">
                  Hello,{" "}
                  <span className="text-[#757add]">
                    {user
                      ? user.displayName ||
                        user.email.split("@")[0].charAt(0).toUpperCase() +
                          user.email.split("@")[0].slice(1).toLowerCase()
                      : "Dev"}
                  </span>{" "}
                </h1>
                <p className="text-[#c4c7c5] font-semibold text-2xl texts">
                  How can I help you today?
                </p>
              </div>
            ) : (
              <p className="text-[#c4c7c5] font-semibold text-2xl texts">
                <b className="text-[#c1719c]">Hello,</b>How can I help you today?
              </p>
            )}

            {showResult || loading ? (
              <div className="flex relative  xs:w-[600px] sm:w-[700px] md:w-[600px] lg:w-[900px]  gap-4">
                {
                  <p className="text-[#c1719c] absolute top-[-14px] mb-16 leading-relaxed flex gap-6 items-center text-sm md:text-md font-semibold">
                    Q: {recentPrompt || input}
                  </p>
                }

                <img
                  className="w-8 h-8 mt-9 rounded-full"
                  src={user?.photoURL || userImg}
                  alt=""
                />
                {loading && <p className=" loaded absolute  text-sm"></p>}

                <div
                  style={{ whiteSpace: "pre-line" }}
                  className=" mt-9  w-full overflow-scroll overflow-x-hidden answer h-[60vh]  text-md"
                >
                  {renderResponse(resultData)}
                </div>
              </div>
            ) : (
              <div className="md:flex cards grid grid-cols-2  justify-center  mx-auto items-center max-w-[900px] p-2 w-full gap-3 ">
                {suggestions.map(({ prompt, icon }) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void copyPrompt(prompt)}
                    aria-label={`Copy prompt: ${prompt}`}
                    className="bg-[#f0f4f9] md:w-[203px] card w-full h-[200px] relative p-2 rounded-md text-left cursor-pointer"
                  >
                    <span className="text-xl texts">{prompt}</span>
                    <span className="bottom-2 bg-white p-1 rounded-full absolute right-1">
                      <img className="w-9" src={icon} alt="" />
                    </span>
                  </button>
                ))}
              </div>
            )}
            <div className="  md:w-[100%] m-0 w-[100%] md:max-w-[900px]  absolute bottom-2 z-222 md:bottom-20   ">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!loading) void onSent();
                }}
                className="rounded-3xl texts relative justify-between items-center flex bg-[#f0f4f9] p-3"
              >
                <input
                  className=" outline-0  md:w-full border-0 font-semibold"
                  type="text"
                  aria-label="Enter a prompt"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Enter a prompt here"
                />

                <div className="flex items-center gap-3  ">
                  <img className="w-4" src={galleryIcon} alt="" />
                  <button
                    type="submit"
                    aria-label="Send prompt"
                    disabled={!input.trim() || loading}
                    className="disabled:opacity-50"
                  >
                    <img className="w-4" src={sendIcon} alt="" />
                  </button>
                </div>
              </form>
              <p className="text-center sm:text-sm md:text-md lg:text-lg text  font-semibold  texts ">
                Gemini may make mistakes. Check important information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
