import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import useSWR from "swr";
import axios from "axios";

import AboutSub from "../../../components/AboutSub";
import { useAuthState } from "../../../context/auth";

const Submit = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const router = useRouter();
  const { authenticated } = useAuthState();
  const { sub: subName } = router.query;
  const { data: sub, error } = useSWR(
    subName && authenticated ? `/subs/${subName}` : null
  );
  console.log(sub);
  useEffect(() => {
    if (!authenticated) router.push("/login");
  }, [authenticated]);
  if (error) router.push("/");

  const submitPost = async (e) => {
    e.preventDefault();

    if (title.trim() === "") return;
    try {
      const { data: post } = await axios.post("/post/createPost", {
        title: title.trim(),
        body: body.trim(),
        subName,
      });
      router.push(`/r/${post.sub.name}/${post.identifier}/${post.slug}`);
    } catch (error) {
      console.log(error);
      if (error.response.data && error.response.data.error) {
        router.push("/login");
      }
    }
  };

  return (
    authenticated && (
      <div className="container flex pt-5">
        <Head>
          <title>Submit to Reddit</title>
        </Head>
        <div className="w-full px-3 md:w-160">
          <div className="p-4 bg-white rounded dark:bg-gray-700">
            <h1 className="mb-3 text-lg dark:text-gray-50">Submit a post to /r/{subName}</h1>
            <form onSubmit={submitPost}>
              <div className="relative mb-2">
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded dark:bg-gray-500 dark:text-gray-50 focus:outline-none"
                  placeholder="Title"
                  maxLength={300}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div className="absolute mb-2 text-sm text-gray-500 select-none dark:text-gray-50 focus:border-gray-600">
                  {title.trim().length}/300
                </div>
              </div>
              <textarea
                className="w-full p-3 mt-3 border border-gray-300 rounded dark:bg-gray-500 dark:text-gray-50 focus:outline-none focus:border-gray-600"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Message(Optional)"
                rows={4}
              />
              <div className="flex justify-end">
                <button
                  className="px-3 py-1 button blue"
                  type="submit"
                  disabled={title.trim().length === 0}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        {sub && <AboutSub sub={sub.sub} hide posts={1} />}
      </div>
    )
  );
};

export default Submit;
