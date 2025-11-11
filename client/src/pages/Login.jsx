// // pages/Login.jsx
// import { IconBowlChopsticks, IconBrandGoogle } from "@tabler/icons-react";
// import React, { useState, useEffect } from "react";
// import Footer from "../components/Footer";
// // import { useAuth } from "../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [stage, setStage] = useState("login");
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // const { login, register, isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   // useEffect(() => {
//   //   if (isAuthenticated) {
//   //     navigate("/");
//   //   }
//   // }, [isAuthenticated, navigate]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // const handleLogin = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);
//   //   setError("");

//   //   const result = await login(formData.email, formData.password);

//   //   if (result.success) {
//   //     navigate("/");
//   //   } else {
//   //     setError(result.error);
//   //   }
//   //   setLoading(false);
//   // };

//   // const handleRegister = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);
//   //   setError("");

//   // const result = await register(
//   //   formData.username,
//   //   formData.email,
//   //   formData.password
//   // );

//   //   if (result.success) {
//   //     navigate("/");
//   //   } else {
//   //     setError(result.error);
//   //   }
//   //   setLoading(false);
//   // };

//   const handleForgotPassword = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     setTimeout(() => {
//       setError("Tính năng đang được phát triển");
//       setLoading(false);
//     }, 1000);
//   };

//   const resetForm = () => {
//     setFormData({
//       username: "",
//       email: "",
//       password: "",
//     });
//     setError("");
//   };

//   return (
//     <>
//       <div className="pt-[13vh] pb-[10vh] px-[8vw] bg-[rgb(255,230,201)]">
//         <div className="w-full py-8 flex items-center justify-center bg-white px-8 rounded-2xl">
//           <div className="flex flex-row gap-18">
//             <div className="w-1/2 h-full">
//               <img
//                 className="object-cover rounded-2xl"
//                 src="/loginpage2.jpeg"
//                 alt="Login"
//               />
//             </div>
//             <div className="flex flex-col gap-4 px-16 py-4 w-[30vw] justify-center">
//               <div className="flex items-center gap-2">
//                 <IconBowlChopsticks color="orange" size={56} />
//                 <p className="text-xl">
//                   Food<span className="text-warning">Tuck</span>
//                 </p>
//               </div>
//               <h1 className="text-3xl">
//                 {stage === "login" && "Login to your Account"}
//                 {stage === "register" && "Create New Account"}
//                 {stage === "forgot" && "Reset Your Password"}
//               </h1>
//               <p className="text-gray-500">
//                 {stage === "login" && "See what is going on in world of Food"}
//                 {stage === "register" && "Join our food community today"}
//                 {stage === "forgot" && "Enter your email to reset password"}
//               </p>

//               <button className="btn btn-accent text-white">
//                 <IconBrandGoogle color="white" /> Continue with Google
//               </button>

//               {error && (
//                 <div className="alert alert-error">
//                   <span>{error}</span>
//                 </div>
//               )}

//               {stage === "login" && (
//                 <>
//                   <form
//                     className="flex flex-col gap-3 w-full"
//                     onSubmit={handleLogin}
//                   >
//                     <div className="divider text-gray-500">
//                       or Sign in with Email
//                     </div>
//                     <label className="label">Email</label>
//                     <input
//                       className="input w-full"
//                       type="email"
//                       name="email"
//                       placeholder="mail@abc.com"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       required
//                     />
//                     <label className="label">Password</label>
//                     <input
//                       className="input w-full"
//                       type="password"
//                       name="password"
//                       placeholder="************"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       required
//                     />
//                     <div className="flex flex-row justify-between gap-2">
//                       <div className="flex items-center gap-2">
//                         <input type="checkbox" className="checkbox" />
//                         Remember me
//                       </div>
//                       <p
//                         className="p cursor-pointer"
//                         onClick={() => {
//                           setStage("forgot");
//                           resetForm();
//                         }}
//                       >
//                         Forgot Password ?
//                       </p>
//                     </div>
//                     <button
//                       type="submit"
//                       className="btn btn-warning text-white"
//                       disabled={loading}
//                     >
//                       {loading ? "Đang đăng nhập..." : "Login"}
//                     </button>
//                   </form>
//                   <p className="flex justify-center pt-4 gap-2">
//                     Not register Yet?{" "}
//                     <span
//                       onClick={() => {
//                         setStage("register");
//                         resetForm();
//                       }}
//                       className="text-accent p cursor-pointer"
//                     >
//                       Create an account
//                     </span>
//                   </p>
//                 </>
//               )}

//               {stage === "register" && (
//                 <>
//                   <form
//                     className="flex flex-col gap-3 w-full"
//                     onSubmit={handleRegister}
//                   >
//                     <div className="divider text-gray-500">
//                       Register with your email
//                     </div>
//                     <label className="label">Username</label>
//                     <input
//                       className="input w-full"
//                       type="text"
//                       name="username"
//                       placeholder="duy242"
//                       value={formData.username}
//                       onChange={handleInputChange}
//                       required
//                     />
//                     <label className="label">Email</label>
//                     <input
//                       className="input w-full"
//                       type="email"
//                       name="email"
//                       placeholder="mail@abc.com"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       required
//                     />
//                     <label className="label">Password</label>
//                     <input
//                       className="input w-full"
//                       type="password"
//                       name="password"
//                       placeholder="************"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       required
//                     />
//                     <div className="flex flex-row justify-between gap-2">
//                       <div className="flex items-center gap-2">
//                         <input type="checkbox" className="checkbox" required />I
//                         agree to Terms & Conditions
//                       </div>
//                     </div>
//                     <button
//                       type="submit"
//                       className="btn btn-warning text-white"
//                       disabled={loading}
//                     >
//                       {loading ? "Đang đăng ký..." : "Register"}
//                     </button>
//                   </form>
//                   <p className="flex justify-center pt-4 gap-2">
//                     Already has an account ?{" "}
//                     <span
//                       onClick={() => {
//                         setStage("login");
//                         resetForm();
//                       }}
//                       className="text-accent p cursor-pointer"
//                     >
//                       Back to Login
//                     </span>
//                   </p>
//                 </>
//               )}

//               {stage === "forgot" && (
//                 <>
//                   <form
//                     className="flex flex-col gap-3 w-full"
//                     onSubmit={handleForgotPassword}
//                   >
//                     <div className="divider text-gray-500">Forgot Password</div>
//                     <label className="label">Email</label>
//                     <input
//                       className="input w-full"
//                       type="email"
//                       name="email"
//                       placeholder="mail@abc.com"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       required
//                     />
//                     <button
//                       type="submit"
//                       className="btn btn-warning text-white"
//                       disabled={loading}
//                     >
//                       {loading ? "Đang xử lý..." : "Reset Password"}
//                     </button>
//                   </form>
//                   <p className="flex justify-center pt-4 gap-2">
//                     Remember your password?{" "}
//                     <span
//                       onClick={() => {
//                         setStage("login");
//                         resetForm();
//                       }}
//                       className="text-accent p cursor-pointer"
//                     >
//                       Back to Login
//                     </span>
//                   </p>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Login;
import { IconBowlChopsticks, IconBrandGoogle } from "@tabler/icons-react";
import React, { useState } from "react";
import Footer from "../components/Footer";

const Login = () => {
  const [stage, setStage] = useState("login");

  return (
    <>
      <div className="pt-[16vh] lg:pt-[13vh] pb-[10vh] px-[8vw] bg-[rgb(255,230,201)]">
        <div className="w-full py-8  flex items-center  lg:justify-between bg-white px-8  rounded-2xl">
          <div className="flex flex-col lg:flex-row lg:gap-18 lg:w-auto w-full ">
            <div className="hidden lg:block w-1/2 h-[74vh]">
              <img
                className="hidden lg:block object-cover w-[60vw] h-[74vh] rounded-2xl"
                src="/loginpage2.jpeg"
                alt=""
              />
            </div>
            <div className=" flex flex-col gap-4 lg:px-16 py-4 lg:w-[32vw] justify-center">
              <div className="flex items-center gap-2">
                <IconBowlChopsticks color="orange" size={56} />
                <p className="text-xl">
                  Food<span className="text-warning">Tuck</span>
                </p>
              </div>
              <h1 className="text-3xl">Login to your Account</h1>
              <p className="text-gray-500">
                See what is going on in world of Food
              </p>
              <button className="btn btn-accent text-white">
                <IconBrandGoogle color="white" /> Continue with Google
              </button>
              {stage === "login" && (
                <>
                  <form className="flex flex-col gap-3 w-full">
                    <div className="divider text-gray-500">
                      or Sign in with Email
                    </div>
                    <label className="label">Email</label>
                    <input
                      className="input w-full"
                      type="email"
                      placeholder="mail@abc.com"
                    />
                    <label className="label">Password</label>
                    <input
                      className="input w-full "
                      type="password"
                      placeholder="************"
                    />
                    <div className="flex flex-row justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="checkbox" />
                        Remember me
                      </div>
                      <p className="p" onClick={() => setStage("forgot")}>
                        Forgot Password ?
                      </p>
                    </div>
                    <button
                      id="btn-login"
                      className="btn btn-warning text-white"
                    >
                      Login
                    </button>
                  </form>
                  <p className="flex justify-center pt-4 gap-2">
                    Not register Yet?{" "}
                    <span
                      onClick={() => setStage("register")}
                      className="text-accent p"
                    >
                      {" "}
                      Create an account
                    </span>{" "}
                  </p>
                </>
              )}
              {stage === "register" && (
                <>
                  <form className="flex flex-col gap-3 w-full">
                    <div className="divider text-gray-500">
                      Register with your email
                    </div>
                    <label className="label">Username</label>
                    <input
                      className="input w-full"
                      type="text"
                      placeholder="duy242"
                    />
                    <label className="label">Email</label>
                    <input
                      className="input w-full"
                      type="email"
                      placeholder="mail@abc.com"
                    />
                    <label className="label">Password</label>
                    <input
                      className="input w-full "
                      type="password"
                      placeholder="************8"
                    />
                    <div className="flex flex-row justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="checkbox" />
                        Remember me
                      </div>
                    </div>
                    <button className="btn btn-warning text-white">
                      Register
                    </button>
                  </form>
                  <p className="flex justify-center pt-4 gap-2">
                    Already has an account ?{" "}
                    <span
                      onClick={() => setStage("login")}
                      className="text-accent p"
                    >
                      Back to Login
                    </span>
                  </p>
                </>
              )}
              {stage === "forgot" && (
                <>
                  <form className="flex flex-col gap-3 w-full">
                    <div className="divider text-gray-500">Forgot Pass</div>
                    <label className="label">Email</label>
                    <input
                      className="input w-full"
                      type="email"
                      placeholder="mail@abc.com"
                    />
                    <button className="btn btn-warning text-white">
                      Forgot
                    </button>
                  </form>
                  <p className="flex justify-center pt-4 gap-2">
                    Already has an account ?{" "}
                    <span
                      onClick={() => setStage("login")}
                      className="text-accent p"
                    >
                      Back to Login
                    </span>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
