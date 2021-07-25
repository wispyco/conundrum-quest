import { useQuery } from "@apollo/client";
import { GET_QUESTS_BY_USER_ID } from "../gql/schema";

export default function QuestsProfile({ user }) {
  const { loading, error, data } = useQuery(GET_QUESTS_BY_USER_ID, {
    variables: { id: user.id },
  });

  return (
    <>
      <h1>Your Quests</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
