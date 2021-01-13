import { useState } from "react";

import { useForm } from "react-hook-form";
import classNames from "classnames";
import axios from "axios";

import Head from "next/head";
import Link from "next/link";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [agreement, setAgreement] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  console.log(errors);
  console.log({ agreement, email, username, password });
  const [error, setError] = useState<any>({});
  const onSubmit = async () => {
    try {
      const res = await axios.post("/auth/signup", {
        email,
        username,
        password,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error.response.data);
      setError(error.response.data);
    }
  };
  return (
    <div className="flex">
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="w-40 h-screen bg-center bg-cover"
        style={{ backgroundImage: "url('/images/bricks.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign up</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy.
          </p>
          {/* {JSON.stringify(errors.email, null, 2)} */}
          <form autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <input
                type="checkbox"
                checked={agreement}
                onChange={() => setAgreement((prevState) => !prevState)}
                className="mr-1 cursor-pointer"
                id="agreement"
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                I agree to get emails about cool stuffs on Reddit.
              </label>
            </div>
            <div className="mb-2">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={classNames(
                  "w-full p-3 transition duration-200 bg-gray-200 border border-gray-300 rounded outline-none hover:bg-white focus:bg-white",
                  { "border-red-500": errors.email || error.email }
                )}
                placeholder="Email"
                ref={register({
                  required: true,
                  pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                })}
              />
              {error.email && (
                <small className="font-medium text-red-600">
                  {error.email}
                </small>
              )}
              {errors.email && errors.email.type === "required" && (
                <small className="font-medium text-red-600">
                  {errors.email && "Must not be empty"}
                </small>
              )}
              {errors.email && errors.email.type === "pattern" && (
                <small className="font-medium text-red-600">
                  {errors.email && `${email} is not a valid email`}
                </small>
              )}
            </div>
            <div className="mb-2">
              <input
                autoComplete="off"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={classNames(
                  "w-full p-3 transition duration-200 bg-gray-200 border border-gray-300 rounded outline-none hover:bg-white focus:bg-white",
                  { "border-red-500": errors.username || error.username }
                )}
                placeholder="Username"
                ref={register({ required: true, minLength: 3 })}
              />
              {error.username && (
                <small className="font-medium text-red-600">
                  {error.username}
                </small>
              )}
              {errors.username && errors.username.type === "required" && (
                <small className="font-medium text-red-600">
                  {errors.username && "Must not be empty"}
                </small>
              )}
              {errors.username && errors.username.type === "minLength" && (
                <small className="font-medium text-red-600">
                  {errors.username && "Must be minimum 3 characters long"}
                </small>
              )}
            </div>
            <div className="mb-2">
              <input
                autoComplete="off"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={classNames(
                  "w-full p-3 transition duration-200 bg-gray-200 border border-gray-300 rounded outline-none hover:bg-white focus:bg-white",
                  { "border-red-500": errors.password || error.password }
                )}
                placeholder="Password"
                ref={register({ required: true, minLength: 6 })}
              />
              {error.password && (
                <small className="font-medium text-red-600">
                  {error.password}
                </small>
              )}
              {errors.password && errors.password.type === "required" && (
                <small className="font-medium text-red-600">
                  {errors.password && "Must not be empty"}
                </small>
              )}
              {errors.password && errors.password.type === "minLength" && (
                <small className="font-medium text-red-600">
                  {errors.password && "Must be minimum 6 characters long"}
                </small>
              )}
            </div>
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border-blue-500 rounded">
              Sign up
            </button>
          </form>
          <small>
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
