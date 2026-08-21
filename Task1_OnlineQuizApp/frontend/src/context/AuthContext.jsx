import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminUsername, setAdminUsername] = useState(
    localStorage.getItem("adminUsername") || null
  );

  const loginAdmin = (token, username) => {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUsername", username);
    setAdminUsername(username);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    setAdminUsername(null);
  };

  const isAdminLoggedIn = Boolean(localStorage.getItem("adminToken"));

  return (
    <AuthContext.Provider value={{ adminUsername, isAdminLoggedIn, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
