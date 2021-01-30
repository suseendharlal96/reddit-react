import Head from "next/head";
import Link from "next/link";

import useSWR from "swr";

import PostCard from "../components/PostCard";
import TopSubs from "../components/TopSubs";
import { useAuthState } from "../context/auth";

export default function Home() {
  const { data: posts, revalidate } = useSWR("/post");
  const { data: subs } = useSWR("/subs");
  const { authenticated } = useAuthState();

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
        <div className="w-full px-4 md:w-160 md:0">
          {posts?.map((post, index: number) => (
            <PostCard
              key={index}
              post={post}
              imageUrl={post.sub.imageUrl}
              revalidate={revalidate}
            />
          ))}
        </div>
        <div className="hidden ml-6 md:block w-80">
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
