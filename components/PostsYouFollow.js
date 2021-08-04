import { useQuery } from "@apollo/client";
import { GET_FOLLOWER_QUEST } from "../gql/schema";
import Loading from "./Loading";
import urlSlug from "url-slug";
import Link from "next/link";
import styled from "styled-components";

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

  if (loading || !data) return <Loading />;

  // return <pre>{JSON.stringify(final, null, 2)}</pre>;

  return (
    <>
      <FollowH>Quests you are following</FollowH>
      <Following>
        {final.map((following) => {
          return (
            <div>
              <h2>{following.quest}</h2>
              <Link href={`/quest-view/${following.quest}/${following.id}`}>
                View Quest to Unfollow
              </Link>
            </div>
          );
        })}
      </Following>
    </>
  );
}

const FollowH = styled.h1`
  text-align:center;
  margin:50px; 0;
`;

const Following = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
  width: 75%;
  margin: 0 auto;
  grid-row-gap: 50px;
  text-align: center;
  h2 {
    font-weight: 300;
  }
  a {
    text-decoration: underline;
    background: #25cec8;
    padding: 20px;
    border-radius: 40px;
    color: #fff;
    display: block;
    width: 250px;
    margin: 25px auto;
  }
`;
