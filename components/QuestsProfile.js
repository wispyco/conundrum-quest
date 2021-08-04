import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { GET_QUESTS_BY_USER_ID } from "../gql/schema";
import Loading from "./Loading";
import Link from "next/link";
import urlSlug from "url-slug";

export default function QuestsProfile({ user }) {
  const { loading, error, data } = useQuery(GET_QUESTS_BY_USER_ID, {
    variables: { id: user.id },
  });

  if (error) return <h1>{error.message}</h1>;

  if (loading) return <Loading />;

  return (
    <>
      <h1>Your Quests</h1>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <QuestCardGrid>
        {data?.findUserByID?.quests?.data.map((quest, i) => {
          return <QuestCard key={i} quest={quest} />;
        })}
      </QuestCardGrid>
    </>
  );
}

const QuestCard = ({ quest }) => {
  const slug = urlSlug(quest?.name);
  return (
    <Card>
      <h1>{quest?.name}</h1>
      <h2>
        {quest.isBeingReviewed ? (
          <>{!quest?.isAccepted && "Is in Review"}</>
        ) : (
          "Waiting to be Reviewed"
        )}
      </h2>
      <h2>{quest.isAccepted && "Is Accepted"}</h2>
      {quest.isBeingReviewed || quest.isAccepted ? (
        <>
          {quest.isAccepted ? (
            <Link href={`quest-view/${slug}/${quest._id}`}>View Quest</Link>
          ) : (
            <Link href={`profile/quest-view-temp/${quest._id}`}>
              View Quest
            </Link>
          )}
          <p>
            {quest.isBeingReviewed && (
              <>
                {" "}
                {!quest.isAccepted &&
                  "Cannot edit when Quest is is being reviewed"}
              </>
            )}
          </p>
          <p>
            {quest.isAccepted && "Cannot edit once Quest has been Accepted"}
          </p>
        </>
      ) : (
        <Link href={`profile/quest-edit/${quest._id}`}>Edit Quest</Link>
      )}
    </Card>
  );
};

const Card = styled.div`
  width: 300px;
  border: 1px solid #000;
  padding: 0 25px 25px 25px;
  border-radius: 30px;
  @media (max-width: 1100px) {
    margin: 0 auto;
  }
  h1 {
    font-weight: 300;
    height: 150px;
    font-size: 26px;
  }
  a {
    border: 1px solid aqua;
    border-radius: 30px;
    padding: 10px;
    width: 200px;
    text-align: center;
    display: block;
    margin: 0 auto;
  }
`;

const QuestCardGrid = styled.div`
  width: 950px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 300px 300px;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    width: 100%;
  }
  grid-column-gap: 25px;
  grid-row-gap: 25px;
`;
