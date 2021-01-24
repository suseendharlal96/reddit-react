import Link from "next/link";

import dayjs from "dayjs";

import { useAuthState } from "../context/auth";

const AboutSub = ({ sub }) => {
  const { authenticated } = useAuthState();
  return (
    <div className="ml-6 w-80">
      <div className="p-3 bg-blue-500 rounded-t">
        <p className="font-semibold text-white">About Community</p>
      </div>
      <div className="p-3 bg-white">
        <p className="mb-3 font-bold text-center text-md">
          {sub?.description ? sub?.description : sub?.title}
        </p>
        <div className="flex mb-3 text-sm font-medium">
          <div className="w-1/2">
            <p>5k</p>
            <p>members</p>
          </div>
          <div className="w-1/2">
            <p>230</p>
            <p>online</p>
          </div>
        </div>
        <p className="my-3">
          <i className="mr-2 fas fa-birthday-cake"></i>
          Created {dayjs(sub?.createdAt).format("D MMM YYYY")}
        </p>
        {authenticated && (
          <Link href={`/r/${sub?.name}/submit`}>
            <a className="w-full py-1 text-sm blue button">Create Post</a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default AboutSub;