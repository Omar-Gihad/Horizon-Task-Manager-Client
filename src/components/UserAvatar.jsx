import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils";
import { logout, changePassword } from "../redux/slices/authSlice";
import Modal from "./Modal"; // Import the Modal component

const UserAvatar = () => {
  const [openPassword, setOpenPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fullName = user?.data?.user?.name;

  const logoutHandler = async () => {
    try {
      await dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const changePasswordHandler = async (e) => {
    e.preventDefault();

    try {
      await dispatch(changePassword({ password:newPassword }));
      alert("Password changed successfully");
      setOpenPassword(false);
    } catch (error) {
      console.error("Password change failed:", error);
    }
  };

  return (
    <>
      <div>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="w-10 h-10 2xl:w-12 2xl:h-12 items-center justify-center rounded-full bg-[#6b43dd]">
              <span className="text-white font-semibold">
                {getInitials(fullName)}
              </span>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-gray-100 rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
              <div className="p-4">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpenPassword(true)}
                      className={`text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base`}
                    >
                      <FaUserLock className="mr-2" aria-hidden="true" />
                      Change Password
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logoutHandler}
                      className={`text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base`}
                    >
                      <IoLogOutOutline className="mr-2" aria-hidden="true" />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Modal for changing password */}
      <Modal isOpen={openPassword} onClose={() => setOpenPassword(false)}>
        <form onSubmit={changePasswordHandler} className="p-6">
          {/* <h2 className="text-xl font-semibold mb-4">New Password</h2> */}

          {error && <p className="text-red-500">{error}</p>}

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Enter New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#6b43dd] text-white rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default UserAvatar;
