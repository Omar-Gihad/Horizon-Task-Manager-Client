import React, { useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { getInitials } from "../utils";
import clsx from "clsx";
import ConfirmatioDialog, { UserAction } from "../components/Dialogs";
import AddUser from "../components/AddUser";
import { useGetUsersQuery } from "../redux/slices/apiSlice";
import { Loader } from "@mantine/core";
import Loading from "../components/Loader";

<Loader color="#6b43dd" type="bars" />;

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);

  // Fetch tasks using RTK Query
  const { data: usersData, isLoading, error } = useGetUsersQuery();
  console.log("🚀 ~ Users ~ usersData:", usersData)

  // Check loading and error states
  if (isLoading) return <Loading />;
  if (error) return <div>Failed to load users.</div>;

  const userActionHandler = () => {};
  const deleteHandler = () => {};

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-center md:text-left">
        <th className="py-2">Full Name</th>
        <th className="py-2">Title</th>
        <th className="py-2">Email</th>
        <th className="py-2">Role</th>
        <th className="py-2">Active</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="p-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-[#6b43dd]">
            <span className="text-xs md:text-sm text-center p-5">
              {getInitials(user.name)}
            </span>
          </div>
          {user.name}
        </div>
      </td>

      <td className="p-2">{user.title}</td>
      <td className="p-2">{user.email || "user.emal.com"}</td>
      <td className="p-2">{user.role}</td>

      <td>
        <button
          // onClick={() => userStatusClick(user)}
          className={clsx(
            "w-fit px-4 py-1 rounded-full",
            user?.isActive ? "bg-green-200" : "bg-red-200"
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </button>
      </td>

      <td className="p-2 flex gap-4 justify-">
        {/* <Button
          className='text-blue-600 hover:text-blue-500 font-semibold sm:px-0'
          label='Edit'
          type='button'
          onClick={() => editClick(user)}
        /> */}

        {/* <Button
          className="text-red-700 hover:text-red-500 font-semibold sm:px-0"
          label="Delete"
          type="button"
          onClick={() => deleteClick(user?._id)}
        /> */}
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="  Team Members" />
          {/* <Button
            label="Add New User"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-[#6b43dd] text-white rounded-md 2xl:py-2.5"
            onClick={() => setOpen(true)}
          /> */}
        </div>

        <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {usersData?.map((user, index) => (
                  <TableRow key={index} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </>
  );
};

export default Users;
