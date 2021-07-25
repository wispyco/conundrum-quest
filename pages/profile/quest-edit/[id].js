import useSWR from "swr";
import Layout from "../../../components/layout";
import Loading from "../../../components/Loading";
import styled from "styled-components";
import EditQuest from "../../../components/EditQuest";
import { GET_QUEST_BY_ID } from "../../../gql/schema";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";

const fetcher = (url) => fetch(url).then((r) => r.json());

function useAuth() {
  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/user", fetcher, { refreshInterval: 3 });

  const loading = user?.token === false || user === undefined;

  return {
    user,
    loading,
    error,
  };
}

export default function Profile() {
  const { user, loading, error } = useAuth();

  // const [showCreateDadHat, setShowCreateDadHat] = useState(true);

  // const show = () => {
  //   setShowCreateDadHat(true);
  // };

  const Router = useRouter();

  const {
    loading: getLoading,
    error: getError,
    data,
  } = useQuery(GET_QUEST_BY_ID, {
    variables: { id: Router.query.id },
  });

  console.log("user >>>>>>", user);

  if (error) return <h1>{error.message}</h1>;

  if (getError) return <h1>failed to get</h1>;

  if (getLoading) return <Loading />;

  return (
    <Layout>
      <main>
        {loading ? (
          <>
            <Loading />
            <h1>SignUp</h1>
          </>
        ) : (
          <>
            {/* <h1>Edit Quest</h1> */}
            {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
            {user.role === "ADMIN" && <></>}
            {user.role === "KNIGHT" && (
              <>
                <h1>Edit this Quest</h1>
                <EditQuestWrap>
                  <EditQuest data={data} Router={Router} user={user} />
                </EditQuestWrap>
              </>
            )}
          </>
        )}
      </main>
    </Layout>
  );
}

const EditQuestWrap = styled.div``;
