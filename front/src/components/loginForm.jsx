import React from "react";
import { useForm } from "react-hook-form";

function LoginForm({ onSwitchToRegister }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Login form submitted:", data);
  };

  return (
    <div className="bg-[#1f203c] w-100 h-100 ml-auto mr-auto self-center rounded-4xl relative top-25 text-white">
      <h1 className="text-4xl ml-auto mr-auto relative top-10 text-center select-none">
        Login
      </h1>
      <div className="flex ml-auto mr-auto self-center w-fit relative top-20 border-2 rounded-2xl">
        <div className="w-65 h-65">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className=" flex-row flex-wrap ml-5 mt-5"
          >
            <label htmlFor="login-email">Email:</label>
            <input
              id="login-email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Entered value does not match email format",
                },
              })}
              className="border-2 mb-1 mr-5"
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic mb-1">
                {errors.email.message}
              </p>
            )}

            <label htmlFor="login-password">Password:</label>
            <input
              id="login-password"
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
              className="border-2 mb-1"
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic mb-5">
                {errors.password.message}
              </p>
            )}

            <button
              type="submit"
              className="text-white bg-[#7c5df9] hover:bg-purple-800 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 mt-5 dark:bg-purple-[7c5df9] dark:hover:bg-purple-700 cursor-pointer"
            >
              Log In
            </button>
          </form>
          <p className="text-gray-500 text-xs relative left-30 bottom-16 select-none">
            Haven't registered yet?
          </p>
          <button
            type="button"
            className="py-2.5 px-5 me-2 mb-2 relative left-35 bottom-15 text-xs font-bold text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 cursor-pointer"
            onClick={onSwitchToRegister}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
