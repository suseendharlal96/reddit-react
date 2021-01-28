import Head from "next/head";

import useSWR from "swr";

import PostCard from "../components/PostCard";
import TopSubs from "../components/TopSubs";

export default function Home() {
  // const [posts, setPosts] = useState([]);

  const { data: posts, revalidate } = useSWR("/post");
  const { data: subs } = useSWR("/subs");

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
            <PostCard
              key={index}
              post={post}
              imageUrl={post.sub.imageUrl}
              revalidate={revalidate}
            />
          ))}
        </div>
        <div className="ml-6 w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Communities
              </p>
            </div>
            <TopSubs subs={subs} />
          </div>
        </div>
      </div>
    </div>
  );
}
