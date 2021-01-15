import Link from "next/link";
import Image from "next/image";

import RedditLogo from '../images/redditlogo.svg'

const Navbar = () => {
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
      <div className="flex items-center mx-auto bg-gray-100 border rounded focus:border-blue-400 focus:bg-white hover:border-blue-400 hover:bg-white">
        <i className="pl-4 mr-2 text-gray-500 fas fa-search"></i>
        <input
          type="text"
          placeholder="Search"
          className="py-1 pr-3 bg-transparent rounded outline-none w-160"
        />
      </div>
      <div className="flex">
        <Link href="/login">
          <a className="w-32 py-1 mr-5 leading-5 outlined blue button">
            Log in
          </a>
        </Link>
        <Link href="/register">
          <a className="w-32 py-1 leading-5 blue button">Sign up</a>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
