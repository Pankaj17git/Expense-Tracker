/* eslint-disable no-debugger */
import { Navigate } from "react-router";

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = user?.token;

  return isAuthenticated ? children : <Navigate to="/" />;
}

export default PrivateRoute;