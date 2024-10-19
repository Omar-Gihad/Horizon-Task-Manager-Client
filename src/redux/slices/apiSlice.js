import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const API_URI = "https://server-horizon.vercel.app/api";

const baseQuery = fetchBaseQuery({ baseUrl: API_URI });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Task"],
  endpoints: (builder) => ({
    // Authentication Endpoints
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    registerUser: builder.mutation({
      query: (user) => ({
        url: "/user/register",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    getUsers: builder.query({
      query: () => "/User/login",
      providesTags: ["User"],
    }),

    // Task Endpoints
    createTask: builder.mutation({
      query: (task) => ({
        url: "/task/create",
        method: "POST",
        body: task,
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
      invalidatesTags: ["Task"],
    }),
    //duplicate
    duplicateTask: builder.mutation({
      query: (taskId, task) => ({
        url: `/task/duplicate/${taskId}`,
        method: "POST",
        body: task,
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
      invalidatesTags: ["Task"],
    }),
    getTasks: builder.query({
      query: () => "/task",
      providesTags: ["Task"],
    }),

    updateTask: builder.mutation({
      query: ({ id, ...updatedTask }) => ({
        url: `/task/update/${id}`,
        method: "PUT",
        body: updatedTask,
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
      invalidatesTags: ["Task"],
    }),

    // Add subtask mutation here
    addSubTask: builder.mutation({
      query: ({ taskId, subtask }) => ({
        url: `/task/create-subtask/${taskId}`,
        method: "PUT",
        body: subtask,
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
      invalidatesTags: ["Task"],
    }),
    trashTask: builder.mutation({
      query: (id) => ({
        url: `/task/${id}`,
        method: "PUT",
        body: { isTrashed: true },
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
      invalidatesTags: ["Task"],
    }),
    //restore task
    restoreTask: builder.mutation({
      query: (id) => ({
        url: `/task/${id}`,
        method: "PUT",
        body: { isTrashed: false },
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
      invalidatesTags: ["Task"],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/task/delete/${id}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
  useCreateTaskMutation,
  useDuplicateTaskMutation,
  useGetTasksQuery,
  useGetUsersQuery,
  useUpdateTaskMutation,
  useAddSubTaskMutation,
  useTrashTaskMutation,
  useRestoreTaskMutation,
  useDeleteTaskMutation,
} = apiSlice;
