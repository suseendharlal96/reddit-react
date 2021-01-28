import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import classNames from "classnames";

import useSWR from "swr";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import AboutSub from "../../../../components/AboutSub";
import ActionButton from "../../../../components/ActionButton";
import { useAuthState } from "../../../../context/auth";

const PostPage = () => {
  dayjs.extend(relativeTime);
  const router = useRouter();
  const { identifier, sub, slug } = router.query;
  const { authenticated } = useAuthState();
  const { data: post, error, revalidate } = useSWR(
    identifier && slug ? `/post/${identifier}/${slug}` : null
  );
  if (error) router.push("/");

  const vote = async (value: number, comment: any) => {
    if (!authenticated) return router.push("/login");
    if ((!comment && value === post.userVote) || (value === comment.userVote))
      value = 0;
    try {
      const res = await axios.post("/post/vote", {
        identifier,
        slug,
        value,
        commentIdentifier: comment ? comment.identifier : "",
      });
      console.log(res.data);
      revalidate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <Link href={`/r/${sub}`}>
        <a>
          <div className="flex items-center w-full h-20 p-8 bg-blue-500">
            <div className="container flex">
              {post && (
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <Image
                    src={post.sub.imageUrl}
                    height={(8 * 16) / 4}
                    width={(8 * 16) / 4}
                  />
                </div>
              )}
              <p className="text-xl font-semibold text-white">/r/{sub}</p>
            </div>
          </div>
        </a>
      </Link>
      <div className="container flex pt-5">
        <div className="w-160">
          <div className="bg-white rounded">
            {post && (
              <>
                <div className="flex">
                  <div className="flex-shrink-0 w-10 py-2 text-center rounded-l ">
                    <div
                      onClick={() => vote(1, "")}
                      className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                    >
                      <i
                        className={classNames("icon-arrow-up", {
                          "text-red-500": post.userVote === 1,
                        })}
                      ></i>
                    </div>
                    <p className="text-xs font-bold">{post.voteCount}</p>
                    <div
                      onClick={() => vote(-1, "")}
                      className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
                    >
                      <i
                        className={classNames("icon-arrow-down", {
                          "text-blue-500": post.userVote === -1,
                        })}
                      ></i>
                    </div>
                  </div>
                  <div className="py-2 pr-2">
                    <div className="flex items-center">
                      <p className="text-xs text-gray-500">
                        Posted by
                        <Link href={`/u/${post.user.username}`}>
                          <a className="mx-1 hover:underline">{`/u/${post.user.username}`}</a>
                        </Link>
                        <Link href={post.url}>
                          <a className="mx-1 hover:underline">
                            {dayjs(post.createdAt).fromNow()}
                          </a>
                        </Link>
                      </p>
                    </div>
                    {/* POST TITLE */}
                    <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                    {/* POST BODY */}
                    <div className="my-3 text-sm">{post.body}</div>
                    {/* ACTION BUTTONS */}
                    <div className="flex">
                      <Link href={post.url}>
                        <a>
                          <ActionButton>
                            <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                            <span className="font-bold">
                              {post.commentCount}
                              {post.commentCount > 1 ? "Comments" : "Comment"}
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
                <hr />
                {post.comments &&
                  post.comments.length > 0 &&
                  post.comments.map((comment) => (
                    <div className="flex" key={comment.identifier}>
                      <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                        <div
                          onClick={() => vote(1, comment)}
                          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                        >
                          <i
                            className={classNames("icon-arrow-up", {
                              "text-red-500": comment.userVote === 1,
                            })}
                          ></i>
                        </div>
                        <p className="text-xs font-bold">
                          {comment.voteCount}
                        </p>
                        <div
                          onClick={() => vote(-1, comment)}
                          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
                        >
                          <i
                            className={classNames("icon-arrow-down", {
                              "text-blue-500": comment.userVote === -1,
                            })}
                          ></i>
                        </div>
                      </div>
                      <div className="py-2 pr-2">
                        <p className="mb-1 text-xs leading-none">
                          <Link href={`/u/${comment.username}`}>
                            <a className="mr-1 font-bold hover:underline">
                              {comment.username}
                            </a>
                          </Link>
                          <span className="text-gray-600">
                            {`${comment.voteCount}
                              points • ${dayjs(comment.createdAt).fromNow()}
                              `}
                          </span>
                        </p>
                        <p>{comment.commentBody}</p>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
        {post && <AboutSub sub={post.sub} />}
      </div>
    </>
  );
};

export default PostPage;