import React from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";

import moment from "moment";
import clsx from "clsx";
import { BGS, PRIOTITYSTYELS, TASK_TYPE } from "../../utils";
import UserInfo from "../../components/UserInfo";

const TaskTable = ({ tasks }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300 ">
      <tr className="text-black text-left">
        <th className="w-1/3 md:w-auto py-2">Task Title</th>
        <th className="w-1/3 md:w-auto px-3 py-2">Priority</th>
        <th className="w-1/3 md:w-auto py-2">Team</th>
        <th className="py-2 hidden md:block">Created</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className="border-b border-gray-300 text-gray-600 hover:bg-gray-300/10">
      <td className="py-2 w-1/3 md:w-auto">
        <div className="flex items-center gap-1 ">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
          />

          <p className="text-sm text-black flex-1 line-clamp-2">{task.title}</p>
        </div>
      </td>

      <td className="py-2 w-1/3 md:w-auto">
        <div className="flex gap-1 items-center px-3">
          <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
            {ICONS[task.priority]}
          </span>
          <span className="capitalize">{task.priority}</span>
        </div>
      </td>

      <td className="py-2 px-1 w-1/3 md:w-auto">
        <div className="flex">
          {task?.team.map((item, index) => (
            <div
              key={index}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[index]
              )}
            >
              <UserInfo user={item} />
            </div>
          ))}
        </div>
      </td>
      <td className="py-2 hidden md:block">
        <span className="text-base text-gray-600">
          {moment(task?.date).fromNow()}
        </span>
      </td>
    </tr>
  );
  return (
    <>
      <div className="w-full md:w-2/3 bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded">
        <table className="w-full">
          <TableHeader />
          <tbody>
            {tasks?.map((task, id) => (
              <TableRow key={id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TaskTable;
