import { Fragment, useState, useEffect } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  InformationCircleIcon,
  XMarkIcon,
  HomeIcon,
 
  Bars3BottomLeftIcon,
  MagnifyingGlassIcon,

  BuildingStorefrontIcon,
  ListBulletIcon,
  AcademicCapIcon,
 
  CurrencyRupeeIcon,
  CheckIcon,
  UserGroupIcon, UserIcon

} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon, current: true },

  {
    name: 'Categories',
    href: '/category',
    icon: ListBulletIcon,
    current: false
  },
  {
    name: 'Subjects',
    href: '/subjects',
    icon: AcademicCapIcon,
    current: false
  },
  {
    name: 'Classes',
    href: '/classes',
    icon: UserGroupIcon,
    current: false
  },
  {
    name: 'Students',
    href: '/students',
    icon: UserIcon,
    current: false
  },
  { name: "Exams", href: "/exams", icon: AcademicCapIcon, current: false },
  {
    name: "Fees",
    href: "/feeStructure",
    icon: CurrencyRupeeIcon,
    current: false,
  },



];

const userNavigation = [
  { name: "Profile", href: "/parent/profile", goto: "profile" },
  { name: "Sign Out", href: "#", goto: "signout" },
];
const announcements = [
  {
    id: 1,
    title: 'Office closed on July 2nd',
    href: '#',
    notifColor: 'green',
    preview:
      'Cum qui rem deleniti. Suscipit in dolor veritatis sequi aut.',
  },
  {
    id: 2,
    title: 'New password policy',
    href: '#',
    notifColor: 'slate',
    preview:
      'Alias inventore ut autem optio voluptas et repellendus.',
  },
  {
    id: 3,
    title: 'Office closed on July 2nd',
    href: '#',
    notifColor: 'green',
    preview:
      'Tenetur libero voluptatem rerum occaecati qui est molestiae exercitationem.',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children }) {
  const router = useRouter();



  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  for (let i = 0; i < navigation.length; i++) {

    if (navigation[i].href == router.asPath)
    {
          navigation[i].current = true;
    }
    else
    {
          navigation[i].current = false;
    }

  }




  function dropdownClick(type) {


    console.log(type, "dropdownClick");

    if (type == "signout") {
      console.log("Sign Out CLICK");
  
      signOut({ callbackUrl: "/login" });

    } else {
      router.push("/" + type);
    }
  }

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-30 md:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex flex-shrink-0 items-center px-4">
                  <img
                    className="h-8 w-auto"
                    src="logo-white.svg"
                    alt="Your Company"
                  />
                </div>
                <div className="mt-5 h-0 flex-1 overflow-y-auto">
                  <nav className="space-y-1 px-2">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-gray-500"
                              : "text-gray-400 group-hover:text-gray-500",
                            "mr-4 flex-shrink-0 h-6 w-6"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ))}
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-28 md:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-gray-800">
          <div className="flex flex-shrink-0 items-center justify-center text-center">
           
            <h2 className="w-full h-auto text-xl sm:text-5xl text-white font-extrabold border border-gray-700 py-1">S</h2>
          </div>
          <div className="mt-2 flex flex-grow flex-col">
            <nav className="flex-1">
              {navigation.map((item) => (
              
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-indigo-500 text-white' : 'text-white hover:bg-gray-700 hover:text-white',
                    'group flex w-full flex-col items-center p-3 text-xs font-bold'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  <item.icon
                    className={classNames(
                      item.current ? 'text-white' : 'text-white group-hover:text-white',
                      'h-8 w-8'
                    )}
                    aria-hidden="true"
                  />
                  <span className="mt-1 text-xxxs w-full text-center">{item.name}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:pl-28">
        {showAlert == true && (
          <div className="rounded-md bg-blue-50 p-4 z-40">
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon
                  className="h-5 w-5 text-blue-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">
                  A new software update is available. See what’s new in version
                  2.0.4.
                </p>
                <p className="mt-3 text-sm md:mt-0 md:ml-6">
                  <a
                    href="#"
                    className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                  >
                    Details
                    <span aria-hidden="true"> &rarr;</span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
           
            </div>
            <div className=" flex items-center space-x-8">
          

              <Menu as="div" className="relative">
                <div>
                  {/* <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none">
                    <span className="sr-only">Open notifications</span>
                    <BellIcon className="relative h-8 rounded-full w-full text-slate-500 p-1 border border-slate-600" aria-hidden="true" />
                    <span className="bg-red-500 px-1.5 py-0.5 absolute -top-1.5 -right-1.5 rounded-full text-white text-xs">2</span>
                  </Menu.Button> */}
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-96 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <section aria-labelledby="announcements-title">
                  <div className="overflow-hidden">
                    <div className="p-3">
                      <h2 className="text-base font-medium text-gray-900" id="announcements-title">
                        Recent Notifications 🔔
                      </h2>
                      <div className="mt-4 flow-root">
                        <ul role="list" className="-my-2 divide-y divide-gray-200">
                          {announcements.map((announcement) => (
                            <li key={announcement.id} className={`py-2 `}>
                              <div className={`relative rounded-lg focus-within:ring-2 focus-within:ring-cyan-500 md:px-4 md:py-2  bg-${announcement.notifColor}-100`}>
                                <h3 className="text-sm font-semibold text-gray-800">
                                  <a href={announcement.href} className="hover:underline focus:outline-none">
                                    {/* Extend touch target to entire panel */}
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    {announcement.title}
                                  </a>
                                </h3>
                                <p className="mt-1 text-sm text-gray-600 line-clamp-2 font-thin w-4/4 break-all truncate">{announcement.preview}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-6 flex w-full items-center justify-between rounded-md bg-white text-xs md:px-2">
                            <span></span> <span className="underline text-slate-500">Read all</span>
                      </div>
                    </div>
                  </div>
                </section>
                  </Menu.Items>

                </Transition>
              </Menu>

              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none">
                    <span className="sr-only">Open user menu</span>
                    <UserIcon className="h-8 w-full rounded-full p-1 border border-slate-600 text-slate-500 hover:text-gray-500" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          // <a
                          //   onClick={() => dropdownClick(e, item.goto)}
                          //   className={classNames(
                          //     active ? "bg-gray-100" : "",
                          //     "cursor-pointer block px-4 py-2 text-sm text-gray-700"
                          //   )}
                          // >
                          //   {item.name} 
                          // </a>

                          <button
                          onClick={(event) => {
                            event.preventDefault();
                            dropdownClick(item.goto);
                          }}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "cursor-pointer block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          {item.name}
                        </button>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main>
          <div className="">
            <div className="max-w-full">
              {/* Replace with your content */}
              {children}
              {/* /End replace */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
