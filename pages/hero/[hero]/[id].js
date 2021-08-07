import useSWR from "swr";
import { request, GraphQLClient, gql } from "graphql-request";
import React from "react";

// const fetcher = (mutation) =>
//   request("https://api.podchaser.com/graphql", mutation);

const endpoint = "https://api.podchaser.com/graphql";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${process.env.NEXT_PUBLIC_POD_CHASER_API_KEY}`,
  },
});

export default function HeroPage() {
  //USE TO REGENERATE PODCHASER API, RUNS OUT IN A YEAR TODAY IS AUG 7TH 2021

  //   const { data, error } = useSWR(
  //     `mutation {
  // 		requestAccessToken(
  // 			input: {
  // 				grant_type: CLIENT_CREDENTIALS
  // 				client_id: "94190bfc-f543-4dd8-be04-04b2a76390b4"
  // 				client_secret: "cy1kKr4iZ19SNTB3IGV6K1M8h05SHOHKokLIk70E"
  // 			}
  // 		) {
  // 			access_token
  // 			token_type    # Optional, will always be "Bearer"
  // 			expires_in    # Optional, will almost always be 31536000
  // 		}
  // 	}`,
  //     fetcher
  //   );

  const query = gql`
    query {
      podcasts {
        data {
          title
          description
        }
      }
    }
  `;

  const [data, setData] = React.useState("");
  React.useEffect(() => {
    const fetchPodcasts = async () => {
      const data = await graphQLClient.request(query);
      setData(data);
    };
    fetchPodcasts();
  }, []);

  return (
    <>
      <h1>Hero Page</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {/* <pre>{JSON.stringify(error, null, 2)}</pre> */}
    </>
  );
}
