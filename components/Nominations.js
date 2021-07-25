import { useQuery } from "@apollo/client";
import { GET_HEROS_BY_USER_ID } from "../gql/schema";
import Loading from "./Loading";

export default function Nominations({user}){
    const { loading, error, data } = useQuery(GET_HEROS_BY_USER_ID, {
        variables: { id: user.id },
      });
    
      if (error) return <h1>{error.message}</h1>;
    
      if (loading) return <Loading />;

    return(
        <>
        <pre>

        {JSON.stringify(data,null,2)}
        </pre>
        <h1>Nominations</h1>
        </>
    )
}