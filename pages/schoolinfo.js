import { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { getSession } from "next-auth/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as z from "zod";

import {
  ExclamationTriangleIcon,
  
} from "@heroicons/react/24/outline";



import Alert from "../components/Alert";

import ImagePicker from "../components/ImagePicker";



export default function Home() {
  const schema = z.object({
    schoolname: z
      .string()
      .min(3, { message: "Min 3 characters" })
      .max(40, { message: "Max 40 characters" }),
    phone1: z
      .string()
      .min(1, { message: "Min 1 character" })
      .max(40, { message: "Max 40 characters" }),
    phone2: z
      .string()
      .min(1, { message: "Min 1 character" })
      .max(40, { message: "Max 40 characters" }),
    googleMaps_url: z.any(), // No validation
    email: z.string().email({ message: "Invalid Email" }),
    address: z.string().optional(), // or any validation you need
    description: z.string().optional(), // or any validation you need
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

 
  const deleteMsg = "Subject";

  const [openTimetable, setOpenTimetable] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const cancelButtonRef = useRef(null);

  //Alert button triggers
  const cancelTrigger = () => {
    setOpenAlert(false);
  };
  function confirmTrigger() {
    console.log("confirm");
    setOpenAlert(false);
  }
  const [validate, setValidate] = useState(false);

  const [iseditable, setiseditable] = useState({
    checkdata: false,
    editable_id: "asd233d3",
  });

  const [alertObj, setAlertObj] = useState({
    type: "header",
    title: "School Information is Successfully Updated",
    message: " asdsad.",
    confirmButton: {
      show: true,
      color: "green",
      text: "Confirm",
    },
    dismissButton: {
      show: false,
      color: "red",
      text: "Close",
    },
    icon: {
      show: false,
      color: "red",
      iconSelected: ExclamationTriangleIcon,
    },
    inputBox: {
      show: false,
      placeholder: deleteMsg,
      label: `Enter ${deleteMsg} to delete`,
      errorMessage: "Unable to delete",
    },
  });

  const [count, setCount] = useState(0);

  useEffect(() => {

    getschoolinfo();
  }, []);

  const getschoolinfo = async () => {
    const res = await fetch("/api/schoolinfoAPI", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    console.log("data", data);

    if (data.data !== "nodata") {
      var finalresult = data.data;

      setiseditable({
        ...iseditable,
        checkdata: true,
        editable_id: finalresult._id,
      });

      if ("logo" in data.data) {
        setImageObj({
          ...imageObj,
          imageUrl: data.data.logo,
        });
      }
      console.log("finalresult", finalresult);

      setValue("schoolname", finalresult.name);
      setValue("phone1", finalresult.phone1);
      setValue("phone2", finalresult.phone2);
      setValue("googleMaps_url", finalresult.googleMaps_url);
      setValue("email", finalresult.email);
      setValue("address", finalresult.address);
      setValue("description", finalresult.description);


    } else {
      setiseditable({
        ...iseditable,
        checkdata: false,
        editable_id: "",
      });
    }
  };

  const [imageObj, setImageObj] = useState({
    label: {
      show: true,
      text: "Select this image",
    },
    // imageUrl:
    //   "https://images.unsplash.com/photo-1570900808791-d530855f79e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNzc0MDZ8MHwxfHNlYXJjaHwzfHxhbGx8ZW58MHx8fHwxNjczMjcyMDc3&ixlib=rb-4.0.3&q=80&w=1080",
    imageUrl: "nodata",
    required: false,
    unsplash: {
      show: false,
      text: "Add Dude",
      icon: "BarsArrowUpIcon",
    },
    errorMessage: "Wont work",
  });

  const imageChanged = (action_type, image_url) => {
    console.log(action_type, image_url, "imageChanged");
    if (action_type == "delete") {
      setImageObj({
        ...imageObj,
        imageUrl: "nodata",
      });
    } else {
      setImageObj({
        ...imageObj,
        imageUrl: image_url,
      });
    }
  };

  const notify = (label) => toast(label);

  const onSubmit = async (submitData) => {
    var requesttype;
    if (iseditable.checkdata == true) {
      requesttype = "PUT";
      submitData._id = iseditable.editable_id;
    } else {
      requesttype = "POST";
    }

    if (imageObj.imageUrl == "nodata") {
      submitData.logo = "nodata";
    } else {
      submitData.logo = imageObj.imageUrl;
    }

    console.log("submitData school>>>>>", submitData);

    const res = await fetch("/api/schoolinfoAPI", {
      method: requesttype,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submitData),
    });
    //Await for data for any desirable next steps
    var data = await res.json();

    console.log("Data>>>>", data);

    if (data.errors) {
      // setErrMessage(data.errors[0].msg);
    } else {
      if (data.status == 422 || data.status == 400 || data.status == 500) {
        setErrMessage("Oops! Please try again");
      } else {

     

        notify("Your Information is Saved");
        window.location.href = "/"

      
      }
    }

 
  };

  return (
    <>
     

        <div className="max-w-full">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-2xl sm:text-5xl text-slate-500 font-extrabold border border-gray-50 rounded-lg px-2 py-2">
                School Information
              </h2>
              <p className="mt-1 text-xs text-gray-500 sm:text-xs md:max-w-3xl pl-3">
                aAdd School details for ex: School Name, Email Id, Address etc..
              </p>
            </div>
          </div>
<ToastContainer autoClose={3000} />

          <div className="mt-4 max-w-7xl bg-white md:px-2 px-2 md:py-3 py-3 md:rounded-2xl rounded-md">
            <ul role="list" className=" grid max-w-full" >
                <li className="flex flex-col gap-x-6 xl:flex-row md:items-top md:justify-center">

                    <div className="flex-auto">
                        <div >
                            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-1 gap-x-4 gap-y-4">
                               
                                        <div className="grid md:grid-cols-2 justify-center items-center grid-cols-1">
                                          <div>
                                            <div className="mt-2">
                                            <label
                                                htmlFor="schoolname"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Enter School Name *
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                type="text"
                                                {...register("schoolname", { required: true })}
                                                className={`appearance-none block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-400  sm:text-sm ${
                                                    errors.schoolname
                                                    ? "border-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                                    : "border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                                }`}
                                                />
                                            </div>
                                            {errors.schoolname && (
                                                <p className="mt-2 text-xs text-red-500">
                                                {errors.schoolname.message}
                                                </p>
                                            )}
                                            </div>

                                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                                                <div className="">
                                                <label
                                                    htmlFor="phone1"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Enter phone number 1 *
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                    type="text"
                                                    {...register("phone1", {
                                                        required: true,
                                                    })}
                                                    className={`appearance-none block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-400  sm:text-sm ${
                                                        errors.schoolname
                                                        ? "border-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                                        : "border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                                    }`}
                                                    />
                                                </div>
                                                {errors.phone1 && (
                                                    <p className="mt-2 text-xs text-red-500">
                                                    {errors.phone1.message}
                                                    </p>
                                                )}
                                                </div>

                                                <div className="">
                                                <label
                                                    htmlFor="phone2"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Enter phone number 2
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                    type="text"
                                                    {...register("phone2", {
                                                        required: true,
                                                    })}
                                                    className={`appearance-none block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-400  sm:text-sm ${
                                                        errors.schoolname
                                                        ? "border-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                                        : "border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                                    }`}
                                                    />
                                                </div>
                                                {errors.phone2 && (
                                                    <p className="mt-2 text-xs text-red-500">
                                                    {errors.phone2.message}
                                                    </p>
                                                )}
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                            <label
                                                htmlFor="googleMaps_url"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Enter Google Maps Url
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                type="text"
                                            
                                                {...register("googleMaps_url")}

                                                className={`appearance-none block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-400  sm:text-sm ${
                                                    errors.schoolname
                                                    ? "border-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                                    : "border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                                }`}
                                                />
                                            </div>
                                            {errors.googleMaps_url && (
                                                <p className="mt-2 text-xs text-red-500">
                                                {errors.googleMaps_url.message}
                                                </p>
                                            )}
                                            </div>

                                            <div className="mt-4">
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Enter email
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                type="text"
                                                {...register("email", {
                                                    required: true,
                                                })}
                                                className={`appearance-none block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-400  sm:text-sm ${
                                                    errors.schoolname
                                                    ? "border-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                                    : "border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                                }`}
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="mt-2 text-xs text-red-500">
                                                {errors.email.message}
                                                </p>
                                            )}
                                            </div>

                                            <div className="mt-4">
                                            <label
                                                htmlFor="address"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Enter address
                                            </label>
                                            <div className="mt-1">
                                                <textarea
                                                type="text"
                                              
                                                {...register("address")}
                                                className={`appearance-none block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-400  sm:text-sm ${
                                                    errors.schoolname
                                                    ? "border-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                                    : "border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                                }`}
                                                />
                                            </div>
                                            {errors.address && (
                                                <p className="mt-2 text-xs text-red-500">
                                                {errors.address.message}
                                                </p>
                                            )}
                                            </div>

                                            <div className="mt-4">
                                            <label
                                                htmlFor="description"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Enter description
                                            </label>
                                            <div className="mt-1">
                                                <textarea
                                                type="text"
                                                {...register("description")}
                                                className={`appearance-none block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-400  sm:text-sm ${
                                                    errors.schoolname
                                                    ? "border-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                                    : "border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                                }`}
                                                />
                                            </div>
                                            {errors.description && (
                                                <p className="mt-2 text-xs text-red-500">
                                                {errors.description.message}
                                                </p>
                                            )}
                                            </div>
                                          </div>
                                          <div className="mt-4 flex justify-center items-center">
                                            <ImagePicker
                                            delsize={`bigsquare`}
                                              size={`bigsquare`}
                                              data={imageObj}
                                              imageChanged={imageChanged}
                                            />
                                          </div>
                                        </div>
                                 
                                <div className="flex md:justify-start justify-center w-full mt-3">
                                  <button type="submit" className=" inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
                                  > Save Info
                                  </button>
                                </div>
                            </form>
                        </div>

                    </div>
                
                </li>
            </ul>
          </div>

          <div className="mx-auto lg:max-w-full py-4">

          </div>
        </div>
   

      <Alert
        openAlert={openAlert}
        cancelTrigger={cancelTrigger}
        data={alertObj}
        confirmTrigger={confirmTrigger}
      />
    </>
  );
}


export async function getServerSideProps(context) {
  const session = await getSession(context);

  console.log("session", session);
  

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

