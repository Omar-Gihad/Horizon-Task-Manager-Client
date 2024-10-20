import React from "react";
import { MdAdminPanelSettings } from "react-icons/md";
import { LuClipboardEdit } from "react-icons/lu";
import { FaNewspaper, FaUsers } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import clsx from "clsx";
import Chart from "../components/Chart";
import TaskTable from "../components/task/TaskTable";
import UserTable from "../components/task/UserTable";
import { useSelector } from "react-redux";
import { useGetTasksQuery, useGetUsersQuery } from "../redux/slices/apiSlice";
import { Loader } from "@mantine/core";
import Loading from "../components/Loader";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // Fetch tasks using RTK Query
  const {
    data: tasksData,
    isLoading: isLoadingTasks,
    error: tasksError,
  } = useGetTasksQuery();

  // Fetch users using RTK Query
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useGetUsersQuery();

  // Check loading and error states for tasks
  if (isLoadingTasks) return <Loading />;
  if (tasksError) return <div>Failed to load tasks.</div>;

  // Check loading and error states for users
  if (isLoadingUsers) return <Loading />;
  if (usersError) return <div>Failed to load users.</div>;

  // Extract tasks from the fetched data
  const tasks = tasksData?.tasks || [];
  const UnTrashedtasks = tasks.filter((item) => !item.isTrashed);

  // Calculate stats from tasks
  const totalTasks = UnTrashedtasks.length;
  const completedTasks = UnTrashedtasks.filter(
    (task) => task.stage === "completed"
  ).length;
  const tasksInProgress = UnTrashedtasks.filter(
    (task) => task.stage === "in-progress"
  ).length;
  const todos = UnTrashedtasks.filter((task) => task.stage === "todo").length;

  const stats = [
    {
      _id: "1",
      label: "TOTAL TASK",
      total: totalTasks,
      icon: <FaNewspaper />,
      bg: "bg-[#1d4ed8]",
    },
    {
      _id: "2",
      label: "COMPLETED TASK",
      total: completedTasks,
      icon: <MdAdminPanelSettings />,
      bg: "bg-[#0f766e]",
    },
    {
      _id: "3",
      label: "TASK IN PROGRESS",
      total: tasksInProgress,
      icon: <LuClipboardEdit />,
      bg: "bg-[#f59e0b]",
    },
    {
      _id: "4",
      label: "TODOS",
      total: todos,
      icon: <FaArrowsToDot />,
      bg: "bg-[#be185d]",
    },
  ];

  const Card = ({ label, count, bg, icon }) => (
    <div className="w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between">
      <div className="h-full flex flex-1 flex-col justify-between">
        <p className="text-base text-gray-600">{label}</p>
        <span className="text-2xl font-semibold">{count}</span>
        <span className="text-sm text-gray-400">{`${count} last month`}</span>
      </div>
      <div
        className={clsx(
          "w-10 h-10 rounded-full flex items-center justify-center text-white",
          bg
        )}
      >
        {icon}
      </div>
    </div>
  );

  return (
    <div className="h-full py-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {stats.map(({ icon, bg, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>

      <div className="w-full bg-white my-16 p-4 rounded shadow-sm">
        <h4 className="text-xl text-gray-600 font-semibold">
          Chart by Priority
        </h4>
        <Chart />
      </div>

      <div className="w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8">
        {/* Task Table */}
        <TaskTable tasks={UnTrashedtasks} />

        {/* User Table - Assuming you're fetching users elsewhere */}
        <UserTable users={usersData} />
      </div>
    </div>
  );
};

export default Dashboard;
