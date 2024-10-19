/* This example requires Tailwind CSS v2.0+ */
import { useState, useEffect } from "react";
import LayoutMini from "../components/LayoutMini";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession } from "next-auth/react";
import * as z from "zod";
import { countriesList } from "../lib/genericData";

export default function Profile() {
  const [loader, setLoader] = useState(false);
  const notify = (label) => toast(label);
  const [profilePic, setProfilePic] = useState("");
  const [imgFile, setImgFile] = useState(undefined);
  const [errMessage, setErrMessage] = useState("");
  const cList = countriesList();
  const [selectedOption, setSelectedOption] = useState(cList[0].value);

  const phoneRegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  const schema = z.object({
    fname: z
      .string()
      .min(3, { message: "Min 3 characters" })
      .max(40, { message: "Max 40 characters" }),
    lname: z
      .string()
      .min(1, { message: "Min 1 character" })
      .max(40, { message: "Max 40 characters" }),
    email: z.string().email({ message: "Invalid Email" }),
    phone: z.union([
      z.string().regex(phoneRegExp, { message: "Invalid Phone Number regex" }),
      z.literal(""),
    ]),
    city: z.union([
      z.string().min(2, { message: "Min 2 characters" }),
      z.literal(""),
    ]),
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    getInfo();
  }, []);

  const [handleChange] = useState(() => {
    return () => {
      setSelectedCountry(selectedCountry);
    };
  });

  const getInfo = async () => {
    const res = await fetch("/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("userInfo Data>>>>", data);

    const userInfo = data.userInfo;

    if (userInfo) {
      setValue("fname", userInfo.first_name);
      setValue("lname", userInfo.last_name);
      setValue("email", userInfo.email);
      setValue("phone", userInfo.mobile);
      setValue("city", userInfo.city);

      // if (userInfo.hasOwnProperty("mobile")) {
      //   if (userInfo.mobile.length > 0) {
      //     let ctyCode = cList.filter(
      //       (e) => e.value == userInfo.mobile_country
      //     )[0];
      //     setSelectedOption(ctyCode.value);
      //   }
      // }
      if (userInfo.hasOwnProperty("mobile_country")) {
        if (userInfo.hasOwnProperty("mobile")) {
          if (userInfo.mobile.length > 0) {
            let ctyCode = cList.filter(
              (e) => e.value == userInfo.mobile_country
            )[0];
            setSelectedOption(ctyCode.value);
          }
        }
      }



      if (userInfo.hasOwnProperty("profile_pic")) {
        setProfilePic(userInfo.profile_pic);
        setImgFile(undefined);
      }
    }
  };

  const onSubmit = async (submitData) => {
    setErrMessage("");
    setLoader(true);

    console.log("Selected Country>>>>>", selectedOption);
    var formData = new FormData();

    let phoneCountry = "";

    if (submitData.phone.length > 0) {
      phoneCountry = selectedOption;
    }

    formData.append("fname", submitData.fname);
    formData.append("lname", submitData.lname);
    formData.append("phone", submitData.phone);
    formData.append("phone_country", phoneCountry);
    formData.append("city", submitData.city);

    if (imgFile) {
      formData.append("profile_pic", imgFile);
    }

    const res = await fetch("/api/profile", {
      method: "POST",
      body: formData,
    });
    //Await for data for any desirable next steps
    const data = await res.json();
    setLoader(false);
    console.log("Data>>>>", data);
    if (data.errors) {
      setErrMessage(data.errors[0].msg);
    } else {
      if (data.status == 422 || data.status == 400 || data.status == 500) {
        setErrMessage("Oops! Please try again");
      } else {
        notify("Profile Info Saved!!");
      }
    }
  };

  function fileChanged(event, type) {
    console.log(event.target.files);
    setImgFile(event.target.files[0]);

    setProfilePic(URL.createObjectURL(event.target.files[0]));
  }

  function dragover(event) {
    event.stopPropagation();
    event.preventDefault();

    // Add some visual fluff to show the user can drop its files
    if (!event.currentTarget.classList.contains("bg-indigo-600")) {
      event.currentTarget.classList.remove("bg-gray-800");
      event.currentTarget.classList.add("bg-indigo-600");
    }
  }

  function dragleave(event) {
    // Clean up
    console.log("dragleave>>>>>");
    event.currentTarget.classList.add("bg-gray-800");
    event.currentTarget.classList.remove("bg-indigo-600");
  }

  function drop(event) {
    console.log("drop>>>>>");

    event.preventDefault();
    setImgFile(event.dataTransfer.files[0]);
    setProfilePic(URL.createObjectURL(event.dataTransfer.files[0]));
    // media.value = event.dataTransfer.files[0];

    event.currentTarget.classList.add("bg-gray-800");
    event.currentTarget.classList.remove("bg-indigo-600");
  }

  return (
    <>
      <div>
        <LayoutMini>
          <ToastContainer autoClose={3000} />
          <div className="w-full h-screen bg-gray-50">
            <div className="flex flex-1 flex-col">
              <div className="relative ">
                <div className="relative mx-auto grid grid-cols-5 items-center py-8 px-8">
                  <div className="bg-white py-4 px-4 sm:px-2 lg:col-span-3 lg:py-14 lg:px-8 xl:pl-12 rounded-md shadow">
                    <div className="mx-auto max-w-lg lg:max-w-none">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                          <div>
                            <div className="mt-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="photo"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Profile Pic
                                </label>
                                <div className="mt-1 flex items-center">
                                  <div className="mt-2 w-56">
                                    {profilePic.length == 0 && (
                                      <div
                                        draggable
                                        onDragOver={dragover}
                                        onDragLeave={dragleave}
                                        onDrop={drop}
                                        // className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        className="bg-gray-800 mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white border-dashed rounded-md"
                                      >
                                        <div className="space-y-1 text-center">
                                          <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                          >
                                            <path
                                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            ></path>
                                          </svg>
                                          <div className="text-sm text-gray-600">
                                            <label
                                              htmlFor="file-upload"
                                              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                            >
                                              <span>Upload a file</span>
                                              <input
                                                id="file-upload"
                                                onChange={(evt) =>
                                                  fileChanged(
                                                    evt,
                                                    "profile_pic"
                                                  )
                                                }
                                                // name="file-upload"
                                                type="file"
                                                className="sr-only"
                                              />
                                            </label>
                                            <p className="pl-1">
                                              or drag and drop
                                            </p>
                                          </div>
                                          <p className="text-xs text-gray-500">
                                            PNG, JPG up to 2MB
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    {profilePic.length > 0 && (
                                      <div>
                                        <img src={profilePic} />

                                        <span className="mt-5 text-gray-700 text-sm">
                                          Change Image
                                        </span>
                                        <input
                                          className="cursor-pointer inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                          id="file-upload"
                                          placeholder="Change Image"
                                          onChange={(evt) =>
                                            fileChanged(evt, "profile_pic")
                                          }
                                          type="file"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="business-name"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Email
                                </label>
                                <div className="mt-1">
                                  <input
                                    {...register("email", {
                                      required: true,
                                    })}
                                    type="email"
                                    disabled
                                    className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400  sm:text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="email"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  First Name
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    {...register("fname", {
                                      required: true,
                                    })}
                                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400  sm:text-sm ${
                                      errors.fname
                                        ? "border-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    }`}
                                  />
                                </div>
                                {errors.fname && (
                                  <p className="mt-2 text-xs text-red-500">
                                    {errors.fname.message}
                                  </p>
                                )}
                              </div>

                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="full-name"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Last Name
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    {...register("lname", {
                                      required: true,
                                    })}
                                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400  sm:text-sm ${
                                      errors.lname
                                        ? "border-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    }`}
                                  />
                                </div>
                                {errors.lname && (
                                  <p className="mt-2 text-xs text-red-500">
                                    {errors.lname.message}
                                  </p>
                                )}
                              </div>

                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="email"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Phone
                                </label>
                                <div className="mt-1">
                                  <div className="relative mt-1 rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 flex items-center">
                                      <label
                                        htmlFor="country"
                                        className="sr-only"
                                      >
                                        Country
                                      </label>

                                      <select
                                        className="h-full rounded-md border-transparent bg-transparent py-0 pl-3 pr-5 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={selectedOption}
                                        onChange={(e) =>
                                          setSelectedOption(e.target.value)
                                        }
                                      >
                                        {cList.map((o) => (
                                          <option key={o.name} value={o.value}>
                                            {o.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <input
                                      {...register("phone")}
                                      className={`appearance-none block w-full pl-16 px-3 py-2 border rounded-md shadow-sm placeholder-gray-400  sm:text-sm ${
                                        errors.phone
                                          ? "border-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                          : "border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                      }`}
                                      placeholder="99666 99666"
                                    />
                                  </div>
                                </div>
                                {errors.phone && (
                                  <p className="mt-2 text-xs text-red-500">
                                    {errors.phone.message}
                                  </p>
                                )}
                              </div>

                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="full-name"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  City
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    {...register("city")}
                                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400  sm:text-sm ${
                                      errors.longitude
                                        ? "border-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    }`}
                                  />
                                </div>
                                {errors.city && (
                                  <p className="mt-2 text-xs text-red-500">
                                    {errors.city.message}
                                  </p>
                                )}
                              </div>
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
                                    <p className="text-sm text-red-500 ">
                                      {errMessage}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {loader == false && (
                          <button
                            type="submit"
                            className="mt-10 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Save Info
                          </button>
                        )}

                        {loader == true && (
                          <button
                            type="button"
                            className="mt-10 bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                            Saving...
                          </button>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LayoutMini>
      </div>
    </>
  );
}



export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
