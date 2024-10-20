import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetTasksQuery } from "../redux/slices/apiSlice";
import Loading from "./Loader";

const Chart = () => {
  const { data: tasksData, isLoading, error } = useGetTasksQuery();

  // Check loading and error states
  if (isLoading) return <Loading/>;
  if (error) return <div>Failed to load tasks.</div>;

  // Extract tasks from the fetched data
  const tasks = tasksData?.tasks || [];
  console.log("🚀 ~ Tasks ~ tasks:", tasks);

  const UnTrashedtasks = tasks.filter((item) => !item.isTrashed);
  console.log("🚀 ~ Chart ~ UnTrashedtasks:", UnTrashedtasks);

  // Calculate total tasks for each priority (High, Medium, Normal)
  const highTasks = UnTrashedtasks.filter((task) => task.priority === "high");
  const mediumTasks = UnTrashedtasks.filter(
    (task) => task.priority === "medium"
  );
  const normalTasks = UnTrashedtasks.filter(
    (task) => task.priority === "normal"
  );

  const chartData = [
    {
      name: "High",
      total: highTasks.length,
      color: "#dc2626",
    },
    {
      name: "Medium",
      total: mediumTasks.length,
      color: "#ca8a04",
    },
    {
      name: "Normal",
      total: normalTasks.length,
      color: "#57534e",
    },
  ];

  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <BarChart width={150} height={40} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis
          domain={[
            1,
            Math.max(highTasks.length, mediumTasks.length, normalTasks.length)+1,
          ]}
        />{" "}
        {/* Set Y-Axis from 1 to 20 */}
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="total" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
