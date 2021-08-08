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
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Fathom from "fathom-client";

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

  // Fathom Tracking Code
  const router = useRouter();

  useEffect(() => {
    // Initialize Fathom when the app loads
    // Example: yourdomain.com
    //  - Do not include https://
    //  - This must be an exact match of your domain.
    //  - If you're using www. for your domain, make sure you include that here.
    Fathom.load("EEVJRZNR", {
      includedDomains: ["conundrum.quest", "www.conundrum.quest"],
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    // Record a pageview when route changes
    router.events.on("routeChangeComplete", onRouteChangeComplete);

    // Unassign event listener
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, []);
  // Fathom Tracking Code ends

  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Conundrum Quest</title>
        <meta property="og:title" content="Conundrum Quest" />
        <meta
          name="description"
          content="A place to share new problems, ideas and see who is
          working on them."
        ></meta>
        <meta
          property="og:description"
          content="A place to share new problems, ideas and see who is
          working on them."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:url" content="https://conundrum.quest" />
        <meta
          property="og:image"
          content="https://conundrum.quest/logo-5.png"
        />
        <meta property="og:image:width" content="148" />
        <meta property="og:image:height" content="186" />
      </Head>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
