import React, { useState } from "react";
import { BiChevronDown, BiMessageAltDetail } from "react-icons/bi";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { toast } from "sonner";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../../utils";
import clsx from "clsx";
import { FaList } from "react-icons/fa";
import UserInfo from "../UserInfo";
import Button from "../Button";
import ConfirmatioDialog from "../Dialogs";
import { useSelector } from "react-redux";
import { useTrashTaskMutation } from "../../redux/slices/apiSlice";
import AddTask from "./AddTask";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ tasks, setValue }) => {
  const { user } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);

  const navigate = useNavigate();

  const selectedTask = tasks.find((item) => item._id == selected);
  console.log("🚀 ~ Table ~ selectedTask:", selectedTask);
  // Initialize the mutation
  const [trashTask] = useTrashTaskMutation();

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (id) => {
    setSelected(id);
    setOpenEdit(true);
  };

  const deleteHandler = async () => {
    const deletedTask = tasks.find((item) => item._id === selected);
    if (deletedTask) {
      try {
        // Update the task's isTrashed property to true
        await trashTask(selected);
        toast.success("Task moved to trash successfully!");
      } catch (error) {
        toast.error("Failed to move task to trash.");
        console.error("Error trashing task:", error);
      }
    }
    setOpenDialog(false);
  };

  const TableHeader = () => (
    <thead className=" w-full border-b border-gray-300">
      <tr className="w-fulltext-black text-center md:text-left">
        <th onClick={() => setValue("title")} className="py-2">
          <span className="flex items-center justify-center md:justify-start">
            Title
            <span className="ml-1">
              <BiChevronDown className="cursor-pointer" />
            </span>
          </span>
        </th>
        <th onClick={() => setValue("priority")} className="py-2">
          <span className="flex items-center justify-center md:justify-start">
            Priority
            <span className="ml-1 mr-2">
              <BiChevronDown className="cursor-pointer" />
            </span>
          </span>
        </th>
        <th onClick={() => setValue("date")} className="py-2">
          <span className="flex items-center justify-center md:justify-start">
            Deadline{/* Created */}
            <span className="ml-1">
              <BiChevronDown className="cursor-pointer" />
            </span>
          </span>
        </th>
        <th className="py-2 ">Assets</th>
        <th className="py-2">Team </th>
        <th className="py-2 ">Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
          />
          <p
            onClick={() => navigate(`/task/${task._id}`)}
            className={clsx(
              "w-full line-clamp-2 flex-1 text-base text-black cursor-pointer",
              `${task.stage == "todo" && "hover:text-blue-600"}
              ${task.stage == "completed" && "hover:text-green-600"}
              ${task.stage == "in-progress" && "hover:text-yellow-600"}`
            )}
          >
            {task?.title}
          </p>
        </div>
      </td>

      <td className="py-2">
        <div className={"flex gap-1 items-center px-5 md:px-0"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[task?.priority])}>
            {ICONS[task?.priority]}
          </span>
          <span className="capitalize hidden md:inline line-clamp-1">
            {task?.priority} Priority
          </span>
        </div>
      </td>

      <td className="py-2 pr-2">
        <span className="text-sm text-gray-600">
          {formatDate(new Date(task?.date))}
          {/* {moment(task?.date).fromNow()} */}
        </span>
      </td>

      <td className="py-2 pr-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-1 items-center text-sm text-gray-600">
            <BiMessageAltDetail />
            <span>{task?.activities?.length}</span>
          </div>
          <div className="flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400">
            <MdAttachFile />
            <span>{task?.assets?.length}</span>
          </div>
          <div className="flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400">
            <FaList />
            <span>0/{task?.subTasks?.length}</span>
          </div>
        </div>
      </td>

      <td className="py-2 px-4 md:px-0">
        <div className="flex">
          {task?.team?.map((m, index) => (
            <div
              key={m._id}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[index]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>

      <td className="py-2 flex gap-2 md:gap-4 justify-">
        {user.data.user.isAdmin && (
          <Button
            className="text-blue-600 hover:text-blue-500 font-semibold sm:px-1"
            label="Edit"
            type="button"
            onClick={() => editClick(task._id)}
          />
        )}
        {user.data.user.isAdmin && (
          <Button
            className="text-red-700 hover:text-red-500 sm:px-1 text-sm md:text-base"
            label="Delete"
            type="button"
            onClick={() => deleteClicks(task._id)}
          />
        )}
      </td>
    </tr>
  );

  return (
    <>
      <div className="bg-white px-1 md:px-4 pt-4 pb-9 shadow-md rounded">
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader />
            <tbody>
              {tasks.map((task, index) => (
                <TableRow key={index} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={selectedTask}
        key={new Date().getTime()}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default Table;
