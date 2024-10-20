import React, { useState } from "react";
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
import { Loader } from "@mantine/core";
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
  // const [loading, setLoading] = useState(false);

  const status = params?.status || "";

  // Fetch tasks using RTK Query
  const { data: tasksData, isLoading, error } = useGetTasksQuery();

  // Check loading and error states
  if (isLoading) return <Loader color="#6b43dd" type="bars" />;
  if (error) return <div>Failed to load tasks.</div>;

  // Extract tasks from the fetched data
  const tasks = tasksData?.tasks || [];
  console.log("🚀 ~ Tasks ~ tasks:", tasks);

  const unTrashedTasks = tasks.filter((item) => !item.isTrashed);
  // .sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredTasks = unTrashedTasks.filter((el) => {
    if (status) {
      return el.stage == status;
    } else {
      return el;
    }
  });

  return isLoading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {!status && user.data.user.isAdmin && (
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-[#6b43dd] text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {/* <SortBy/> */}
        {!status && (
          <div className="w-full flex justify-between gap-4 py-4">
            <TaskTitle label="To Do" className={TASK_TYPE.todo} />
            <TaskTitle
              label="In Progress"
              className={TASK_TYPE["in-progress"]}
            />
            <TaskTitle label="Completed" className={TASK_TYPE.completed} />
          </div>
        )}

        {selected !== 1 ? (
          <BoardView tasks={filteredTasks} />
        ) : (
          <div className="w-full">
            <Table tasks={filteredTasks} />
          </div>
        )}
      </Tabs>

      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
