import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClientProvider } from "@tanstack/react-query";

import { router } from "./constant/Route.tsx";
import queryClient from "./constant/queryClient.ts";
import { UserProvider } from "./constant/UserProvider.tsx";
import { WebSocketProvider } from "./constant/SocketProvider.tsx";

const theme =
  localStorage.getItem("theme") === "light"
    ? "light"
    : "dark";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <WebSocketProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme={theme}
        />
      </WebSocketProvider>
    </UserProvider>
  </QueryClientProvider>
);