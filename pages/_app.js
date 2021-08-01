import "../styles/globals.css";

import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import useSWR from "swr";

import LogRocket from "logrocket";
import Head from "next/head";
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
      <Head>
        <title>Conundrum Quest</title>
        <meta property="og:title" content="Conundrum Quest" />
        <meta
          property="og:description"
          content="A place to see the world’s hardest problems. 
  Who’s working on them and to follow along"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:url" content="https://conundrum.quest" />
        <meta
          property="og:image"
          content="https://conundrum.quest/logo-3-large.png"
        />
        <meta property="og:image:width" content="148" />
        <meta property="og:image:height" content="186" />
      </Head>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
