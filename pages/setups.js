import LayoutMini from "../components/LayoutMini"
import Category from "./category"
import { getSession } from "next-auth/react";

import Subjects from "./subjects"
import Classes from "./classes"
// import Teachers from "./teachers"
import Students from "./students"
// import Timetable from "./timetable"
import { useState, useEffect } from "react";


  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  export default function Setups() {
    const [currentTab, setCurrentTab] = useState("categories");

    const tabsarray = [
      { name: 'Categories', href: '#', current: currentTab === 'categories', id: 'categories' },
      { name: 'Subjects', href: '#', current: currentTab === 'subjects', id: 'subjects' },
      { name: 'Classes', href: '#', current: currentTab === 'classes', id: 'classes' },
      // { name: 'Teachers', href: '#', current: currentTab === 'teachers', id: 'teachers' },
      { name: 'Students', href: '#', current: currentTab === 'students', id: 'students' },
      // { name: 'Time Table', href: '#', current: currentTab === 'timetables', id: 'timetables' },
    ];
    const [tabs, setTabs] = useState(tabsarray);


    const changeTab = (tab) => {
      setCurrentTab(tab.id);
      setTabs((prevTabs) =>
        prevTabs.map((prevTab) =>
          prevTab.id === tab.id
            ? { ...prevTab, current: true }
            : { ...prevTab, current: false }
        )
      );
    };

    return (
      <LayoutMini>
        <div className="md:px-6 py-3">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              value={currentTab}
              onChange={(evt) => setCurrentTab(evt.target.value)}
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.name}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav
              className="max-w-3xl rounded-md flex space-x-4 justify-start items-center border border-gray-300 px-2 py-2"
              aria-label="Tabs"
            >
              {tabs.map((tab) => (
                <a
                  key={tab.id}
                  href={tab.href}
                  className={classNames(
                    tab.current ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700',
                    'rounded-md px-3 py-2 text-sm font-medium'
                  )}
                  onClick={() => changeTab(tab)}
                  aria-current={tab.current ? 'page' : undefined}
                >
                  {tab.name}
                </a>
              ))}
            </nav>
          </div>
        
          {currentTab === 'categories' && (
            <div>
              <Category />
            </div>
          )}
          {currentTab === 'subjects' && (
            <div>
              <Subjects />
            </div>
          )}
          {currentTab === 'classes' && (
            <div>
              <Classes />
            </div>
          )}
     
          {currentTab === 'students' && (
            <div>
              <Students />
            </div>
          )}
       
        </div>
      </LayoutMini>
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