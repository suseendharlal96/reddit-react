import Link from "next/link";

import dayjs from "dayjs";

import { useAuthState } from "../context/auth";

const AboutSub = ({ sub, hide, posts }) => {
  const { authenticated } = useAuthState();
  return (
    <div className="hidden ml-6 w-80 md:block">
      <div className="p-3 text-center bg-blue-500 rounded-t dark:bg-gray-800">
        <p className="font-semibold text-white">About Community</p>
      </div>
      <div className="p-3 bg-white dark:bg-gray-700">
        <p className="mb-3 font-bold text-center dark:text-gray-50 text-md">
          {sub?.description ? sub?.description : sub?.title}
        </p>
        <div className="flex mb-3 text-sm font-medium dark:text-gray-50">
          <div className="w-1/3">
            <p>5k</p>
            <p>members</p>
          </div>
          <div className="w-1/3">
            <p>230</p>
            <p>online</p>
          </div>
          {typeof posts !== "boolean" && (
            <div className="w-1/3">
              <p>{posts}</p>
              <p>{posts > 1 ? "Posts" : "Post"}</p>
            </div>
          )}
        </div>
        <p className="my-3 dark:text-gray-50">
          <i className="mr-2 fas fa-birthday-cake"></i>
          Created by
          <Link href={`/u/${sub?.user.username}`}>
            <a className="font-bold cursor-pointer hover:underline">
              {" " + sub?.user.username + " "}
            </a>
          </Link>
          on {dayjs(sub?.createdAt).format("D MMM YYYY")}
        </p>
        {authenticated && !hide && (
          <Link href={`/r/${sub?.name}/submit`}>
            <a className="w-full py-1 text-sm blue button dark:text-gray-50">Create Post</a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default AboutSub;
