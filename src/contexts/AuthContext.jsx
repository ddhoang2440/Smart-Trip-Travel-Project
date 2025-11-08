// // contexts/AuthContext.jsx
// import React, { createContext, useState, useContext, useEffect } from "react";

// // Tạo context
// const AuthContext = createContext();

// // Provider component - đặt tên rõ ràng và export default
// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuthStatus = () => {
//       try {
//         const savedUser = localStorage.getItem("user");
//         const isLoggedIn = localStorage.getItem("isLoggedIn");

//         if (isLoggedIn === "true" && savedUser) {
//           setUser(JSON.parse(savedUser));
//         }
//       } catch (error) {
//         console.error("Error checking auth status:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuthStatus();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const userData = await fakeLoginAPI(email, password);

//       setUser(userData);
//       localStorage.setItem("user", JSON.stringify(userData));
//       localStorage.setItem("isLoggedIn", "true");

//       return { success: true, user: userData };
//     } catch (error) {
//       return { success: false, error: error.message };
//     }
//   };

//   const register = async (username, email, password) => {
//     try {
//       const userData = await fakeRegisterAPI(username, email, password);

//       setUser(userData);
//       localStorage.setItem("user", JSON.stringify(userData));
//       localStorage.setItem("isLoggedIn", "true");

//       return { success: true, user: userData };
//     } catch (error) {
//       return { success: false, error: error.message };
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("isLoggedIn");
//   };

//   const value = {
//     user,
//     login,
//     register,
//     logout,
//     loading,
//     isAuthenticated: !!user,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // Hook sử dụng auth context
// const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// // Fake APIs
// const fakeLoginAPI = (email, password) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (email && password) {
//         resolve({
//           id: 1,
//           name: "Nguyễn Văn A",
//           email: email,
//           avatar: "/pizza.jpg",
//         });
//       } else {
//         reject(new Error("Email hoặc mật khẩu không hợp lệ"));
//       }
//     }, 1000);
//   });
// };

// const fakeRegisterAPI = (username, email, password) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (username && email && password) {
//         resolve({
//           id: Date.now(),
//           name: username,
//           email: email,
//           avatar: "/pizza.jpg",
//         });
//       } else {
//         reject(new Error("Vui lòng điền đầy đủ thông tin"));
//       }
//     }, 1000);
//   });
// };

// // Export named exports
// export { AuthProvider, useAuth };
