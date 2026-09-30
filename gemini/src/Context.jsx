import { createContext, useState, useEffect } from "react";
export const Context = createContext();
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
    signOut,
  } from "firebase/auth";
  import { db, auth, app } from "./config/firebase.js";
  import {
    GoogleGenerativeAI,
  } from '@google/generative-ai';
  import { GoogleGenAI } from "@google/genai";

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [newInput, setNewInput] = useState([]);
  const [user, setUser] = useState(null);
  let [store] = useState([]);

  const delay = (i, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * i);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
    setInput("");
    setPrevPrompt([]);
  };

  const ai = new GoogleGenAI({ 
    apiKey: import.meta.env.VITE_GEMINI_API_KEY 
  }); 

  async function getData(input) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash", 
        contents: input
      });
      

      const text = response.text || response.content || "";
      console.log("API Response:", text);  // Debug log
      return text;
    } catch (error) {
      console.error("API Error:", error);
      return "Sorry, I couldn't generate a response. Please try again.";
    }
  }

  useEffect(() => {
    const savedPrompts = localStorage.getItem('previousPrompts');
    if (savedPrompts) {
      setPrevPrompt(JSON.parse(savedPrompts));
    }
  }, []);

  const deleteSinglePrompt = (promptToDelete) => {
    const updatedPrompts = prevPrompt.filter(prompt => prompt !== promptToDelete);
    setPrevPrompt(updatedPrompts);
    localStorage.setItem('previousPrompts', JSON.stringify(updatedPrompts));
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    
    const currentPrompt = prompt ?? input;  
    
    
    if (!prevPrompt.includes(currentPrompt)) {
      const updatedPrompts = [...prevPrompt, currentPrompt];
      setPrevPrompt(updatedPrompts);
      localStorage.setItem('previousPrompts', JSON.stringify(updatedPrompts));
    }
    
    try {
      
      setRecentPrompt(currentPrompt);
      
    
      const res = await getData(currentPrompt);
      
      
      setShowResult(true);
      
      let responseArr = res.split("**");
      let newRes = '';
      
      for (let i = 0; i < responseArr.length; i++) {
        if (i === 0 || i % 2 === 0) {
          newRes += responseArr[i];
        } else {
          newRes += `<b>${responseArr[i]}</b>`;
        }
      }
      
      let newRes1 = newRes.split("*").join("<br/>");
      let newResAr = newRes1.split(" ");
    
      for (let i = 0; i < newResAr.length; i++) {
        const nextWord = newResAr[i];
        delay(i, nextWord + " ");
      }
      
      setResultData(newRes1);
      console.log("Final Result:", newRes1);
      
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
