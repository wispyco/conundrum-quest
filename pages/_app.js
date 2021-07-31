import "../styles/globals.css";

import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import useSWR from "swr";

import LogRocket from "logrocket";
LogRocket.init("oaksw4/conundrum-quest");

const createApolloClient = (accessToken) => {
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
    connectToDevTools: true,
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

  if (accessToken.token === false) {
    _apolloClient = createApolloClient(
      process.env.NEXT_PUBLIC_FAUNA_CLIENT_KEY
    );
    return _apolloClient;
  } else {
    _apolloClient = createApolloClient(accessToken);
    return _apolloClient;
  }
};

export const useApollo = (auth_cookie) => {
  const accessToken = auth_cookie;
  return initializeApollo(accessToken);
};

const fetcher = (url) => fetch(url).then((r) => r.json());

function MyApp({ Component, pageProps }) {
  const { data: cookieData, error: cookieError } = useSWR(
    "/api/cookie",
    fetcher
  );

  const client = useApollo(cookieData);

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
