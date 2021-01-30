import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import axios from "axios";

import RedditLogo from "../images/redditlogo.svg";
import { useAuthState, useAuthDispatch } from "../context/auth";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [subs, setSubs] = useState([]);

  const { authenticated, loading } = useAuthState();
  const dispatch = useAuthDispatch();
  const router = useRouter();

  const logout = async () => {
    await axios.get("/auth/logout");
    dispatch("LOGOUT");
    window.location.reload();
  };

  const searchSubs = async (value) => {
    setSearch(value);
    if (value.trim().length === 0) {
      setSubs([]);
      return;
    }
    try {
      const { data } = await axios.get(`/subs/search/${value}`);
      console.log(data);
      setSubs(data);
    } catch (error) {
      console.log(error);
    }
  };

  const navToSub = (route) => {
    router.push(`/r/${route}`);
    setSubs([]);
    setSearch("");
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white ">
      <div className="flex items-center">
        <Link href="/">
          <a>
            <RedditLogo className="w-8 h-8 mr-2" />
            {/* <RedditLogo /> */}
          </a>
        </Link>
        <span className="text-2xl font-semibold">
          <Link href="/">
            <a>reddit</a>
          </Link>
        </span>
      </div>
      <div className="relative flex items-center mx-auto bg-gray-100 border rounded focus:border-blue-400 focus:bg-white hover:border-blue-400 hover:bg-white">
        <i className="pl-4 mr-2 text-gray-500 fas fa-search"></i>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => searchSubs(e.target.value)}
          className="py-1 pr-3 bg-transparent rounded outline-none w-160"
        />
        <div
          className="absolute left-0 right-0 bg-white"
          style={{ top: "100%" }}
        >
          {subs?.map((sub) => (
            <div
              onClick={() => navToSub(sub.name)}
              className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
            >
              <Image
                className="rounded-full"
                src={sub.imageUrl}
                height={(8 * 16) / 4}
                width={(8 * 16) / 4}
              />
              <div className="ml-4 text-sm">
                <p className="font-medium">{sub.name}</p>
                <p className="text-gray-600">{sub.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex">
        {!loading &&
          (authenticated ? (
            <button
              onClick={logout}
              className="w-32 py-1 mr-5 leading-5 outlined blue button"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login">
                <a className="w-32 py-1 mr-5 leading-5 outlined blue button">
                  Log in
                </a>
              </Link>
              <Link href="/register">
                <a className="w-32 py-1 leading-5 blue button">Sign up</a>
              </Link>
            </>
          ))}
      </div>
    </div>
  );
};

export default Navbar;
