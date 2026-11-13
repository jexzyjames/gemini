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
  response.split(/(\*\*[\s\S]+?\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <b key={index}>{part.slice(2, -2)}</b>;
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
    responseSources,
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
    <div className="relative m-0 flex h-dvh min-h-0 w-full overflow-hidden text-black">
      <Sidebar
        extended={extended}
        setExtended={setExtended}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
        mobileTriggerRef={mobileMenuButtonRef}
      />
      <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
        <div className="flex w-full shrink-0 items-center justify-between px-4">
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

        <main className="flex min-h-0 flex-1 flex-col">
          <section className="min-h-0 flex-1 overflow-y-auto px-4">
            <div className="mx-auto flex min-h-full w-full max-w-[900px] flex-col justify-center gap-5 py-6 md:gap-6">
              {!showResult && !loading && (
                user ? (
                  <div className="flex flex-col">
                    <h1 className="text-left text-3xl font-semibold text-[#c1719c] texts">
                      Hello,{" "}
                      <span className="text-[#757add]">
                        {user.displayName ||
                          user.email?.split("@")[0]?.replace(/^./, (letter) =>
                            letter.toUpperCase()
                          ) ||
                          "there"}
                      </span>
                    </h1>
                    <p className="text-2xl font-semibold text-[#c4c7c5] texts">
                      How can I help you today?
                    </p>
                  </div>
                ) : (
                  <p className="text-2xl font-semibold text-[#c4c7c5] texts">
                    <b className="text-[#c1719c]">Hello,</b> How can I help you
                    today?
                  </p>
                )
              )}

              {showResult || loading ? (
                <section
                  aria-label="Conversation response"
                  className="flex min-h-0 w-full flex-1 flex-col gap-3"
                >
                  <p className="shrink-0 break-words text-sm font-semibold leading-relaxed text-[#c1719c] md:text-base">
                    Q: {recentPrompt || input}
                  </p>
                  <div className="flex min-h-0 flex-1 items-start gap-3">
                    <img
                      className="mt-1 size-8 shrink-0 rounded-full"
                      src={user?.photoURL || userImg}
                      alt=""
                    />
                    <div
                      role="log"
                      aria-live="polite"
                      aria-busy={loading}
                      className="answer min-h-0 w-full flex-1 overflow-y-auto whitespace-pre-wrap break-words text-base"
                    >
                      {loading && !resultData ? (
                        <span className="text-slate-500">Generating response…</span>
                      ) : (
                        renderResponse(resultData)
                      )}
                      {responseSources.length > 0 && (
                        <section
                          aria-label="Sources"
                          className="mt-6 border-t border-slate-200 pt-3"
                        >
                          <h2 className="mb-2 text-sm font-semibold text-slate-700">
                            Sources
                          </h2>
                          <ul className="space-y-1">
                            {responseSources.map(({ title, uri }) => (
                              <li key={uri}>
                                <a
                                  href={uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="break-all text-sm text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900"
                                >
                                  {title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </section>
                      )}
                    </div>
                  </div>
                </section>
              ) : (
                <div className="grid w-full grid-cols-2 justify-center gap-3 md:grid-cols-4">
                  {suggestions.map(({ prompt, icon }) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void copyPrompt(prompt)}
                      aria-label={`Copy prompt: ${prompt}`}
                      className="card relative min-h-28 rounded-md bg-[#f0f4f9] p-3 text-left cursor-pointer sm:min-h-36 md:min-h-48"
                    >
                      <span className="text-base texts sm:text-lg">{prompt}</span>
                      <span className="absolute bottom-2 right-2 rounded-full bg-white p-1">
                        <img className="w-8 sm:w-9" src={icon} alt="" />
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <footer className="w-full shrink-0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 sm:px-5">
            <div className="mx-auto w-full max-w-[900px]">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!loading) void onSent();
                }}
                className="flex items-center gap-3 rounded-3xl bg-[#f0f4f9] p-3"
              >
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent font-semibold outline-0"
                  type="text"
                  aria-label="Enter a prompt"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Enter a prompt here"
                />

                <img className="w-4 shrink-0" src={galleryIcon} alt="" />
                <button
                  type="submit"
                  aria-label="Send prompt"
                  disabled={!input.trim() || loading}
                  className="shrink-0 disabled:opacity-50"
                >
                  <img className="w-4" src={sendIcon} alt="" />
                </button>
              </form>
              <p className="mt-2 text-center text-xs font-semibold texts sm:text-sm">
                Gemini may make mistakes. Check important information.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Main;
