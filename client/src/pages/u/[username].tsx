import { ChangeEvent, createRef } from "react";
import classNames from "classnames";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import useSwr from "swr";
import dayjs from "dayjs";
import axios from "axios";
import relativeTime from "dayjs/plugin/relativeTime";

import PostCard from "../../components/PostCard";
import { useAuthState } from "../../context/auth";

const User = () => {
  dayjs.extend(relativeTime);
  const router = useRouter();
  const fileInputRef = createRef<HTMLInputElement>();
  const { authenticated, user } = useAuthState();
  const { data, error, revalidate } = useSwr(
    router.query.username ? `/post/${router.query.username}` : null
  );
  if (error) router.push("/");
  console.log(data);
  const uploadProfilePic = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("type", e.target.name);

    try {
      const res = await axios.post(`/auth/profilepic/${user.username}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res) {
        revalidate();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openFileExplorer = () => {
    if (authenticated && user.username === data.user.username) {
      fileInputRef.current.click();
    } else {
      return;
    }
  };

  return (
    <>
      <Head>
        <title>{data?.user.username}</title>
      </Head>
      {data && (
        <div className="container flex pt-5">
          <input
            type="file"
            name="profile"
            ref={fileInputRef}
            onChange={uploadProfilePic}
            hidden={true}
          />
          <div className="w-160">
            {data.submissions.length > 0 ? (
              data.submissions.map((submission) => {
                if (submission?.commentBody) {
                  const comment = submission;
                  return (
                    <div
                      key={comment.identifier}
                      className="flex my-4 bg-white rounded"
                    >
                      <div className="flex-shrink-0 w-10 py-4 text-center bg-gray-200 rounded-l shrink-0">
                        <i className="text-gray-500 fas fa-comment-alt fa-xs"></i>
                      </div>
                      <div className="w-full p-2">
                        <p className="mb-2 text-xs text-gray-500">
                          {comment.username}
                          <span> commented on </span>
                          <Link href={comment.post.url}>
                            <a className="font-semibold cursor-pointer hover:underline">
                              {comment.post.title}
                            </a>
                          </Link>
                          <span className="mx-1">•</span>
                          <Link href={`/r/${comment.post.subName}`}>
                            <a className="text-black cursor-pointer hover:underline">
                              {"/r/" + comment.post.subName + " "}
                            </a>
                          </Link>
                          {dayjs(comment.createdAt).fromNow()}
                        </p>
                        <hr />
                        <p>{comment.commentBody}</p>
                      </div>
                    </div>
                  );
                } else {
                  const post = submission;
                  return (
                    <PostCard
                      key={post.identifier}
                      post={post}
                      imageUrl={post.sub.imageUrl}
                      revalidate={revalidate}
                    />
                  );
                }
              })
            ) : (
              <p className="font-semibold">
                {user.username === data.user.username ? "You have" : "User has"}{" "}
                not involved in any activities related to post or comments.
              </p>
            )}
          </div>
          <div className="ml-6 w-80">
            <div className="bg-white rounded">
              <div
                onClick={openFileExplorer}
                className={classNames("p-3 bg-blue-500 rounded-t", {
                  "cursor-pointer":
                    authenticated && user.username === data.user.username,
                })}
                title={
                  authenticated && user.username === data.user.username
                    ? "Click to change your profile picture"
                    : ""
                }
              >
                <img
                  className="w-16 h-16 mx-auto border-2 border-white rounded-full"
                  src={data.user.profileUrl}
                  alt="profile"
                />
              </div>
              <div className="p-3 text-center">
                <h1 className="mb-3 text-xl ">{data.user.username}</h1>
                <hr />
                <p className="mt-2">
                  Joined {dayjs(data.user.createdAt).format("MMM YYYY")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default User;
