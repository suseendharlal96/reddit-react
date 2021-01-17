import { useRouter } from "next/router";

import useSwr from "swr";

import PostCard from "../../components/PostCard";

const Sub = () => {
  const { query, push } = useRouter();
  const { data: subPosts, error } = useSwr(
    query.sub ? `/subs/${query.sub}` : null
  );

  let postData;
  if (error) push("/");
  if (!subPosts) {
    postData = <p className="text-lg text-center ">Loading..</p>;
  } else if (subPosts.length === 0) {
    postData = <p className="text-lg text-center">No posts under this sub.</p>;
  } else {
    postData = subPosts.map((post) => <PostCard key={post._id} post={post} />);
  }
  return (
    <div className="container flex pt-5">
      {subPosts && <div className="w-160">{postData}</div>}
    </div>
  );
};

export default Sub;
