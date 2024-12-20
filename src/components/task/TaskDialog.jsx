import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { HiDuplicate } from "react-icons/hi";
import { MdAdd, MdOutlineEdit, MdTaskAlt } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Menu, Transition } from "@headlessui/react";
import AddTask from "./AddTask";
import AddSubTask from "./AddSubTask";
import ConfirmatioDialog from "../Dialogs";
import {
  useDuplicateTaskMutation,
  useTrashTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/apiSlice";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const TaskDialog = ({ task }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  // Use the duplicate task mutation hook
  const [duplicateTask] = useDuplicateTaskMutation();

  const duplicateHandler = async () => {
    try {
      await duplicateTask(task._id, {
        ...task,
        title: `${task.title} (Copy)`,
      }).unwrap();
      // Optionally, you can show a success notification or handle UI updates here
      toast.success("Task duplicated successfully!");
    } catch (error) {
      // Handle the error (e.g., show an error notification)
      console.error("Failed to duplicate task:", error);
    }
  };

  // Initialize the mutation
  const [trashTask] = useTrashTaskMutation();

  const deleteClicks = (id) => {
    setOpenDialog(true);
  };

  const deleteHandler = async () => {
    const deletedTask = task._id;
    if (deletedTask) {
      try {
        // Update the task's isTrashed property to true
        await trashTask(task._id);
        toast.success("Task moved to trash successfully!");
      } catch (error) {
        toast.error("Failed to move task to trash.");
        console.error("Error trashing task:", error);
      }
    }
    setOpenDialog(false);
  };

  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const completeHandler = async () => {
    const updatedTask = { ...task, stage: "completed" };
    try {
      if (task.stage != "completed") {
        // Update the task's isTrashed property to true
        await updateTask({ id: task._id, ...updatedTask }).unwrap();
        toast.success("Task status updated!");
      }
    } catch (error) {
      toast.error("Failed to update Task status.");
      console.error("Error updating Task status:", error);
    }

    setOpenDialog(false);
  };

  const items = [
    // {
    //   label: "Open Task",
    //   icon: <AiTwotoneFolderOpen className="mr-2 h-5 w-5" aria-hidden="true" />,
    //   onClick: () => navigate(`/task/${task._id}`),
    // },
    {
      label: "Edit",
      icon: <MdOutlineEdit className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => setOpenEdit(true),
    },
    // {
    //   label: "Add Sub-Task",
    //   icon: <MdAdd className="mr-2 h-5 w-5" aria-hidden="true" />,
    //   onClick: () => setOpen(true),
    // },
    {
      label: "Duplicate",
      icon: <HiDuplicate className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => duplicateHandler(),
    },
  ];

  return (
    <>
      <div>
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-600 ">
            <BsThreeDots />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute p-4 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-1 py-1 space-y-2">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate(`/task/${task._id}`)}
                      className={`${
                        active ? "bg-[#6b43dd] text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <AiTwotoneFolderOpen
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                      Open Task
                    </button>
                  )}
                </Menu.Item>

                {user.data.user.isAdmin &&
                  items.map((el) => (
                    <Menu.Item key={el.label}>
                      {({ active }) => (
                        <button
                          onClick={el?.onClick}
                          className={`${
                            active ? "bg-[#6b43dd] text-white" : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          {el.icon}
                          {el.label}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
              </div>

              <div
                className={`${
                  task.stage == "completed" && "hidden"
                } px-1 py-1 space-y-2`}
              >
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => completeHandler()}
                      className={`${
                        active ? "bg-[#6b43dd] text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <MdTaskAlt className="mr-2 h-5 w-5" aria-hidden="true" />
                      Mark as complete
                    </button>
                  )}
                </Menu.Item>
              </div>

              {user.data.user.isAdmin && (
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => deleteClicks(task._id)}
                        className={`${
                          active ? "bg-[#6b43dd] text-white" : "text-red-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <RiDeleteBin6Line
                          className="mr-2 h-5 w-5 text-red-400"
                          aria-hidden="true"
                        />
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </div>
              )}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={task}
        key={new Date().getTime()}
      />

      <AddSubTask open={open} setOpen={setOpen} />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default TaskDialog;
