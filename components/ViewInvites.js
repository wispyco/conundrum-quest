import { useQuery } from "@apollo/client";
import { GET_INVITES } from "../gql/schema";
import Loading from "./Loading";

export default function ViewInvites() {
  const { loading, error, data } = useQuery(GET_INVITES);

  if (error)
    return (
      <>
        <h1>Current Invites</h1>
        <h1>{error.message}</h1>
      </>
    );

  if (loading) return <Loading />;

  return (
    <>
      <h1>Current Invites</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
