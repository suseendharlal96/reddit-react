import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import useSwr from "swr";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import PostCard from "../../components/PostCard";

const User = () => {
  dayjs.extend(relativeTime);
  const router = useRouter();
  const { data, error, revalidate } = useSwr(
    router.query.username ? `/post/${router.query.username}` : null
  );
  if (error) router.push("/");
  console.log(data);
  return (
    <>
      <Head>
        <title>{data?.user.username}</title>
      </Head>
      {data && (
        <div className="container flex pt-5">
          <div className="w-160">
            {data.submissions.map((submission) => {
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
            })}
          </div>
          <div className="ml-6 w-80">
            <div className="bg-white rounded">
              <div className="p-3 bg-blue-500 rounded-t">
                <img
                  className="w-16 h-16 mx-auto border-2 border-white rounded-full"
                  src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
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
