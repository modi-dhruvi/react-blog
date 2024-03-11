import React, { useContext } from "react";
import { AuthContext } from "../provider/AuthContext";

// const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}
