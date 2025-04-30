import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "./Context";
import { FaEye, FaGoogle, FaEyeSlash } from "react-icons/fa6";
import { BiLogoGoogle } from "react-icons/bi";
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
import Register from "./Register";
import { useAuth } from "./AuthProvider";
import { ToastContainer, toast } from "react-toastify";
const Login = ({ setPopUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);
  const [passRef, setPassRef] = useState("password");
  const [logState, setLogState] = useState(false);
  const { login, googleSignIn } = useAuth();
  // const[signIn,logOut, SignUp, googleSignIn] = useContext(Context)
  const { loading, setLoading } = useContext(Context);

  const GoogleSignIn = async () => {
    try {
      await googleSignIn();
      toast.success("Google sign in successfully");
      setPopUp(false);
    } catch (err) {
      toast.error(err);
    }
  };

  const Login = async () => {
    try {
      await login(email, password);
      alert("Logged in!");
      setPopUp(false);
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email && !password) {
      return;
    }

    await Login();
    setLoading(false);
    setPopUp(false);
  };
  return (
    <div className="fade w-full  m-0 max-w-[600px] ">
      {logState ? (
        <Register setLogState={setLogState} />
      ) : (
        <form
          onSubmit={(e) => handleLogin(e)}
          className=" flex  justify-center items-center place-items-center p-3  m-auto 3xl:max-w-[600px]    "
        >
          <div className="w-full  gap-[10px] flex flex-col   bg-white shadow-3xl p-[1.2rem] rounded-xl ">
            <h1 className="font-bold  text-left text-3xl text-orange-300">
              Login
            </h1>
            <h1 className="font-semibold col-span-2 m-0 text-left 3xl:text-xl text-3xl text-black">
              Input all fields correctly{" "}
            </h1>
            <div className=" flex gap-1  text-left  text-slate-950">
              Don't have an account?
              <p>
                <span
                  onClick={() => setLogState(true)}
                  className="text-blue-500 cursor-pointer text-left"
                >
                  {" "}
                  Sign up
                </span>
              </p>{" "}
            </div>

            <div>
              <h1 className="text-black text-md mb-2">Email</h1>
              <input
                className="text-black  placeholder:text-gray-600 border w-full rounded-3xl p-2  "
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>

            <div className=" ">
              <h1 className="text-black text-md mb-2">Password</h1>
              <div className="flex w-full justify-between rounded-3xl  border p-2 h-11 items-center ">
                <input
                  className="text-black outline-0 placeholder:text-slate-900 flex items-center mt-2  bg-transparent border border-transparent w-full flex-1   p-2  mb-2 "
                  type={passRef}
                  ref={passwordRef}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setPassRef(passRef === "password" ? "text" : "password");
                    passwordRef.current.type =
                      passRef === "password" ? "password" : "text";
                  }}
                >
                  {passRef === "password" ? (
                    <FaEye />
                  ) : (
                    <FaEyeSlash className="cursor-pointer" />
                  )}
                </span>
              </div>
            </div>
            <p className="text-center">Or</p>
            <div
              onClick={() => GoogleSignIn()}
              className="flex border rounded-3xl w-full justify-center hover:bg-slate-950 hover:text-white my-2 cursor-pointer "
            >
              <p className=" flex gap-2 items-center rounded-xl p-2">
                {" "}
                <BiLogoGoogle className="" /> Sign in with Google
              </p>
            </div>

            <ToastContainer />
            <input
              className="cursor-pointer mt-2 col-span-2 bg-[#ff2d1c] hover:bg-slate-900 text-white border rounded-3xl p-2 w-full mb-2 "
              type="submit"
              value={loading ? "loading" : "Log In"}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
