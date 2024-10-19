import { useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import axios from "axios"; // Import axios

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/forgotpwd', { email });
      setLoader(false);
      setInfoMessage(response.data.message || "If this email is registered, you will receive a password reset link.");
        } catch (error) {
      setLoader(false);
      setErrMessage(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
      <div className="bg-indigo-50 h-full min-h-screen">
        <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Forgot Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <a
                className="font-medium text-indigo-600 hover:text-indigo-500"
                href="/login"
              >
                Back to Login
              </a>
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {errMessage && (
                  <div className="mt-6">
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <ExclamationTriangleIcon className="w-5 h-5 current text-red-400" />
                        </div>
                        <div className="ml-1 flex-1 md:flex md:justify-between">
                          <p className="text-sm text-red-500 ">{errMessage}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {loader == false && (
                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Send Reset Link
                    </button>
                  </div>
                )}

{infoMessage && (
                  <div className="mt-6">
                    <div className="rounded-md bg-blue-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <ExclamationTriangleIcon className="w-5 h-5 current text-blue-400" />
                        </div>
                        <div className="ml-1 flex-1 md:flex md:justify-between">
                          <p className="text-sm text-blue-500 ">{infoMessage}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {loader == true && (
                  <button
                    type="button"
                    className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg
                      className="animate-spin ml-3 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}