import React, { useEffect, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/apiSlice";
import { toast } from "sonner";

const LISTS = ["TODO", "IN-PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, task, label }) => {
  // console.log("🚀 ~ AddTask ~ task:", task)
  const {
    register,
    handleSubmit,
    setValue,
    reset, // Added reset to reset form values
    formState: { errors },
  } = useForm();

  const [team, setTeam] = useState([]);
  const [stage, setStage] = useState(label || LISTS[0]);
  const [priority, setPriority] = useState(PRIORITY[2]);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Create and update task mutations
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  // Effect to set form values when editing a task
  useEffect(() => {
    if (task) {
      setValue("title", task?.title || "");
      setValue("date", task?.date?.split("T")[0] || "");
      setStage(task?.stage || LISTS[0]);
      setPriority(task?.priority || PRIORITY[2]);
      setTeam(task?.team || []);
    }
  }, [task, setValue]);

  const submitHandler = async (data) => {
    const taskData = {
      title: data.title,
      date: data.date,
      team,
      stage,
      priority,
      assets,
    };

    try {
      if (task) {
        // If editing, update the task
        await updateTask({ id: task._id, ...taskData }).unwrap();
        toast.success("Task updated successfully!");
      } else {
        // If creating a new task
        await createTask(taskData).unwrap();
        toast.success("Task added successfully!");
      }
      setOpen(false); // Close the modal on success

      // Reset form to initial values after submission
      reset(); // Resets form fields
      setTeam([]); // Resets team state
      setStage(LISTS[0]); // Resets stage to default
      setPriority(PRIORITY[2]); // Resets priority to default
      setAssets([]); // Clear assets
    } catch (error) {
      console.error("Failed to save task: ", error);
    }
  };

  const handleSelect = (e) => {
    setAssets(e.target.files); // Store selected files
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          {task ? "EDIT TASK" : "ADD TASK"}
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Task Title"
            type="text"
            name="title"
            label="Task Title"
            className="w-full rounded"
            register={register("title", { required: "Title is required" })}
            error={errors.title ? errors.title.message : ""}
          />

          <UserList setTeam={setTeam} team={team} />

          <div className="flex gap-4">
            <SelectList
              label="Task Stage"
              lists={LISTS}
              selected={stage}
              setSelected={setStage}
            />

            <div className="w-full">
              <Textbox
                placeholder="Date"
                type="date"
                name="date"
                label="Task Date"
                className="w-full rounded"
                register={register("date", { required: "Date is required!" })}
                error={errors.date ? errors.date.message : ""}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <SelectList
              label="Priority Level"
              lists={PRIORITY}
              selected={priority}
              setSelected={setPriority}
            />

            <div className="w-full flex items-center justify-center mt-4">
              <label
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                htmlFor="imgUpload"
              >
                {/* <input
                  type="file"
                  className="hidden"
                  id="imgUpload"
                  onChange={handleSelect}
                  accept=".jpg, .png, .jpeg"
                  multiple={true}
                />
                <BiImages />
                <span>Add Assets</span> */}
              </label>
            </div>
          </div>

          <div className=" py-6 sm:flex sm:flex-row-reverse gap-4">
            {(uploading || isCreating || isUpdating) && (
              <span className="text-sm py-2 text-red-500">
                Uploading Updates...
              </span>
            )}
            <Button
              label="Submit"
              type="submit"
              className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
            />

            <Button
              type="button"
              className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;
