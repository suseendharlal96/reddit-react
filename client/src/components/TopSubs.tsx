import Image from "next/image";
import Link from "next/link";

const TopSubs = ({ subs }) => {
  return subs ? (
    subs.map((sub) => (
      <div
        key={sub.name}
        className="flex items-center px-4 py-2 text-xs border-b"
      >
        <div className="mr-2 overflow-hidden rounded-full cursor-pointer">
          <Link href={`/r/${sub.name}`}>
            <Image
              src={sub.imageUrl}
              width={(6 * 16) / 4}
              height={(6 * 16) / 4}
            />
          </Link>
        </div>
        <Link href={`/r/${sub.name}`}>
          <a className="font-bold hover:cursor-pointer">/r/{sub.name}</a>
        </Link>
      </div>
    ))
  ) : (
    <p>Loading..</p>
  );
};

export default TopSubs;
