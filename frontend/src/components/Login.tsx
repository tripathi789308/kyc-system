import { useNavigate } from "react-router-dom";
import MainLogo from "../icons/MainLogo";
import { Constants, RoutePath } from "../enums";
import ButtonWithSpinner from "./ButtonWithSpinner";
import apiService from "../service";
import { useState } from "react";
import { useKycSystem } from "../context/kycSystemContextProvider";
import { useSnackbar } from "../context/snackbarContextProvider";

export default function Login() {
  const navigate = useNavigate();
  const { postService } = apiService();
  const { setLoggedUserData } = useKycSystem();
  const { showSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onLogin = async (formData: FormData) => {
    setIsSubmitting(true);
    const email = formData.get("email")?.valueOf()?.toString();
    const password = formData.get("password")?.valueOf()?.toString();
    if (email && password) {
      const response = await postService("/user/login", {
        email,
        password,
      });
      if (!response?.error) {
        setLoggedUserData(response.data?.userData);
        localStorage.setItem(Constants.TOKEN, response.data?.token);
        navigate(RoutePath.DASHBOARD);
        showSnackbar("User has successfully logged in", "success");
      } else {
        const errorMessage =
          typeof response?.error === "string"
            ? response.error
            : "Login attempt failed";
        showSnackbar(errorMessage as string, "error");
      }
    }
    setIsSubmitting(false);
  };
  const goToRegister = () => {
    navigate(RoutePath.REGISTER);
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    const form = event.currentTarget; // Get the form element
    const formData = new FormData(form); // Create FormData from the form

    await onLogin(formData); // Call your registration function
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
          Login
        </h2>
      </div>

      <div className=" flex gap-4 flex-col mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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

          <div>
            <ButtonWithSpinner
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
              isLoading={isSubmitting}
              label="Login"
            />
          </div>
        </form>
        <div className="flex justify-center">
          <button
            onClick={goToRegister}
            className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
          >
            Not a user ? Register{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
