import "../styles/globals.css";

import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import useSWR from "swr";

const createApolloClient = (accessToken) => {
  console.log("authToken >>>>>", accessToken);

  const link = createHttpLink({
    uri: "https://graphql.us.fauna.com/graphql",
    credentials: "same-origin",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache({}),
    link,
  });
};

export const initializeApollo = (accessToken) => {
  let _apolloClient;

  if (accessToken === undefined) {
    _apolloClient = createApolloClient(
      process.env.NEXT_PUBLIC_FAUNA_CLIENT_KEY
    );
    return _apolloClient;
  }

  if (!accessToken.token) {
    _apolloClient = createApolloClient(
      process.env.NEXT_PUBLIC_FAUNA_CLIENT_KEY
    );
    return _apolloClient;
  } else {
    _apolloClient = createApolloClient(accessToken);
  }

  // if (!accessToken || accessToken.token) {
  //   console.log("no access token", accessToken);
  //   _apolloClient = createApolloClient(
  //     process.env.NEXT_PUBLIC_FAUNA_CLIENT_KEY
  //   );
  //   return _apolloClient;
  // } else {
  //   console.log("access token", accessToken);

  // }
};

export const useApollo = (auth_cookie) => {
  // if (process.browser) {
  const accessToken = auth_cookie;
  return initializeApollo(accessToken);
  // }

  // // document is not present and we can't retrieve the token but ApolloProvider requires to pass a client
  // return initializeApollo(null);
};

const fetcher = (url) => fetch(url).then((r) => r.json());

function MyApp({ Component, pageProps }) {
  const { data: cookieData, error: cookieError } = useSWR(
    "/api/cookie",
    fetcher
  );

  console.log("cookieData", cookieData);

  // function getCookieValue(name) {
  //   const nameString = name + "=";

  //   const value = document.cookie.split(";").filter((item) => {
  //     return item.includes(nameString);
  //   });

  //   if (value.length) {
  //     return value[0].substring(nameString.length, value[0].length);
  //   } else {
  //     return "";
  //   }
  // }

  // const auth_cookie = getCookieValue("fauna_client"); //returns nick123

  // console.log(cookieError);

  // console.log("cookieData", cookieData);

  const client = useApollo(cookieData);

  // console.log("client", client);

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
