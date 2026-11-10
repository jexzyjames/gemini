import { useContext, useEffect, useRef } from "react";
import {
  FaBars,
  FaMessage,
  FaPlus,
  FaTrashCan,
  FaXmark,
} from "react-icons/fa6";
import { toast } from "react-toastify";
import { Context } from "../Context";
import { useAuth } from "../AuthProvider";

const Sidebar = ({
  extended,
  setExtended,
  mobileOpen,
  onMobileClose,
  mobileTriggerRef,
}) => {
  const {
    prevPrompt,
    deleteSinglePrompt,
    setPrevPrompt,
    newChat,
    onSent,
    setRecentPrompt,
  } = useContext(Context);
  const { user } = useAuth();
  const mobileDialogRef = useRef(null);
  const mobileCloseButtonRef = useRef(null);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const mobileTrigger = mobileTriggerRef?.current;
    document.body.style.overflow = "hidden";
    mobileCloseButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onMobileClose();
        return;
      }

      if (event.key !== "Tab") return;
      const focusableElements = mobileDialogRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      mobileTrigger?.focus();
    };
  }, [mobileOpen, mobileTriggerRef, onMobileClose]);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    onMobileClose();
    await onSent(prompt);
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem("previousPrompts");
      setPrevPrompt([]);
    } catch (error) {
      console.error("Could not clear prompt history:", error);
      toast.error("Could not clear chat history");
    }
  };

  const startNewChat = () => {
    newChat();
    onMobileClose();
  };

  const renderNavigation = (isMobile = false) => (
    <>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={isMobile ? onMobileClose : () => setExtended((open) => !open)}
          aria-label={isMobile ? "Close navigation" : "Toggle sidebar"}
          title={isMobile ? "Close navigation" : "Toggle sidebar"}
          ref={isMobile ? mobileCloseButtonRef : undefined}
          className={`grid size-10 shrink-0 place-items-center rounded-full text-slate-600 transition hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
            isMobile ? "" : "hidden md:grid"
          }`}
        >
          {isMobile ? (
            <FaXmark aria-hidden="true" size={18} />
          ) : (
            <FaBars aria-hidden="true" size={18} />
          )}
        </button>
        {isMobile && <span className="text-sm font-semibold text-slate-700">Menu</span>}
      </div>

      <button
        type="button"
        onClick={startNewChat}
        title="New chat"
        className={`mt-6 flex min-h-11 items-center gap-3 rounded-full bg-slate-200 px-3 text-sm font-medium text-slate-800 transition hover:bg-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
          isMobile || extended ? "w-full" : "mx-auto size-11 justify-center p-0"
        }`}
      >
        <FaPlus aria-hidden="true" className="shrink-0" size={16} />
        {(isMobile || extended) && <span>New chat</span>}
      </button>

      {user && (
        <section
          aria-label="Recent chats"
          className="mt-8 flex min-h-0 flex-1 flex-col"
        >
          <div
            className={`mb-2 flex items-center ${
              isMobile || extended ? "justify-between px-2" : "justify-center"
            }`}
          >
            {(isMobile || extended) && (
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Recent
              </h2>
            )}
            {prevPrompt.length > 0 && (isMobile || extended) && (
              <button
                type="button"
                onClick={clearHistory}
                aria-label="Clear chat history"
                title="Clear chat history"
                className="grid size-8 place-items-center rounded-full text-slate-500 transition hover:bg-slate-200 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <FaTrashCan aria-hidden="true" size={14} />
              </button>
            )}
            {!isMobile && !extended && prevPrompt.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                aria-label="Clear chat history"
                title="Clear chat history"
                className="grid size-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-200 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <FaTrashCan aria-hidden="true" size={14} />
              </button>
            )}
          </div>

          <ul className="min-h-0 space-y-1 overflow-y-auto">
            {prevPrompt.map((prompt, index) => (
              <li
                key={`${prompt}-${index}`}
                className={`group flex min-w-0 items-center gap-1 rounded-xl transition hover:bg-slate-200 ${
                  isMobile || extended ? "" : "justify-center"
                }`}
              >
                <button
                  type="button"
                  onClick={() => void loadPrompt(prompt)}
                  title={prompt}
                  className={`flex min-h-10 min-w-0 flex-1 items-center gap-3 rounded-xl px-2 text-left text-sm text-slate-700 focus-visible:outline-2 focus-visible:outline-indigo-600 ${
                    isMobile || extended ? "" : "justify-center"
                  }`}
                >
                  <FaMessage
                    aria-hidden="true"
                    className="shrink-0 text-slate-500"
                    size={15}
                  />
                  {(isMobile || extended) && (
                    <span className="truncate">{prompt}</span>
                  )}
                </button>
                {(isMobile || extended) && (
                  <button
                    type="button"
                    onClick={() => deleteSinglePrompt(prompt)}
                    aria-label={`Delete chat: ${prompt}`}
                    title="Delete chat"
                    className="mr-1 grid size-8 shrink-0 place-items-center rounded-full text-slate-400 opacity-100 transition hover:bg-white hover:text-red-600 focus-visible:outline-2 focus-visible:outline-indigo-600 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                  >
                    <FaXmark aria-hidden="true" size={15} />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {prevPrompt.length === 0 && (isMobile || extended) && (
            <p className="px-2 py-3 text-sm text-slate-500">No recent chats</p>
          )}
        </section>
      )}
    </>
  );

  return (
    <>
      <aside
        aria-label="Main navigation"
        className={`sticky top-0 hidden h-dvh shrink-0 flex-col bg-[#f0f4f9] p-3 transition-[width] duration-200 md:flex ${
          extended ? "w-64" : "w-16 lg:w-[4.5rem]"
        }`}
      >
        {renderNavigation()}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onMobileClose}
            className="absolute inset-0 bg-slate-950/40"
          />
          <aside
            ref={mobileDialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            className="relative flex h-dvh w-[min(18rem,85vw)] flex-col overflow-hidden bg-[#f0f4f9] p-4 shadow-xl"
          >
            {renderNavigation(true)}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
