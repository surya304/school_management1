import React, { useState,useEffect } from 'react';
import "react-toastify/dist/ReactToastify.css";

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Bars4Icon,
  TrashIcon,
  PlusCircleIcon,
  PhoneArrowUpRightIcon,
} from "@heroicons/react/24/outline";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const ListSort = () => {
  const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}


const [winReady, setwinReady] = useState(false);


useEffect(() => {
  setwinReady(true);
}, []);

  const [list, setItems] = useState([
    { id: uid(), name: 'Apple' },
    { id: uid(), name: 'Banana' },
    { id: uid(), name: 'Orange' },
  ]);

  const handleOnDragEnd = (result) => {
  console.log("aa")
    if (!result.destination) return;
    const newItems = Array.from(list);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setItems(newItems);
  };

  return (
   <div>


    {winReady ?
    <DragDropContext onDragEnd={handleOnDragEnd}>
    <Droppable droppableId="characters21">
      {(provided) => (
        <ul
          className="characters21"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {list.map((detail, index) => {
            return (
              <Draggable
                key={detail.id}
                draggableId={detail.id.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                    <li
                ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps} // Make sure this is passed to the correct element
                    style={{
                      ...provided.draggableProps.style,
                      backgroundColor: snapshot.isDragging ? 'lightblue' : 'white'
                    }}
                  >
                    <div className="flex items-center space-x-4 justify-start w-full">
                      <Bars4Icon
                        className="block h-6 w-6 border-none text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="">
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                   
                          placeholder="New Label"
                          className="w-96 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                        />
                      </div>

                      <div
                 
                        className="cursor-pointer"
                      >
                        <a className="inline-flex items-center rounded-full border border-transparent bg-red-500 px-1 py-1 text-sm font-medium leading-5 text-white shadow-sm">
                        </a>
                      </div>
                    </div>
                  </li>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  </DragDropContext> :
  <div>sdasd</div>



        }
   </div>

  );
};

export default ListSort;