import { createContext, useState, useEffect } from "react";
import { GoogleGenAI } from '@google/genai';
import { db, auth, app } from "./config/firebase.js"; // Kept for your Firebase setup

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [user, setUser] = useState(null);
  const [store] = useState([]);

  // FIXED: Access environment variables using import.meta.env in Vite
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  // FIXED: Parameter named 'textPrompt' to avoid naming collisions
  async function getData(textPrompt) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: textPrompt, // FIXED: Correctly using the passed variable
      });
      return response.text; // Note: Ensure response parsing matches your SDK version (.text)
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Sorry, something went wrong fetching the response.";
    }
  }

  // Handle typing animation delay
  const delay = (i, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 40 * i); // Sped up slightly (from 75ms) for a smoother feel
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
  };

  // Load history on mount
  useEffect(() => {
    const savedPrompts = localStorage.getItem('previousPrompts');
    if (savedPrompts) {
      setPrevPrompt(JSON.parse(savedPrompts));
    }
  }, []);

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    const currentPrompt = prompt ?? input;

    // Track historical prompts safely
    if (currentPrompt.trim() !== "" && !prevPrompt.includes(currentPrompt)) {
      const updatedPrompts = [...prevPrompt, currentPrompt];
      setPrevPrompt(updatedPrompts);
      localStorage.setItem('previousPrompts', JSON.stringify(updatedPrompts));
    }

    setRecentPrompt(currentPrompt);
    
    // Fetch result from Gemini API
    const res = await getData(currentPrompt);

    // Format bold text markdown (**text**) to HTML <b> tags
    let responseArr = res.split("**");
    let newRes = '';
    for (let i = 0; i < responseArr.length; i++) {
      if (i === 0 || i % 2 === 0) {
        newRes += responseArr[i];
      } else {
        newRes += `<b>${responseArr[i]}</b>`;
      }
    }

    // Format lists and linebreaks
    let newRes1 = newRes.split("*").join("<br/>");
    let newResAr = newRes1.split(" ");

    // REMOVED: Immediate `setResultData(newRes1)` to let typing animation work
    for (let i = 0; i < newResAr.length; i++) {
      const nextWord = newResAr[i];
      delay(i, nextWord + " ");
    }

    setLoading(false);
    setInput("");
  };

  const value = {
    input,
    store,
    setInput,
    setResultData,
    newChat,
    prevPrompt,
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

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default ContextProvider;
