import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import { setSearchValue } from "../redux/slices/searchSlice"; // Import the setSearchValue action
import UserAvatar from "./UserAvatar";
import NotificationPanel from "./NotificationPanel";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const location = useLocation();
  const path = location.pathname.split("/")[1];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    dispatch(setSearchValue(value)); // Dispatch the search value
  };

  return (
    <div className="flex justify-between items-center bg-white px-4 py-3 2xl:py-4 sticky z-10 top-0">
      <div className="flex gap-4">
        <button
          onClick={() => dispatch(setOpenSidebar(true))}
          className="text-2xl text-gray-500 block md:hidden"
        >
          ☰
        </button>

        {(path.includes("tasks") ||
          path.includes("todo") ||
          path.includes("in-progress") ||
          path.includes("completed")) && (
          <div className="w-64 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full bg-[#f3f4f6]">
            <MdOutlineSearch className="text-gray-500 text-xl" />

            <input
              type="text"
              placeholder="Search...."
              className="flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800"
              onChange={handleSearchChange} // Update the search value when typing
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <NotificationPanel />

        <UserAvatar />
      </div>
    </div>
  );
};

export default Navbar;
