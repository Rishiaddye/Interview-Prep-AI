import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(); 
export const UserProvider = ({ children }) => { const [user, setUser] = useState(null);
   // ✅ Load user on first load 
   useEffect(() => {
     const storedUser = localStorage.getItem("user"); if (storedUser) setUser(JSON.parse(storedUser)); }, []);
     
     // ✅ Login manually after successful login only
      const login = (userData) => { setUser(userData); localStorage.setItem("user", JSON.stringify(userData)); };
      
      // ✅ Logout clears storage 
      const logout = () => { setUser(null); localStorage.removeItem("user"); }; return ( <UserContext.Provider value={{ user, login, logout }}> {children} </UserContext.Provider> ); }; export const useUser = () => useContext(UserContext);