import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import axios from "axios";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import { GetServerSideProps } from "next";
// import RedditLogo from "/images";

interface Post {
  title: string;
  identifier: string;
  slug: string;
  subName: string;
  body: string | undefined;
  createdAt: string;
  updatedAt: string;
  user: any;
  url: string;
}

export default function Home({ posts }) {
  // const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  dayjs.extend(relativeTime);
  useEffect(() => {
    const start = () => {
      console.log("start");
      setLoading(true);
    };
    const end = () => {
      console.log("findished");
      setLoading(false);
    };
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);
    };
  }, []);
  return (
    <div>
      <Head>
        <title>reddit: the front page of the internet</title>
      </Head>
      <div className="container flex pt-12 mt-4">
        <div className="w-160">
          {loading ? (
            <p>Loading..</p>
          ) : (
            posts.map((post: Post) => (
              <div key={post.identifier} className="flex mb-4 bg-white rounded">
                <div className="w-10 text-center bg-gray-200 rounded-l">
                  <p>Votes</p>
                </div>
                <div className="w-full p-2">
                  <div className="flex items-center">
                    <Link href={`/r/${post.subName}`}>
                      <React.Fragment>
                        <img
                          src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                          alt="img"
                          className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                        />
                        <a className="text-xs font-bold cursor-pointer hover:underline">
                          /r/{post.subName}
                        </a>
                      </React.Fragment>
                    </Link>
                    <p className="text-xs text-gray-500">
                      <span className="mx-1">•</span>
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
                  <Link href={post.url}>
                    <a className="my-1 text-lg font-medium">{post.title}</a>
                  </Link>
                  {post.body && <p className="my-1 text-sm">{post.body}</p>}
                  <div className="flex">
                    <Link href={post.url}>
                      <a>
                        <div className="px-1 py-1 mr-2 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                          <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                          <span className="font-bold">20 comments</span>
                        </div>
                      </a>
                    </Link>
                    <div className="px-1 py-1 mr-2 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                      <i className="mr-1 fas fa-share fa-xs"></i>
                      <span className="font-bold">Share</span>
                    </div>
                    <div className="px-1 py-1 mr-2 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                      <i className="mr-1 fas fa-bookmark fa-xs"></i>
                      <span className="font-bold">Save</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const res = await axios.get("/post");
    if (!res) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    } else {
      return {
        props: {
          posts: res.data,
        },
      };
    }
  } catch (err) {
    console.log(err);
  }
};
