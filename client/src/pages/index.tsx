import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

import useSWR, { useSWRInfinite } from "swr";

import PostCard from "../components/PostCard";
import TopSubs from "../components/TopSubs";
import { useAuthState } from "../context/auth";

export default function Home() {
  const [observedPost, setObservedPost] = useState("");
  // const { data: posts, revalidate } = useSWR("/post");
  const {
    data,
    mutate,
    size: page,
    setSize: setPage,
    isValidating,
    revalidate,
    error,
  } = useSWRInfinite((index) => `/post?page=${index}`, { revalidateAll: true });

  const isInitialLoading = !data && !error;

  const posts = data ? [].concat(...data) : [];

  const title = "reddit: the front page of the internet";
  const description =
    "Reddit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!";

  const { data: subs } = useSWR("/subs");
  const { authenticated } = useAuthState();

  useEffect(() => {
    if (!posts || posts.length === 0) return;
    const id = posts[posts.length - 1].identifier;
    if (id !== observedPost) {
      setObservedPost(id);
      observeElmnt(document.getElementById(id));
    }
  }, [posts]);

  const observeElmnt = (el: HTMLElement) => {
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log("bottom");
          setPage(page + 1);
          observer.unobserve(el);
        }
      },
      { threshold: 1 }
    );
    observer.observe(el);
  };

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
        <title>{title}</title>
        <meta name="description" content={description} />
        {/* og is for facebook */}
        <meta property="og:description" content={description} />
        <meta property="twitter:description" content={description} />

        <meta property="og:title" content={title} />
        <meta property="twitter:title" content={title} />
      </Head>
      <div className="container relative flex">
        <div className="w-full px-4 md:w-160 md:p-0">
          {isInitialLoading && (
            <p className="text-sm text-center">Fetching current data...</p>
          )}
          {posts?.map((post, index: number) => (
            <PostCard
              key={index}
              post={post}
              imageUrl={post.sub.imageUrl}
              revalidate={revalidate}
            />
          ))}
          {isValidating && posts.length > 0 && (
            <p className="text-lg font-semibold text-center">Loading More...</p>
          )}
        </div>
        <div
          className="fixed hidden ml-6 lg:block w-80"
          style={{ right: "10%" }}
        >
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Communities
              </p>
            </div>
            <TopSubs subs={subs} />
            {authenticated && (
              <div className="p-4 border-t-2">
                <Link href="/subs/create">
                  <a className="w-full px-2 py-1 blue button">
                    Create Community
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
