import React from "react";
import "./app.scss";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext.jsx"; // ✅ fixed import

import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Gigs from "./pages/gigs/Gigs";
import Gig from "./pages/gig/Gig";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Add from "./pages/add/Add";
import Orders from "./pages/orders/Orders";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message";
import MyGigs from "./pages/myGigs/MyGigs";
import Pay from "./pages/pay/Pay";
import Success from "./pages/success/Success";
import ServiceProviders from "./pages/ServiceProviders/ServiceProviders";
import NotificationsPage from "./pages/NotificationsPage/NotificationsPage";

const queryClient = new QueryClient();

const Layout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <Outlet />
          <Footer />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "gigs", element: <Gigs /> },
      { path: "gig/:id", element: <Gig /> },
      { path: "myGigs", element: <MyGigs /> },
      { path: "orders", element: <Orders /> },
      { path: "messages", element: <Messages /> },
      { path: "messages/:id", element: <Message /> },
      { path: "add", element: <Add /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "pay/:id", element: <Pay /> },
      { path: "success", element: <Success /> },
      { path: "service-providers", element: <ServiceProviders /> },
      { path: "notifications", element: <NotificationsPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
