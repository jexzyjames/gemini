import { createContext, useState,useEffect } from "react";
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
  import { db, auth,app } from "./config/firebase.js";
  import {
    GoogleGenAI,
  } from '@google/genai';
  
const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [newInput, setNewInput] = useState([]);
  const[user, setUser]  = useState(null)
  let [store]= useState([])

  const delay = (i, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * i);
  };
   
 




  const newChat = ()=>{
    setLoading(false)
    setShowResult(false)
    setPrevPrompt([])
  }
  const ai = new GoogleGenAI({ apiKey:process.env.GEMINI_API_KEY });

async function getData(input) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: input,
  });
  console.log(response.text);
//   setResultData(response.text) 
return response.text;
}

useEffect(() => {
    const savedPrompts = localStorage.getItem('previousPrompts');
    if (savedPrompts) {
      setPrevPrompt(JSON.parse(savedPrompts));
    }
  }, []);

const onSent = async (prompt) => {
    // if(!user) return
    setResultData("");
    setLoading(true);
    const currentPrompt = prompt ?? input;
    // const updatedPrompts = [...prevPrompt, currentPrompt];
    // setPrevPrompt(updatedPrompts);
    // localStorage.setItem('previousPrompts', JSON.stringify(updatedPrompts));
    if (!prevPrompt.includes(currentPrompt)) {
      const updatedPrompts = [...prevPrompt, currentPrompt];
      setPrevPrompt(updatedPrompts);
      localStorage.setItem('previousPrompts', JSON.stringify(updatedPrompts));
    }
    let res;
    if (prompt !== undefined) {
      res = await getData(prompt);
      setRecentPrompt(prompt);

    } else {
      setRecentPrompt(input);
      res = await getData(input);
setPrevPrompt(prev=> [...prev, input])
      
      
      
}


    setShowResult(true);
    let responseArr = res.split("**");
    let newRes ='';
    for (let i = 0; i < responseArr.length; i++) {
      if (i === 0 || i % 2 === 0) {
        newRes += responseArr[i];
      } else {
        newRes += `<b>${responseArr[i]}</b>`;
      }
    }
    let newRes1 = newRes.split("*").join("<br/>");
    let newResAr = newRes1.split(" ");
    // setResultData("");
    for (let i = 0; i < newResAr.length; i++) {
      const nextWord = newResAr[i];
      delay(i, nextWord + " ");
    }
    setResultData(newRes1);
    console.log(newRes1)
    setLoading(false);
    setInput("");
  };






//   const onSent = async (prompt) => {
//     setResultData("");
//     setLoading(true);
//     const currentPrompt = prompt ?? input;
//     setPrevPrompt((prev) => [...prev, currentPrompt]);
//     setRecentPrompt(currentPrompt);
  
//     try {
//       const res = await main(currentPrompt);
//       setShowResult(true);
  
//       let responseArr = res.split("**");
//       let newRes = "";
  
//       for (let i = 0; i < responseArr.length; i++) {
//         if (i === 0 || i % 2 !== 1) {
//           newRes += responseArr[i];
//         } else {
//           newRes += "<b>" + responseArr[i] + "</b>";
//         }
//       }
  
//       let newRes1 = newRes.split("*").join("</br>");
//       let newResAr = newRes1.split(" ");
  
//       for (let i = 0; i < newResAr.length; i++) {
//         const nextWord = newResAr[i];
//         delay(i, nextWord + " ");
//       }
  
//       setResultData(newRes1);
//     } catch (error) {
//       console.error("Error during request:", error);
//       // Optional: show an error message in UI
//     } finally {
//       setLoading(false);
//       setInput("");
//     }
//   };
  
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
  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};
export default ContextProvider;
