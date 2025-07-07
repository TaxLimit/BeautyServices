import React from "react";
import { useForm } from "react-hook-form";

function RegisterForm({ onSwitchToLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const password = watch("password", "");

  const onSubmit = (data) => {
    console.log("Register form submitted:", data);
  };

  return (
    <div className="bg-[#1f203c] w-100 h-140 ml-auto mr-auto self-center rounded-4xl relative top-25 text-white">
      <h1 className="text-4xl ml-auto mr-auto relative top-6 text-center select-none">
        Register
      </h1>
      <div className="flex ml-auto mr-auto self-center w-fit max-h-fit relative top-12 border-2 rounded-2xl">
        <div className="w-65 h-100 max-h-fit">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className=" flex-row flex-wrap ml-5 mt-5"
          >
            <label htmlFor="register-username">Username:</label>
            <input
              id="register-username"
              {...register("username", {
                required: "Username is required",
              })}
              className="border-2 mb-1 mr-5"
            />
            {errors.username && (
              <p className="text-red-500 text-xs italic mb-1">
                {errors.username.message}
              </p>
            )}

            <label htmlFor="register-email">Email:</label>
            <input
              id="register-email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email is invalid",
                },
              })}
              className="border-2 mb-1 mr-5"
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic mb-1">
                {errors.email.message}
              </p>
            )}

            <label htmlFor="register-password">Password:</label>
            <input
              id="register-password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                  message:
                    "Password must include uppercase, lowercase, and a number",
                },
              })}
              className="border-2 mb-1"
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic mb-1">
                {errors.password.message}
              </p>
            )}

            <label htmlFor="register-passwordconfirm">Confirm Password:</label>
            <input
              id="register-passwordconfirm"
              type="password"
              {...register("passwordconfirm", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="border-2 mb-1"
            />
            {errors.passwordconfirm && (
              <p className="text-red-500 text-xs italic mb-1">
                {errors.passwordconfirm.message}
              </p>
            )}

            <button
              type="submit"
              className="text-white bg-[#7c5df9] hover:bg-purple-800 focus:outline-none font-medium rounded-full text-sm mt-5 px-5 py-2.5 text-center mb-2 dark:bg-purple-[7c5df9] dark:hover:bg-purple-700 cursor-pointer"
            >
              Register
            </button>
          </form>
          <p className="text-gray-500 text-xs relative left-27 bottom-16 select-none">
            Already have an account?
          </p>
          <button
            type="button"
            className="py-2.5 px-5 me-2 mb-2 relative left-35 bottom-15 text-xs font-bold text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 cursor-pointer"
            onClick={onSwitchToLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
