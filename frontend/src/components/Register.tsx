import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Role, RoutePath } from "../enums";
import MainLogo from "../icons/MainLogo";
import apiService from "../service";
import ButtonWithSpinner from "./ButtonWithSpinner";

export default function Registration() {
  const navigate = useNavigate();
  const { postService } = apiService();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onRegister = async (formData: FormData) => {
    setIsSubmitting(true);
    const email = formData.get("email")?.valueOf()?.toString();
    const password = formData.get("password")?.valueOf()?.toString();
    const role = formData.get("role")?.valueOf();
    if (email && password) {
      const requireAdminAccess = !!role;
      const response = await postService("/register", {
        email,
        password,
        role: requireAdminAccess ? Role.ADMIN : Role.USER,
      });
      console.log(response);
    }
    setIsSubmitting(false);
  };

  const goToLogin = () => {
    navigate(RoutePath.LOGIN);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    const form = event.currentTarget; // Get the form element
    const formData = new FormData(form); // Create FormData from the form

    await onRegister(formData); // Call your registration function
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <MainLogo
          style={{
            position: "absolute",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Register
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} method="POST" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-6 shrink-0 items-center">
              <div className="group grid size-4 grid-cols-1">
                <input
                  id="role"
                  name="role"
                  type="checkbox"
                  aria-describedby="role-description"
                  className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                />
                <svg
                  fill="none"
                  viewBox="0 0 14 14"
                  className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                >
                  <path
                    d="M3 8L6 11L11 3.5"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0 group-has-checked:opacity-100"
                  />
                  <path
                    d="M3 7H11"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0 group-has-indeterminate:opacity-100"
                  />
                </svg>
              </div>
            </div>
            <div className="text-sm/6">
              <label htmlFor="role" className="font-medium text-gray-900">
                Request admin access
              </label>
              <p id="role-description" className="text-gray-500">
                Request admin access from the administrator. You will get access
                only after completing KYC.
              </p>
            </div>
          </div>
          <div>
            <ButtonWithSpinner
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
              isLoading={isSubmitting}
              label="Register"
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={goToLogin}
              className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
            >
              Already user ? Login{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
