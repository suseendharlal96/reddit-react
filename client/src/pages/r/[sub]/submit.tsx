import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import useSWR from "swr";
import axios from "axios";

import AboutSub from "../../../components/AboutSub";

const Submit = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const router = useRouter();
  const { sub: subName } = router.query;
  const { data: sub, error } = useSWR(subName ? `/subs/${subName}` : null);
  console.log(sub);
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
    }
  };

  return (
    <div className="container flex pt-5">
      <Head>
        <title>Submit to Reddit</title>
      </Head>
      <div className="w-full px-3 md:w-160">
        <div className="p-4 bg-white rounded">
          <h1 className="mb-3 text-lg">Submit a post to /r/{subName}</h1>
          <form onSubmit={submitPost}>
            <div className="relative mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                placeholder="Title"
                maxLength={300}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="absolute mb-2 text-sm text-gray-500 select-none focus:border-gray-600">
                {title.trim().length}/300
              </div>
            </div>
            <textarea
              className="w-full p-3 mt-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
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
      {sub && <AboutSub sub={sub.sub} hide />}
    </div>
  );
};

export default Submit;

export const getServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error("Cookie missing");
    await axios.get("/auth/me", { headers: { cookie } });
    return {
      props: {},
    };
  } catch (error) {
    res.writeHead(307, { Location: "/login" }).end();
  }
};
