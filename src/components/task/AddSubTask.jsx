import { useForm } from "react-hook-form";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import Button from "../Button";
import { useAddSubTaskMutation } from "../../redux/slices/apiSlice"; // Import the mutation hook
import { capitalize } from "../../utils";

const AddSubTask = ({ open, setOpen, id }) => {
  // console.log("🚀 ~ AddSubTask ~ id:", id)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Use the addSubTask mutation hook
  const [addSubTask, { isLoading }] = useAddSubTaskMutation();

  const handleOnSubmit = async (data) => {
    const subTaskData = {
      title: capitalize(data.title),
      date: data.date,
      tag: data.tag,
    };

    try {
      // Call the mutation to add the subtask
      await addSubTask({ taskId: id, subtask: subTaskData }).unwrap();
      setOpen(false); // Close the modal on success
      toast.success("Subtask added successfully!");
    } catch (error) {
      console.error("Failed to add subtask: ", error);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className="">
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          ADD SUB-TASK
        </Dialog.Title>
        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Sub-Task title"
            type="text"
            name="title"
            label="Title"
            className="w-full rounded"
            register={register("title", {
              required: "Title is required!",
            })}
            error={errors.title ? errors.title.message : ""}
          />

          <div className="flex items-center gap-4">
            <Textbox
              placeholder="Date"
              type="date"
              name="date"
              label="Task Date"
              className="w-full rounded"
              register={register("date", {
                required: "Date is required!",
              })}
              error={errors.date ? errors.date.message : ""}
            />
            <Textbox
              placeholder="Tag"
              type="text"
              name="tag"
              label="Tag"
              className="w-full rounded"
              register={register("tag", {
                required: "Tag is required!",
              })}
              error={errors.tag ? errors.tag.message : ""}
            />
          </div>
        </div>
        <div className="py-3 mt-4 flex sm:flex-row-reverse gap-4">
          <Button
            type="submit"
            className="bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto"
            label={isLoading ? "Adding..." : "Add Task"} // Show loading state
          />

          <Button
            type="button"
            className="bg-white border text-sm font-semibold text-gray-900 sm:w-auto"
            onClick={() => setOpen(false)}
            label="Cancel"
          />
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddSubTask;
