import Image from "next/image";
import Link from "next/link";

const TopSubs = ({ subs }) => {
  return subs ? (
    <div className="overflow-auto max-h-52">
      {subs.map((sub) => (
        <div
          key={sub.name}
          className="flex items-center px-4 py-2 text-xs break-all border-b dark:bg-gray-700"
        >
          <Link href={`/r/${sub.name}`}>
            <a>
              <Image
                className="rounded-full cursor-pointer"
                src={sub.imageUrl}
                width={(6 * 16) / 4}
                height={(6 * 16) / 4}
              />
            </a>
          </Link>
          <Link href={`/r/${sub.name}`}>
            <a className="ml-2 font-bold hover:cursor-pointer dark:text-gray-50">/r/{sub.name}</a>
          </Link>
        </div>
      ))}
    </div>
  ) : (
    <p>Loading..</p>
  );
};

export default TopSubs;
