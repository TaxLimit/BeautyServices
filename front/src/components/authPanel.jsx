import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function Authpanel() {
  const [viewMode, setViewMode] = useState("initial");

  const showLogin = () => setViewMode("login");
  const showRegister = () => setViewMode("register");

  let content;
  if (viewMode === "initial") {
    content = (
      <div className="bg-[#1f203c] w-200 h-150 ml-auto mr-auto self-center rounded-4xl relative top-25 text-white">
        <h1 className="text-4xl ml-auto mr-auto relative top-40 text-center select-none">
          services Task
        </h1>
        <div className="relative top-65 mr-auto ml-auto text-center">
          <button
            className="relative inline-flex items-center justify-center mr-40 p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-[7c5df9] to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 cursor-pointer"
            onClick={showLogin}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Login
            </span>
          </button>
          <button
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 cursor-pointer"
            onClick={showRegister}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Register
            </span>
          </button>
        </div>
        <span className="relative left-20 top-100 text-gray-400 select-none">
          <p>by Darijus Dulinskas</p>
        </span>
      </div>
    );
  } else if (viewMode === "login") {
    content = <LoginForm onSwitchToRegister={showRegister} />;
  } else if (viewMode === "register") {
    content = <RegisterForm onSwitchToLogin={showLogin} />;
  }

  return content;
}

export default Authpanel;
