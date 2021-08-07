import useSWR from "swr";
import { request, GraphQLClient, gql } from "graphql-request";
import React from "react";
import Loading from "../../../components/Loading";
import { GET_HERO_BY_ID } from "../../../gql/schema";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

// const fetcher = (mutation) =>
//   request("https://api.podchaser.com/graphql", mutation);

const fetchWithId = (url, id) => fetch(`${url}?id=${id}`).then((r) => r.json());


const endpoint = "https://api.podchaser.com/graphql/cost";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${process.env.NEXT_PUBLIC_POD_CHASER_API_KEY_PROD}`,
  },
});

export default function HeroPage() {
  //USE TO REGENERATE PODCHASER API, RUNS OUT IN A YEAR TODAY IS AUG 7TH 2021

  // const { data: data2, error } = useSWR(
  //   `mutation {
  // 	requestAccessToken(
  // 		input: {
  // 			grant_type: CLIENT_CREDENTIALS
  // 			client_id: "94190bfd-7531-43da-96d6-0253691696a7"
  // 			client_secret: "DCSFgCdyE1S1SHw6tt6Klg2SzDfLuvr4wm8O5aiK"
  // 		}
  // 	) {
  // 		access_token
  // 		token_type    # Optional, will always be "Bearer"
  // 		expires_in    # Optional, will almost always be 31536000
  // 	}
  // }`,
  //   fetcher
  // );

  // console.log('data2',data2)
  // console.log('error',error)

  const query = gql`
    query getGuests($identifier: PodcastIdentifier!) {
		podcast(
			identifier:$identifier
		  ){
			 credits{
				 data{
					episodeCredits{
						characters
					}
				 }
			 } 
		  }	
		}  
    }
  `;

  const search = gql`
    query {
      podcasts(searchTerm: "syntax") {
        data {
          id
          title
          episodes {
            data {
              title
              credits {
                data {
                  characters {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const Router = useRouter()

  const {
    loading: heroLoading,
    error: heroError,
    data: heroData,
  } = useQuery(GET_HERO_BY_ID, {
    variables: { id: Router.query.id },
  });

  const search1 = gql`
    query test($searchTerm: String) {
      creators(
      searchTerm: $searchTerm
    ){
      data{
        name
        credits{
          data{
            podcast{
              title
              url
              webUrl
            }
          }
        }
      }
    }
  }
`;



  const [data, setData] = React.useState("");
  React.useEffect(() => {
    const variables = {
      searchTerm:heroData?.findHeroByID?.name
    }
    const fetchPodcasts = async () => {
      try {
        const data = await graphQLClient.request(search1, variables);
        console.log(JSON.stringify(data, undefined, 2));
        setData(data);
      } catch (error) {
        console.error(JSON.stringify(error, undefined, 2));
        // process.exit(1);
      }
    };
    fetchPodcasts();
  }, []);

  const [data1, setData1] = React.useState("");

  const checkForGuests = (id) => {
    const variables = {
      identifier: {
        id: id,
        type: "SPOTIFY",
      },
    };

    const fetchPodcastsGuests = async () => {
      const data1 = await graphQLClient.request(query, variables);
      setData1(data1);
    };
    fetchPodcastsGuests();
  };

  const { data, error } = useSWR([`/api/spotify/`, id], fetcher);


  

  if (!data) return <Loading />;

  return (
    <>
      <h1>Hero Page</h1>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {data?.podcasts?.data.map((podcast) => {
        return (
          <React.Fragment key={podcast.id}>
            <button onClick={() => checkForGuests(podcast.id)}>
              Check for Guests from {podcast.title}
            </button>
          </React.Fragment>
        );
      })}
      <pre>{JSON.stringify(heroData, null,2)}</pre>
    </>
  );
}
