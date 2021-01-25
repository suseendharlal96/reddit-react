import Link from "next/link";
import classNames from "classnames";
import axios from "axios";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useAuthState } from "../context/auth";
import { useRouter } from "next/router";

import ActionButton from "./ActionButton";

interface Post {
  title: string;
  identifier: string;
  slug: string;
  sub: any;
  subName: string;
  body: string | undefined;
  createdAt: string;
  user: any;
  url: string;
  commentCount?: number;
  voteCount?: number;
  userVote?: number;
}

interface PostProps {
  post: Post;
  revalidate: () => void;
}

const PostCard = ({
  post: {
    title,
    identifier,
    slug,
    sub,
    subName,
    body,
    createdAt,
    user,
    url,
    commentCount,
    voteCount,
    userVote,
  },
  revalidate,
}: PostProps) => {
  dayjs.extend(relativeTime);
  const router = useRouter();
  const { authenticated } = useAuthState();

  const vote = async (value: number, commentIdentifier: string) => {
    if (!authenticated) return router.push("/login");
    if (value === userVote) value = 0;
    try {
      const res = await axios.post("/post/vote", {
        identifier,
        slug,
        value,
        commentIdentifier,
      });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex mb-4 bg-white rounded">
      <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
        <div
          onClick={() => vote(1, "")}
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
        >
          <i
            className={classNames("icon-arrow-up", {
              "text-red-500": userVote === 1,
            })}
          ></i>
        </div>
        <p className="text-xs font-bold">{voteCount}</p>
        <div
          onClick={() => vote(-1, "")}
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
        >
          <i
            className={classNames("icon-arrow-down", {
              "text-blue-500": userVote === -1,
            })}
          ></i>
        </div>
      </div>
      <div className="w-full p-2">
        <div className="flex items-center">
          <Link href={`/r/${subName}`}>
            <img
              src={sub.imageUrl}
              alt="img"
              className="w-6 h-6 mr-1 rounded-full cursor-pointer"
            />
          </Link>
          <Link href={`/r/${subName}`}>
            <a className="text-xs font-bold cursor-pointer hover:underline">
              /r/{subName}
            </a>
          </Link>
          <p className="text-xs text-gray-500">
            <span className="mx-1">•</span>
            Posted by
            <Link href={`/u/${user.username}`}>
              <a className="mx-1 hover:underline">{`/u/${user.username}`}</a>
            </Link>
            <Link href={url}>
              <a className="mx-1 hover:underline">
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={url}>
          <a className="my-1 text-lg font-medium">{title}</a>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}
        <div className="flex">
          <Link href={url}>
            <a>
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">
                  {commentCount}
                  {commentCount > 1 ? "Comments" : "Comment"}
                </span>
              </ActionButton>
            </a>
          </Link>
          <ActionButton>
            <i className="mr-1 fas fa-share fa-xs"></i>
            <span className="font-bold">Share</span>
          </ActionButton>
          <ActionButton>
            <i className="mr-1 fas fa-bookmark fa-xs"></i>
            <span className="font-bold">Save</span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
