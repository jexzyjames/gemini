import { createContext, useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";

export const Context = createContext();

// Created once, not on every render.
// NOTE: VITE_ keys are visible in the browser bundle. For production,
// move this call to a backend or serverless function.
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

async function getData(input) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: input,
    });
    return response.text || "";
  } catch (error) {
    console.error("API Error:", error);
    return "Sorry, I couldn't generate a response. Please try again.";
  }
}

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [user, setUser] = useState(null);
  const [store] = useState([]);

  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Types the response out word by word
  const typeOut = (text) => {
    clearTimers();
    setResultData("");
    timers.current = text
      .split(" ")
      .map((word, i) =>
        setTimeout(() => setResultData((prev) => prev + word + " "), 75 * i)
      );
  };

  const newChat = () => {
    clearTimers();
    setLoading(false);
    setShowResult(false);
    setResultData("");
    setInput("");
    // prevPrompt is intentionally NOT cleared, so saved history survives
  };

  // Load saved history once
  useEffect(() => {
    try {
      const saved = localStorage.getItem("previousPrompts");
      if (saved) setPrevPrompt(JSON.parse(saved));
    } catch (e) {
      console.error("Could not load saved prompts:", e);
    }
  }, []);

  // Clean up timers on unmount
  useEffect(() => clearTimers, []);

  const deleteSinglePrompt = (promptToDelete) => {
    const updated = prevPrompt.filter((p) => p !== promptToDelete);
    setPrevPrompt(updated);
    localStorage.setItem("previousPrompts", JSON.stringify(updated));
  };

  const onSent = async (prompt) => {
    const currentPrompt = prompt ?? input;
    if (!currentPrompt || !currentPrompt.trim()) return;

    clearTimers();
    setResultData("");
    setLoading(true);

    if (!prevPrompt.includes(currentPrompt)) {
      const updated = [...prevPrompt, currentPrompt];
      setPrevPrompt(updated);
      localStorage.setItem("previousPrompts", JSON.stringify(updated));
    }

    try {
      setRecentPrompt(currentPrompt);
      const res = await getData(currentPrompt);
      setShowResult(true);

      // **bold** -> <b>, remaining * -> line breaks
      const parts = res.split("**");
      let formatted = "";
      for (let i = 0; i < parts.length; i++) {
        formatted += i % 2 === 0 ? parts[i] : `<b>${parts[i]}</b>`;
      }
      formatted = formatted.split("*").join("<br/>");

      typeOut(formatted);
    } catch (error) {
      console.error("Error sending prompt:", error);
      setResultData("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const value = {
    input,
    store,
    setInput,
    setResultData,
    newChat,
    prevPrompt,
    deleteSinglePrompt,
    recentPrompt,
    onSent,
    setLoading,
    loading,
    user,
    setShowResult,
    showResult,
    setUser,
    resultData,
    setRecentPrompt,
    setPrevPrompt,
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};

export default ContextProvider;
