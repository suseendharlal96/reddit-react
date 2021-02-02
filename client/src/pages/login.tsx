import React, { useState } from "react";

import axios from "axios";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import CustomInput from "../components/CustomInput";
import { useAuthState, useAuthDispatch } from "../context/auth";
const Login = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [error, setError] = useState<any>({});
  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();
  if (authenticated) router.push("/");
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/signin", {
        username,
        password,
      });
      console.log(res.data)
      dispatch("LOGIN", res.data);
      router.back();
    } catch (error) {
      if (error && error.response && error.response.data) {
        setError(error.response.data);
      }
    }
  };
  return (
    <div className="flex bg-white">
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="w-40 h-screen bg-center bg-cover"
        style={{ backgroundImage: "url('/images/bricks.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Login</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy.
          </p>
          <form autoComplete="off" noValidate onSubmit={onSubmit}>
            <CustomInput
              type="text"
              placeholder="username/email"
              value={username}
              setValue={setUsername}
              error={error.username}
              className="mb-2"
            />
            <CustomInput
              type="password"
              placeholder="password"
              value={password}
              setValue={setPassword}
              error={error.password}
              className="mb-2"
            />
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border-blue-500 rounded cursor-pointer">
              Log in
            </button>
          </form>
          <small>
            New to Reddit?
            <Link href="/register">
              <a className="ml-1 font-bold text-blue-500 uppercase">Sign up</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
