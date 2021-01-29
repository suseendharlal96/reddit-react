import Image from "next/image";
import Link from "next/link";

const TopSubs = ({ subs }) => {
  return subs ? (
    subs.map((sub) => (
      <div
        key={sub.name}
        className="flex items-center px-4 py-2 text-xs border-b"
      >
        <Link href={`/r/${sub.name}`}>
          <Image
            className="rounded-full cursor-pointer"
            src={sub.imageUrl}
            width={(6 * 16) / 4}
            height={(6 * 16) / 4}
          />
        </Link>
        <Link href={`/r/${sub.name}`}>
          <a className="ml-2 font-bold hover:cursor-pointer">/r/{sub.name}</a>
        </Link>
      </div>
    ))
  ) : (
    <p>Loading..</p>
  );
};

export default TopSubs;
