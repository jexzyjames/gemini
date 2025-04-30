import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "./Context";
import { FaEye, FaGoogle, FaEyeSlash } from "react-icons/fa6";

import { toast, ToastContainer } from "react-toastify";

import { useAuth } from "./AuthProvider";

const Register = ({ setLogState }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordRef = useRef(null);
  const [passRef, setPassRef] = useState("password");
  const { loading } = useContext(Context);
  const { signup } = useAuth();
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log(confirmPassword, password);
      toast.error("password do not match");
      return;
    }
    if (!email || !password || !confirmPassword) {
      toast.error("input all fields");
      return false;
    }
    try {
      const userCredential = await signup(email, password);
      const user = userCredential.user;
      toast.success("Signed up successfully");
      console.log(user);
      setLogState(true);
    } catch (error) {
      toast.error(error.code);
      console.error("Signup error:", error);
    }
    setLogState(true);
  };
  return (
    <div className=" fade w-full  m-0 max-w-[600px]">
      <form
        onSubmit={(e) => handleSignUp(e)}
        className=" flex  justify-center items-center place-items-center p-3  m-auto md:max-w-[600px]    "
      >
        <div className="w-full  gap-[10px] flex flex-col   bg-white shadow-md p-[1.2rem] rounded-xl ">
          <h1 className="font-bold  text-left text-3xl text-orange-300">
            Register
          </h1>
          <h1 className="font-semibold col-span-2 m-0 text-left md:text-xl text-md text-black">
            Input all fields correctly{" "}
          </h1>
          <div className=" flex gap-1  text-left  text-slate-950">
            I have an account?
            <p>
              <span
                onClick={() => setLogState(false)}
                className="text-blue-500 cursor-pointer text-left"
              >
                {" "}
                Sign in
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
            <div className="flex w-full justify-center rounded-3xl border p-2 h-11 items-center ">
              <input
                className="text-black outline-0 placeholder:text-slate-900 mt-2 flex flex-1 items-center  bg-transparent  w-full  rounded-3xl p-1  mb-2 "
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
          <div className=" ">
            <h1 className="text-black text-md mb-2"> Confirm Password</h1>
            <div className="flex w-full justify-center rounded-3xl border p-2 h-11 items-center ">
              <input
                className="text-black outline-0 placeholder:text-slate-900 flex flex-1 bg-transparent items-center mt-2   w-full  rounded-3xl p-1  mb-2 "
                type={passRef}
                ref={passwordRef}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
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

          {
            <div className="absolute right-10">
              <ToastContainer />
            </div>
          }
          <input
            className="cursor-pointer mt-2 col-span-2 bg-[#ff2d1c] hover:bg-slate-900 text-white border rounded-3xl p-2  w-full mb-2 "
            type="submit"
            value={loading ? "loading" : "Sign Up"}
          />
        </div>
      </form>
    </div>
  );
};

export default Register;
