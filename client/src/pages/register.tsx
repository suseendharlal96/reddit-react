import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import axios from "axios";

import CustomInput from "../components/CustomInput";
import { useAuthState } from "../context/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [agreement, setAgreement] = useState(false);
  const { authenticated } = useAuthState();
  const router = useRouter();
  if (authenticated) router.push("/");
  const [error, setError] = useState<any>({});
  const onSubmit = async (e) => {
    e.preventDefault();
    setError({});
    try {
      await axios.post("/auth/signup", {
        email,
        username,
        password,
      });
      router.push("/login");
    } catch (error) {
      // console.log(error.response.data);
      if (error && error.response && error.response.data) {
        setError(error.response.data);
      }
    }
  };
  return (
    <div className="flex bg-white dark:bg-black">
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="hidden w-40 h-screen bg-center bg-cover md:block"
        style={{ backgroundImage: "url('/images/bricks.jpg')" }}
      ></div>
      <div className="flex-col justify-center w-full pl-6 md:flex ">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium dark:text-gray-50">Sign up</h1>
          <p className="mb-10 text-xs dark:text-gray-50">
            By continuing, you agree to our User Agreement and Privacy Policy.
          </p>
          {/* {JSON.stringify(errors.email, null, 2)} */}
          <form autoComplete="off" noValidate onSubmit={onSubmit}>
            <div className="mb-6">
              <input
                id="agreement"
                type="checkbox"
                checked={agreement}
                onChange={() => setAgreement((prevState) => !prevState)}
                className="mr-1 cursor-pointer"
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer dark:text-gray-50">
                I agree to get emails about cool stuffs on Reddit.
              </label>
            </div>
            <CustomInput
              type="email"
              placeholder="Email"
              value={email}
              setValue={setEmail}
              error={error.email}
              className="mb-2 dark:text-gray-50"
            />
            <CustomInput
              type="text"
              placeholder="Username"
              value={username}
              setValue={setUsername}
              error={error.username}
              className="mb-2 dark:text-gray-50"
            />
            <CustomInput
              type="password"
              placeholder="Password"
              value={password}
              setValue={setPassword}
              error={error.password}
              className="mb-2 dark:text-gray-50"
            />
            <button
              disabled={!agreement}
              className={`w-full py-2 mb-4 text-xs font-bold rounded text-white uppercase
                ${
                  agreement
                    ? " bg-blue-500 border-blue-500 cursor-pointer"
                    : "bg-gray-500 border-gray-500  cursor-not-allowed"
                }
                  `}
            >
              Sign up
            </button>
          </form>
          <small className="dark:text-gray-50">
            Already a redditor?
            <Link href="/login">
              <a className="ml-1 font-bold text-blue-500 uppercase">Log in</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;
