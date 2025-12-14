// export default Login;
import {
  IconBowlChopsticks,
  IconBrandGoogle,
  IconPlanet,
} from "@tabler/icons-react";
import React, { useState } from "react";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle, signin, signup } from "../contexts/AuthRedux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
const Login = () => {
  const [stage, setStage] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const { islogin } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const handleSignin = (event) => {
    event.preventDefault();
    dispatch(signin({ email, password }));
  };
  const handleSignup = (event) => {
    event.preventDefault();
    dispatch(signup({ username, email, password }));
  };

  const handleGoogleSuccess = async (googleResponse) => {
    const accessToken = googleResponse.access_token;
    dispatch(loginWithGoogle({ accessToken }));
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (error) => console.error("Google Login Failed:", error),
    flow: "implicit",
    scope: "email profile",
  });

  useEffect(() => {
    if (islogin === true) {
      navigate("/");
    }
  }, [islogin, navigate]);

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
                <IconPlanet color="orange" size={56} />
                <p className="text-xl">
                  Golden<span className="text-warning">Plate</span>
                </p>
              </div>
              <h1 className="text-3xl">Login to your Account</h1>
              <p className="text-gray-500">
                See what is going on in world of Food
              </p>
              <button
                className=" py-2 px-4 bg-blue-500 text-white text-xl flex justify-center items-center gap-2 cursor-pointer hover:bg-blue-400 rounded-xl"
                onClick={() => login()}
              >
                <IconBrandGoogle color="white" />{" "}
                <span>Continue with Google</span>
              </button>
              {stage === "login" && (
                <>
                  <form
                    onSubmit={(e) => handleSignin(e)}
                    className="flex flex-col gap-3 w-full"
                  >
                    <div className="divider text-gray-500">
                      or Sign in with Email
                    </div>
                    <label className="label">Email</label>
                    <input
                      className="input w-full"
                      type="email"
                      placeholder="Nhập vào email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="label">Password</label>
                    <input
                      className="input w-full "
                      type="password"
                      placeholder="Nhập Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      className="btn btn-warning text-white text-xl"
                      type="submit"
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
                  <form
                    onSubmit={(e) => handleSignup(e)}
                    className="flex flex-col gap-3 w-full"
                  >
                    <div className="divider text-gray-500">
                      Register with your email
                    </div>
                    <label className="label">Username</label>
                    <input
                      className="input w-full"
                      type="text"
                      placeholder="Nhập tên"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <label className="label">Email</label>
                    <input
                      className="input w-full"
                      type="email"
                      placeholder="Nhập vào email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="label">Password</label>
                    <input
                      className="input w-full "
                      type="password"
                      placeholder="Nhập Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex flex-row justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="checkbox" />
                        Remember me
                      </div>
                    </div>
                    <button className="btn btn-warning text-white text-xl">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
