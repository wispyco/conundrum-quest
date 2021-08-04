import { useQuery } from "@apollo/client";
import { GET_FOLLOWER_QUEST } from "../gql/schema";
import Loading from "./Loading";
import urlSlug from "url-slug";
import Link from "next/link";

export default function PostsYouFollow({ user }) {
  const { loading, error, data } = useQuery(GET_FOLLOWER_QUEST);

  const test = data?.getFollowers?.data.map((item) => {
    return item?.quests?.data.map((ok) => {
      const one = urlSlug(ok?.name);
      const two = ok?._id;

      // console.log(ok);
      // console.log(user.id);
      const three = ok?.follower1s?.data.filter(
        (f) => f?.owner?._id === user?.id
      );

      return { quest: one, id: two, three: three };
    });
  });

  // const slug = urlSlug(quest.name);

  const final = test?.flat().filter((f) => JSON.stringify(f.three) !== "[]");

  if (error) return <p>{error.message}</p>;

  if (loading) return <Loading />;

  // return <pre>{JSON.stringify(final, null, 2)}</pre>;

  return (
    <>
      <h1>Quests you are following</h1>
      {final.map((following) => {
        return (
          <>
            <h2>{following.quest}</h2>
            <Link href={`/quest-view/${following.quest}/${following.id}`}>
              View Quest to Unfollow
            </Link>
          </>
        );
      })}
    </>
  );
}
