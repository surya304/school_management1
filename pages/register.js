import { useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  getProviders,
  signIn,
  getSession,
  // getCsrfToken,
} from "next-auth/react";

import { countriesList } from "../lib/genericData"


export default function Register({ providers }) {

  const router = useRouter();



  const cList = countriesList()

  const phoneRegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  const schema = z.object({
    firstName: z
      .string()
      .min(3, { message: "Min 3 characters" })
      .max(40, { message: "Max 40 characters" }),
    lastName: z
      .string()
      .min(1, { message: "Min 1 character" })
      .max(40, { message: "Max 40 characters" }),
    email: z.string().email({ message: "Invalid Email" }).min(6),
    password: z
      .string()
      .min(6, { message: "Min 6 characters" })
      .max(100, { message: "Max 100 characters" }),

  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
  });


  const [errMessage, setErrMessage] = useState("");
  const [loader, setLoader] = useState(false);


  const onSubmit = async (submitData) => {

    setErrMessage("");

    setErrMessage("")
    setLoader(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: submitData.firstName,
        last_name: submitData.lastName,
        email: submitData.email,
        password: submitData.password,
      }),
    });
    //Await for data for any desirable next steps
    const data = await res.json();
    console.log("Data>>>>", data);
    if (data.errors) {
      setErrMessage(data.errors[0].msg);
    }
    else {
      if (data.status == 403) {
        setLoader(false);
        setErrMessage(
          "You have already created an account. Login to continue."
        );
      } else if (
        data.status == 422 ||
        data.status == 400 ||
        data.status == 500
      ) {
        setLoader(false);
        setErrMessage("Oops! Please try again");
      } else {
        let email = submitData.email;
        let password = submitData.password;
        let options = {
          redirect: false,
          email: email,
          password: password,
        };
        const res2 = await signIn("credentials", options);

        if (res2.status == 401) {

setErrMessage("Invalid Credentials");

        } else {
          router.push("/schoolinfo");

        }
      }
    }

    setLoader(false)



  }




  return (
    <div className="bg-indigo-50 h-full min-h-screen">
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* <img
            className="mx-auto h-16 w-auto"
            src="logo.svg"
            alt="Smartsites Logo"
          /> */}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create New Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              className="font-medium text-indigo-600 hover:text-indigo-500"
              href="/login"
            >
              Already have an account? Log in
            </a>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      autoComplete="name"
                      {...register("firstName", {
                        required: true,
                      })}
                      className={`appearance-none block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-400  sm:text-sm ${errors.firstName
                          ? "border-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        }`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      autoComplete="name"
                      {...register("lastName", {
                        required: true,
                      })}
                      className={`appearance-none block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-400  sm:text-sm ${errors.lastName
                          ? "border-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        }`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    {...register("email", { required: true })}
                    className={`appearance-none block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-400  sm:text-sm ${errors.email
                        ? "border-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      {...register("password", { required: true })}
                      className={`appearance-none block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-400  sm:text-sm ${errors.password
                          ? "border-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        }`}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-xs text-red-500">
                      Min 6 characters, Max 100 characters
                    </p>
                  )}
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


              <div>
                {loader == false && (
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Account
                  </button>
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
                    Creating Account
                  </button>
                )}
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  // const csrfToken = await getCsrfToken({ req });
  const providers = await getProviders({ req });

  return {
    props: {
      providers: providers,
      // csrfToken: csrfToken,
    },
  };
}