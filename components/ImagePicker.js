import { useState, useEffect, Fragment } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Transition, Dialog, Menu } from "@headlessui/react";
import { createApi } from "unsplash-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TrashIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function UploadImage({ size, data, imageChanged, delsize }) {

  const [imagePopup, setImagePopup] = useState(false);
  const [query, setQuery] = useState("all");
  const [loader, setLoader] = useState(false);
  const notify = (label) => toast(label);
  const [image, setImage] = useState('nodata');

  const [imageSize, setImageSize] = useState(size); // big-square big-rect small-rect
  const [delImageSize, setDelImageSize] = useState(delsize); // big-square big-rect small-rect
  //   const selectView;
  function handleQuery(query) {
    setQuery(query);
  }

  function addIcon(icon) {
    setImagePopup(true);
  }

  useEffect(() => {
    if (data.imageUrl !== 'nodata') {

      setImage(data.imageUrl);
    }

    if (size) {
      setImageSize(size);
    }
    if (delsize) {
      setDelImageSize(delsize);
    }
  }, [data.imageUrl, size]);

  // Unsplash code start

  const api = createApi({
    // See https://unsplash.com/developers
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_KEY,
  });

  function fileChanged(event) {
    console.log(event.target.files);
    // setImgFile(event.target.files[0]);
    // setImage(URL.createObjectURL(event.target.files[0]));
    // Upload Image
    uploadImage(event.target.files[0]);

  }

  const uploadImage = async (file) => {
    setLoader(true);

    var formData = new FormData();

    if (file) {
      console.log("Appended>>>>");
      formData.append("filedata", file);
    }

    try {
      const res = await fetch("/api/mediaUpload", {
        method: "PUT",
        body: formData,
      });
      //Await for data for any desirable next steps
      const data = await res.json();
      setLoader(false);
      console.log("Data>>>>", data);
      if (data.errors) {
        notify(data.errors[0].msg);
      } else {
        if (data.status == 422 || data.status == 400 || data.status == 500) {
          notify("Oops! Please try again");
        } else {
          // setImage(data.media);

          imageChanged("update", data.finalurl);
        }
      }
    } catch (error) {
      console.log("Image upload Failed>>>>>", error);
      setLoader(false);
    }
  };

  const delImage = async (id) => {
    var formData = new FormData();

    if (file) {
      console.log("Appended>>>>");
      formData.append("id", id);
    }

    try {
      const res = await fetch("/api/uploadMedia", {
        method: "DELETE",
        body: formData,
      });
      //Await for data for any desirable next steps
      const data = await res.json();
      console.log("Delete Image>>>>", data);
    } catch (error) {
      setLoader(false);
    }
  };

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
    // setImgFile(event.dataTransfer.files[0]);
    setImage(URL.createObjectURL(event.dataTransfer.files[0]));
    uploadImage(event.dataTransfer.files[0]);

    event.currentTarget.classList.add("bg-gray-800");
    event.currentTarget.classList.remove("bg-indigo-600");
  }

  const closeUnsplash = (img) => {
    imageChanged("update", img);
    setImagePopup(false);
  };

  const deleteImage = () => {
    imageChanged("delete", 'nodata');
    setImage('nodata');
    console.log("Delete Image>>>>>>");
  };

  function triggerClassName(type){

    if(type == 'small-round'){
  // const [imageSize, setImageSize] = useState("big-square"); // big-square big-rect small-rect
return "w-10 h-10 object-contain border border-gray-800 bg-gray-800 rounded-full";
    }else if(type == 'bigcircle'){

      return "w-40 h-40 object-contain border border-gray-800 bg-gray-800 rounded-full";

    }else if(type == 'bigsquare'){
      return "aspect-[5/5] sm:min-w-[450px] sm:max-w-[450px] md:min-w-[420px] md:max-w-[420px] flex-none rounded-2xl object-cover";
    }

  }

  function triggerDeleteClassName(type){

    if(type == 'bigsquare'){
  // const [imageSize, setImageSize] = useState("big-square"); // big-square big-rect small-rect
return "group-hover:block hidden absolute -top-4 -right-2 bg-slate-100 shadow-2xl rounded-full w-10 h-10 p-1 cursor-pointer text-red-500";
    }else{
      return "w-5 h-5 cursor-pointer text-gray-600"
    }

  }

  const Body = () => {
    const [data, setPhotosResponse] = useState(null);

    useEffect(() => {
      api.search
        .getPhotos({ query: query, page: 1, perPage: 20 })
        .then((result) => {
          console.log("Unspalsh Result>>>>", result);
          setPhotosResponse(result);
        })
        .catch(() => {
          console.log("something went wrong!");
        });
    }, []);

    if (data === null) {
      return <div>Loading...</div>;
    } else if (data.errors) {
      return (
        <div>
          <div>{data.errors[0]}</div>
          <div>PS: Make sure to set your access token!</div>
        </div>
      );
    } else {
      return (
        <div className="feed">
          <ul
            role="list"
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
          >
            {data.response.results.map((photo) => (
              <li key={photo.id} className="relative">
                <div className="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                  <img
                    onClick={() => closeUnsplash(photo.urls.regular)}
                    src={photo.urls.regular}
                    alt=""
                    className="cursor-pointer object-cover group-hover:opacity-75"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return (
    <>
      <div>
        <ToastContainer autoClose={3000} />
        {loader == true && (
          <button
            type="button"
            className=" bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
            Uploading Media....
          </button>
        )}

        {data.imageUrl == 'nodata'  && (
          <div className="flex space-x-4 items-center w-full justify-start">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-white text-sm py-2 text-base font-normal text-gray-500"
            >
              <div className="text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span className="flex text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4 justify-center"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    Upload Image
                  </span>
                  <input
                    id="file-upload"
                    onChange={(evt) => fileChanged(evt)}
                    type="file"
                    className="sr-only"
                  />
                </label>
              </div>
            </button>

            {data.unsplash.show == true && (
              <button
                onClick={() => addIcon("unsplash")}
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-white text-sm py-2  font-normal text-gray-500"
              >
                Free Images
              </button>
            )}
          </div>
        )}

        {data.imageUrl != 'nodata' && (
          <div className="group relative flex space-x-2 items-center w-full">
            <img
              src={data.imageUrl}
              className={triggerClassName(imageSize)}


            />


            <TrashIcon
              onClick={() => deleteImage()}
              className={triggerDeleteClassName(delImageSize)}
              // className=""
            />
          </div>
        )}

        <Transition.Root show={imagePopup} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setImagePopup}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:p-6">
                    <div>
                      {/* <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                    </div> */}
                      <div className="mt-3 text-left sm:mt-1">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Select Icons
                        </Dialog.Title>
                        <div className="mt-2">
                          <div className="border-t border-gray-200 px-4 pt-2 pb-4 sm:px-0">
                            <dl className="grid grid-cols-1 gap-x-2 gap-y-2 sm:grid-cols-1 justify-center text-left">
                              <div className="">
                                <input
                                  type="text"
                                  value={query}
                                  onChange={(e) => handleQuery(e.target.value)}
                                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                />
                              </div>

                              <div className="mt-2 w-full border border-gray-300 px-4 py-2 rounded-md h-96 overflow-y-auto">
                                <Body />
                              </div>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:text-sm"
                        onClick={() => setTablesModalOpen(false)}
                      >
                        Save
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </>
  );
}
