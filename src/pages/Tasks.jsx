import React, { useState, useEffect, useMemo } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";

import { useGetTasksQuery } from "../redux/slices/apiSlice";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import { useSelector } from "react-redux";
import SortBy from "../components/SortBy";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in-progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const { user } = useSelector((state) => state.auth);
  const params = useParams();

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("date");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const status = params?.status || "";

  const { value: searchValue } = useSelector((state) => state.search); // Accessing the search value from Redux state

  // Fetch tasks using RTK Query
  const { data: tasksData, isLoading, error } = useGetTasksQuery();

  // Memoize the tasks data to avoid triggering unnecessary re-renders
  const tasks = useMemo(() => tasksData?.tasks || [], [tasksData]);

  // Handle filtering and sorting tasks
  useEffect(() => {
    let unTrashedTasks = tasks.filter((item) => !item.isTrashed);

    // Filter tasks based on the search value
    if (searchValue) {
      unTrashedTasks = unTrashedTasks.filter((task) =>
        task.title.toLowerCase().includes(searchValue.trim().toLowerCase())
      );
    }

    // Filter tasks based on status from URL params
    if (status) {
      unTrashedTasks = unTrashedTasks.filter((el) => el.stage === status);
    }

    // Sort tasks based on selected value (Date, Priority, Title)
    if (value === "date") {
      unTrashedTasks = unTrashedTasks.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    } else if (value === "priority") {
      unTrashedTasks = unTrashedTasks.sort((a, b) =>
        a.priority.localeCompare(b.priority)
      );
    } else if (value === "title") {
      unTrashedTasks = unTrashedTasks.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    // Set the filtered and sorted tasks
    setFilteredTasks(unTrashedTasks);
  }, [tasks, status, value, searchValue]); // Added `searchValue` as a dependency

  if (isLoading) return <Loading />;
  if (error) return <div>Failed to load tasks.</div>;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {/* Only allow task creation if the user is an admin */}
        {!status && user.data.user.isAdmin && (
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="hidden md:flex flex-row-reverse gap-1 items-center bg-white text-black hover:text-[#6b43dd] rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 md:gap-0 md:flex-row md:justify-between md:items-center">
        <Tabs tabs={TABS} setSelected={setSelected}></Tabs>
        {selected === 0 && <SortBy value={value} setValue={setValue} />}
      </div>

      {!status && (
        <div className="w-full flex flex-col md:flex-row justify-between gap-4 md:gap-10 py-4">
          <TaskTitle label="To Do" className={TASK_TYPE.todo} />
          <TaskTitle label="In Progress" className={TASK_TYPE["in-progress"]} />
          <TaskTitle label="Completed" className={TASK_TYPE.completed} />
        </div>
      )}

      {/* Toggle between Board View and List View */}
      {selected !== 1 ? (
        <BoardView tasks={filteredTasks} />
      ) : (
        <div className="w-full">
          <Table tasks={filteredTasks} setValue={setValue} />
        </div>
      )}

      {/* Add Task Modal */}
      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
