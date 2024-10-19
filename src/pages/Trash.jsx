import clsx from "clsx";
import React, { useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import {
  useGetTasksQuery,
  useRestoreTaskMutation,
  useDeleteTaskMutation,
} from "../redux/slices/apiSlice";
import Title from "../components/Title";
import Button from "../components/Button";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import ConfirmatioDialog from "../components/Dialogs";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");

  // Fetch tasks using RTK Query
  const { data: tasksData, isLoading, error } = useGetTasksQuery();

  const [restoreTask] = useRestoreTaskMutation(); // Hook for restoring a single task
  const [deleteTask] = useDeleteTaskMutation();  // Hook for deleting a single task

  // Check loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load tasks.</div>;

  // Extract tasks from the fetched data
  const tasks = tasksData?.tasks || [];
  console.log("🚀 ~ Trash ~ tasks:", tasks);

  const restoreClick = (id) => {
    setSelected(id);
    setType("restore");
    setMsg("Do you want to restore the selected item?");
    setOpenDialog(true);
  };

  const deleteClick = (id) => {
    setSelected(id);
    setType("delete");
    setMsg("Do you want to permanently delete the selected item?");
    setOpenDialog(true);
  };

  const deleteRestoreHandler = async () => {
    if (type === "restore") {
      // Call the restoreTask mutation for the selected task
      await restoreTask(selected);
    } else if (type === "delete") {
      // Call the deleteTask mutation for the selected task
      await deleteTask(selected);
    }
    setOpenDialog(false); // Close the dialog after the operation
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-center md:text-left">
        <th className="p-2">Task Title</th>
        <th className="p-2">Priority</th>
        <th className="p-2">Stage</th>
        <th className="p-2">Modified</th>
        <th className="p-2">Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[item.stage])}
          />
          <p className="w-full line-clamp-2 text-base text-black flex-1">
            {item?.title}
          </p>
        </div>
      </td>

      <td className="py-2 px-2 capitalize">
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span className="">{item?.priority}</span>
        </div>
      </td>

      <td className="py-2 px-2 capitalize text-center md:text-start">
        {item?.stage}
      </td>
      <td className="py-2 text-sm">{new Date(item?.date).toDateString()}</td>

      <td className="py-2 flex gap-1 justify-center">
        <Button
          icon={<MdOutlineRestore className="text-xl text-gray-500" />}
          onClick={() => restoreClick(item._id)} // Trigger restoreClick
        />
        <Button
          icon={<MdDelete className="text-xl text-red-600" />}
          onClick={() => deleteClick(item._id)} // Trigger deleteClick
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Trashed Tasks" />
        </div>
        <div className="bg-white px-2 md:px-6 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {tasks
                  ?.filter((item) => item.isTrashed)
                  .map((item, id) => (
                    <TableRow key={id} item={item} />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={deleteRestoreHandler} // Call deleteRestoreHandler when confirmed
      />
    </>
  );
};

export default Trash;
