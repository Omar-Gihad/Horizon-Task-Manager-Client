import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Textbox from "../components/Textbox";
import { IoLogoApple } from "react-icons/io5";
import { FaGoogle } from "react-icons/fa";
import { login } from "../redux/slices/authSlice.js"; // Import login action
import { assets } from "../assets/assets";

const Login = () => {
  const { user, isLoading, error } = useSelector((state) => state.auth); // Add loading and error states
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    // Dispatch login action
    dispatch(login(data))
      .unwrap()
      .then(() => {
        // Navigate after successful login
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("Login failed: ", err);
      });
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  console.log("🚀 ~ Login ~ user:", user);

  return (
    <div className="px-6 md:px-20 lg:px-40 py-6 flex flex-col lg:flex-row gap-6 min-h-screen">
      {/* Left section */}
      <div className="lg:basis-1/2 w-full flex flex-col px-6 md:px-12 lg:px-12 rounded-2xl justify-between">
        <img
          className="w-36 md:w-52 pt-6 md:pt-12"
          src={assets.LogoV}
          alt="Logo"
        />
        <div>
          <h1 className="font-bold text-2xl md:text-3xl pb-1">
            Login to Dashboard
          </h1>
          <p className="font-medium pb-6">Fill the below form to login</p>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <button className="flex gap-2 py-2 px-4 md:px-6 w-full md:w-auto border-2 rounded-md justify-center items-center hover:text-white hover:bg-[#6b43dd] transition-all duration-300">
              <FaGoogle size={22} />
              <p>Sign in with Google</p>
            </button>
            <button className="flex gap-2 py-2 px-4 md:px-6 w-full md:w-auto border-2 rounded-md justify-center items-center hover:text-white hover:bg-[#6b43dd] transition-all duration-300">
              <IoLogoApple size={24} />
              <p>Sign in with Apple</p>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-6">
          <hr className="flex-grow border-gray-300" />
          <p>OR</p>
          <hr className="flex-grow border-gray-300" />
        </div>

        <form
          className="flex flex-col gap-6 mt-4"
          onSubmit={handleSubmit(submitHandler)}
        >
          <Textbox
            placeholder="email@example.com"
            type="email"
            name="email"
            label="Email Address"
            className="w-full rounded-lg"
            register={register("email", {
              required: "Email Address is required!",
            })}
            error={errors.email ? errors.email.message : ""}
          />
          <Textbox
            placeholder="your password"
            type="password"
            name="password"
            label="Password"
            className="w-full rounded-lg"
            register={register("password", {
              required: "Password is required!",
            })}
            error={errors.password ? errors.password.message : ""}
          />
          <button className="font-bold text-[#6b43dd] hover:text-[#35148f] hover:underline">
            Forgot Password?
          </button>
          <button
            type="submit"
            className="mb-12 w-full bg-[#6b43dd] text-white font-semibold text-lg p-2 rounded-lg hover:bg-[#35148f] transition-all duration-300"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Show error message if login fails */}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Right section */}
      <div className="relative overflow-hidden hidden lg:flex lg:basis-1/2 bg-violet-100 rounded-2xl p-6 lg:p-12">
        <div className="flex flex-col gap-6">
          <div className="text-slate-600 border-2 border-slate-300 rounded-full inline-block p-3 bg-slate-100 shadow-md">
            <p className="text-sm font-medium">
              Manage all your tasks in one place
            </p>
          </div>
          <h2 className="text-black text-2xl md:text-3xl font-bold leading-relaxed">
            Manage your tasks and
            <br /> Operations
            <span className="text-[#6b43dd]"> more Professionally.</span>
          </h2>
        </div>
        <div className="overflow-hidden pl-12 absolute right-[-280px] bottom-[0px] z-0">
          <img
            className="blur-[2px] rounded-t-xl object-cover w-[3641px] h-auto shadow-md transition-all duration-1000 hover:blur-none "
            src={assets.LogDashImg}
            alt="Task Management Dashboard"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
