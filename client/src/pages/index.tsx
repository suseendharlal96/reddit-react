import React, { useEffect, useState } from "react";
import Head from "next/head";

import useSWR from "swr";

import PostCard from "../components/PostCard";

export default function Home() {
  // const [posts, setPosts] = useState([]);

  const { data: posts } = useSWR("/post");

  // useEffect(() => {
  //   const getPosts = async () => {
  //     try {
  //       const res = await axios.get("/post");
  //       console.log(res.data);
  //       setPosts(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getPosts();
  // }, []);

  // useEffect(() => {
  //   const start = () => {
  //     console.log("start");
  //     setLoading(true);
  //   };
  //   const end = () => {
  //     console.log("findished");
  //     setLoading(false);
  //   };
  //   router.events.on("routeChangeStart", start);
  //   router.events.on("routeChangeComplete", end);
  //   router.events.on("routeChangeError", end);
  //   return () => {
  //     router.events.off("routeChangeStart", start);
  //     router.events.off("routeChangeComplete", end);
  //     router.events.off("routeChangeError", end);
  //   };
  // }, []);
  return (
    <div>
      <Head>
        <title>reddit: the front page of the internet</title>
      </Head>
      <div className="container flex">
        <div className="w-160">
          {posts?.map((post, index: number) => (
            <PostCard key={index} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
