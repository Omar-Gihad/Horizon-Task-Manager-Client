/* eslint-disable react/prop-types */
import {
  MdDashboard,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import clsx from "clsx";
import { assets } from "../assets/assets";

const linkData = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: <MdDashboard />,
  },
  {
    label: "Tasks",
    link: "tasks",
    icon: <FaTasks />,
  },
  {
    label: "Completed",
    link: "completed",
    icon: <MdTaskAlt />,
  },
  {
    label: "In Progress",
    link: "in-progress",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "To Do",
    link: "todo",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "Team",
    link: "team",
    icon: <FaUsers />,
  },
  {
    label: "Trash",
    link: "trashed",
    icon: <FaTrashAlt />,
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const location = useLocation();

  const path = location.pathname.split("/")[1];

  const sidebarLinks = user.data.user.isAdmin ? linkData : linkData.slice(0, 5);

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const NavLink = ({ el }) => {
    return (
      <Link
        to={el.link}
        onClick={closeSidebar}
        className={clsx(
          "flex gap-3 items-center w-full px-3 py-2 rounded-xl hover:bg-[#d0c2f3]",
          path === el.link.split("/")[0] ? "bg-[#6b43dd] text-neutral-100" : ""
        )}
      >
        {el.icon}
        <span className="hover:text-[#6b43dd]">{el.label}</span>
      </Link>
    );
  };
  return (
    <div className="w-full h-full flex flex-col gap-6 p-5">
      <img className="self-center w-[185px] p-2" src={assets.LogoH} alt="" />

      <div className="flex-1 flex flex-col gap-y-5 py-8">
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>

      {/* <div className="">
        <button className="w-full flex gap-2 p-2 items-center text-lg text-gray-800">
          <MdSettings />
          <span>Settings</span>
        </button>
      </div> */}
    </div>
  );
};

export default Sidebar;
