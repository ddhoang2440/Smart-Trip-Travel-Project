// export default Login;
import {
  IconBowlChopsticks,
  IconBrandGoogle,
  IconPlanet,
} from "@tabler/icons-react";
import React, { useState } from "react";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getOTP, loginWithGoogle, resetPassword, signin, signup } from "../contexts/AuthRedux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
const Login = () => {
  const [stage, setStage] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState();
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

  const handleGetOTP = (e, email) => {
    e.preventDefault()
    if (!email) return;
      dispatch(getOTP({email}))
  }
  const handleResetPassword = (e, user) => {
    e.preventDefault()
    if (!user) return;
    dispatch(resetPassword(user));
  }

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
              <h1 className="text-3xl">Đăng nhập vào tài khoản của bạn</h1>
              <p className="text-gray-500">
                Tìm kiếm những nhà hàng thượng hạng
              </p>
              <button
                className=" py-2 px-4 btn btn-accent btn-soft rounded-sm hover:text-white"
                onClick={() => login()}
              >
                <IconBrandGoogle color="black" />{" "}
                <span>Tiếp tục với Google</span>
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
                    <label className="label">mật Khẩu</label>
                    <input
                      className="input w-full "
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex flex-row justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="checkbox" />
                        Nhớ mật khẩu ?
                      </div>
                      <p className="p" onClick={() => setStage("forgot")}>
                        Quên mật khẩu ?
                      </p>
                    </div>
                    <button
                      id="btn-login"
                      className="btn btn-warning text-white text-xl"
                      type="submit"
                    >
                      Đăng Nhập
                    </button>
                  </form>
                  <p className="flex justify-center pt-4 gap-2">
                    Chưa có tài khoản ?{" "}
                    <span
                      onClick={() => setStage("register")}
                      className="text-accent p"
                    >
                      {" "}
                      Tạo tài khoản mới
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
                    <label className="label">Tên đăng nhập</label>
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
                    <label className="label">Mật khẩu</label>
                    <input
                      className="input w-full "
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      minLength={8}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex flex-row justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="checkbox" />
                        Nhớ mật khẩu
                      </div>
                    </div>
                    <button className="btn btn-warning text-white text-xl">
                      Đăng Ký
                    </button>
                  </form>
                  <p className="flex justify-center pt-4 gap-2">
                    Đã có tài khoản?{" "}
                    <span
                      onClick={() => setStage("login")}
                      className="text-accent p"
                    >
                      Đăng nhập ngay
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
                    <label className="label">Mật Khẩu Mới</label>
                    <input
                      className="input w-full "
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      value={password}
                      minLength={8}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex justify-between">
                      <label className="label">Mã OTP</label>
                      <button
                        type="button"
                        onClick={(e) => handleGetOTP(e, email)}
                        className="hover:cursor-pointer text-sm text-red-500 underline"
                      >
                        Nhận Mã OTP
                      </button>
                    </div>
                    <input
                      className="input w-full "
                      type="number"
                      placeholder="Nhập OTP"
                      value={OTP}
                      minLength={6}
                      maxLength={6}
                      onChange={(e) => setOTP(e.target.value)}
                    />
                    <button className="btn btn-warning text-white" type="submit" onClick={(e) => handleResetPassword(e, { email, password, OTP})} >
                      Đặt Lại Mật Khẩu
                    </button>
                  </form>
                  <p className="flex justify-center pt-4 gap-2">
                    Đã có tài khoản ?{" "}
                    <span
                      onClick={() => setStage("login")}
                      className="text-accent p"
                    >
                      Đăng nhập ngay !
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
