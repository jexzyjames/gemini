import { createContext, useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";

export const Context = createContext();

// Created once, not on every render.
// NOTE: VITE_ keys are visible in the browser bundle. For production,
// move this call to a backend or serverless function.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const responseInstructions =
  "You are a capable, current assistant. Answer the user's actual question directly, with useful detail appropriate to its complexity. For facts that may have changed, use Google Search and prefer recent, authoritative sources. Distinguish verified facts from uncertainty, never invent sources or details, and use clear headings or lists when they improve readability.";

async function getData(input) {
  if (!ai) {
    throw new Error("Missing VITE_GEMINI_API_KEY. Add it to .env and restart Vite.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: input,
    config: {
      systemInstruction: responseInstructions,
      tools: [{ googleSearch: {} }],
      temperature: 0.4,
    },
  });
  const groundingChunks =
    response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks
    .map((chunk) => chunk.web)
    .filter(
      (source) =>
        source?.title && /^https?:\/\//i.test(source.uri || "")
    )
    .filter(
      (source, index, list) =>
        list.findIndex((item) => item.uri === source.uri) === index
    )
    .map(({ title, uri }) => ({ title, uri }));

  return { text: response.text || "", sources };
}

function getRequestErrorMessage(error) {
  const message = error?.message || "";
  const statusMatch = message.match(/got status:\s*(\d{3})/i);
  const status =
    error?.status ??
    error?.code ??
    error?.error?.code ??
    (statusMatch ? Number(statusMatch[1]) : undefined);

  if (
    status === 401 ||
    /API key not valid|ACCESS_TOKEN_TYPE_UNSUPPORTED/i.test(message)
  ) {
    return "Gemini rejected the configured credential. Create a Gemini API key in Google AI Studio, replace VITE_GEMINI_API_KEY in .env, and restart Vite.";
  }
  if (status === 403) {
    return "This Gemini API key is not authorized. Check its API restrictions and Gemini API access in Google AI Studio.";
  }
  if (status === 429) {
    return "Gemini API quota exceeded. Check your Google AI Studio quota and billing.";
  }
  if (status === 404) {
    return "The selected Gemini model is unavailable. Check the model name and API access.";
  }
  if (status) {
    return `Gemini request failed (HTTP ${status}). Please try again later.`;
  }
  if (error?.message?.startsWith("Missing VITE_GEMINI_API_KEY")) {
    return error.message;
  }
  return "Could not connect to Gemini. Check your network connection and try again.";
}

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [responseSources, setResponseSources] = useState([]);
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
    setResponseSources([]);
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
    setResponseSources([]);
    setLoading(true);

    if (!prevPrompt.includes(currentPrompt)) {
      const updated = [...prevPrompt, currentPrompt];
      setPrevPrompt(updated);
      localStorage.setItem("previousPrompts", JSON.stringify(updated));
    }

    try {
      setRecentPrompt(currentPrompt);
      const { text, sources } = await getData(currentPrompt);
      setShowResult(true);
      setResponseSources(sources);

      typeOut(text);
    } catch (error) {
      console.error("Gemini request failed:", {
        status: error?.status,
        name: error?.name,
      });
      setShowResult(true);
      setResponseSources([]);
      setResultData(getRequestErrorMessage(error));
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
    responseSources,
    setRecentPrompt,
    setPrevPrompt,
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};

export default ContextProvider;
