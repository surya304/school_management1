import { useState, useEffect } from "react";
import { ExclamationTriangleIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const router = useRouter();
  const { key } = router.query;
  console.log(key);

  const handleSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();

    if (password !== password2) {
      setLoader(false);
      setErrMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post('/api/auth/resetpwd', { password,password2, key });
      setLoader(false);
      if (response.data.success) {
        alert("Password reset successfully. Please login with your new password.");
        router.push('/login');
      } else {
        setErrMessage(response.data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      setLoader(false);
      setErrMessage(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowPassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  return (
    <div className="bg-indigo-50 h-full min-h-screen">
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Password
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
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="password2"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    type={showPassword2 ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword2}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showPassword2 ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
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

              {loader == false && (
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Reset Password
                  </button>
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
                  Resetting...
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}