import { useState, useEffect, createRef, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import classNames from "classnames";

import useSwr from "swr";
import axios from "axios";

import PostCard from "../../components/PostCard";
import { useAuthState } from "../../context/auth";
import AboutSub from "../../components/AboutSub";

const Sub = () => {
  const [subCreator, setSubCreator] = useState(false);
  const { query, push } = useRouter();
  const { data, error, revalidate } = useSwr(
    query.sub ? `/subs/${query.sub}` : null
  );
  const { authenticated, user } = useAuthState();
  const fileInputRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if (!data) {
      return;
    }
    setSubCreator(authenticated && user.username === data.sub.user.username);
  }, [data]);

  const openFileExplorer = (type: string) => {
    if (!subCreator) return;
    fileInputRef.current.name = type;
    fileInputRef.current.click();
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", e.target.name);
    try {
      const res = await axios.post(`/subs/${data.sub.name}/image`, formData, {
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

  let postData;
  if (error) push("/");
  if (!data?.posts) {
    postData = <p className="text-lg text-center ">Loading..</p>;
  } else if (data?.posts.length === 0) {
    postData = <p className="text-lg text-center">No posts under this sub.</p>;
  } else {
    postData = data?.posts.map((post) => (
      <PostCard key={post._id} post={post} imageUrl={data?.sub?.imageUrl} revalidate={revalidate} />
    ));
  }
  return (
    <div>
      <Head>
        <title>{data?.sub?.name}</title>
      </Head>
      {data?.sub && (
        <>
          <input
            type="file"
            hidden={true}
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <div>
            <div
              className={classNames("bg-blue-500", {
                "cursor-pointer": subCreator,
              })}
              title={subCreator ? "Click to change the Cover picture" : ""}
              onClick={() => openFileExplorer("banner")}
            >
              {data?.sub?.bannerUrl ? (
                <div
                  className="h-32 bg-blue-500"
                  style={{
                    backgroundImage: `url(${data?.sub?.bannerUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    // objectFit:'cover'
                  }}
                ></div>
              ) : (
                <div className="h-20 bg-blue-500"></div>
              )}
            </div>
            <div className="h-20 bg-white">
              <div className="container relative flex">
                <div
                  onClick={() => openFileExplorer("image")}
                  className={classNames("absolute", {
                    "cursor-pointer": subCreator,
                  })}
                  title={
                    subCreator ? "Click to change the profile picture" : ""
                  }
                  style={{ top: "-15px" }}
                >
                  <Image
                    src={data.sub.imageUrl}
                    alt="Sub image"
                    className="rounded-full"
                    width={70}
                    height={70}
                  />
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="mb-1 text-3xl font-bold">
                      {data.sub.title}
                    </h1>
                  </div>
                  <p className="text-sm font-bold text-gray-600">
                    /r/{data.sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="container flex pt-5">
        {data?.posts && <div className="w-full px-3 md:w-160">{postData}</div>}
        <AboutSub sub={data?.sub} />
      </div>
    </div>
  );
};

export default Sub;
