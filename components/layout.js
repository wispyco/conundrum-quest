import Head from "next/head";
import { magicClient } from "../lib/magic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import Script from "next/script";
import useSWR from "swr";
import { query } from "faunadb";
import { Header1 } from "../pages/profile";
import { GoogleFonts } from "next-google-fonts";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Layout({ children }) {
  const Router = useRouter();

  const logout = () => {
    magicClient.user.logout().then(async (test) => {
      // console.log(await magicClient.user.isLoggedIn()); // => `false`
      const res = await fetch("/api/logout", {
        method: "GET",
      });
      Router.push("/login-magic");
    });
  };

  const { data: cookie, error } = useSWR("/api/cookie", fetcher);

  const [userMenu, setUserMenu] = useState(false);

  // const cookie = getCookie("fauna_client");

  useEffect(() => {
    if (cookie?.token === false) {
      console.log(Router);
      if (Router.asPath === "/") {
        setUserMenu(false);
      } else {
        magicClient.user.logout().then(async (test) => {
          // console.log(await magicClient.user.isLoggedIn()); // => `false`
          Router.push("/login-magic");
        });
      }
    }
  }, []);

  async function test() {
    const userMagic = await magicClient.user.isLoggedIn(); // => `false`

    console.log(userMagic, "userMagic");
    console.log(cookie, "cookie");

    if (cookie?.token === false) {
      // show user menu
      setUserMenu(false);
    } else {
      // hide user menu
      setUserMenu(true);
    }
  }

  useEffect(() => {
    test();
  });

  const [soon, setSoon] = useState(true);

  const faceOff = () => {
    setSoon(false);
  };
  const faceOffB = () => {
    setSoon(true);
  };
  const [wear, setWear] = useState(true);

  const wearH = () => {
    setWear(false);
  };
  const wearHB = () => {
    setWear(true);
  };

  return (
    <>
      <Head>
        <title>StreetWear.cool</title>
        <meta
          name="description"
          content="A Cool Kewl Place to Share Streetwear and Fashion"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content="/logo-3.png" />
      </Head>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        type="text/javascript"
      ></Script>
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@100;300;400;500;700&display=swap" />
      <Link href="/">
        <Logo src="/logo-3.png" />
      </Link>
      <Alpha>In Alpha</Alpha>
      {userMenu ? (
        <UserMenu>
          <button onClick={logout}>Logout</button>
          <Link href="/profile">
            <a onMouseOver={wearH} onMouseOut={wearHB}>
              {wear ? "WDYWT" : "What Did You Wear Today?"}
            </a>
          </Link>
          <a onMouseOver={faceOff} onMouseOut={faceOffB} href="">
            {soon ? "Fit Battle" : "Coming Soon"}
          </a>
          <a href="">Were Open Source, see our naked code</a>
          <a href="">Feedback</a>
        </UserMenu>
      ) : (
        <UserMenu>
          <Link href="/login-magic">login / signup</Link>
          <Link href="/profile">
            <a onMouseOver={wearH} onMouseOut={wearHB}>
              {wear ? "WDYWT" : "What Did You Wear Today?"}
            </a>
          </Link>
          <a onMouseOver={faceOff} onMouseOut={faceOffB} href="">
            {soon ? "Fit Battle" : "Coming Soon"}
          </a>
          <a href="">Were Open Source, see our naked code</a>
          <a href="">Feedback</a>
        </UserMenu>
      )}
      <Header1>StreetWear.cool</Header1>
      {Router.asPath === "/" && (
        <>
          <Header2>
            A Kewl, Kool, Cool place to share WYWT, LinkUp your Fits and more...
          </Header2>
          <Header3>Hover on a fit to see where it came from</Header3>
        </>
      )}
      <Main>{children}</Main>
      <Made href="https://wispy.co">
        <Header2>
          Made for fun by <span>Wispy Company</span> in The Great White North
        </Header2>
      </Made>
    </>
  );
}

const Made = styled.a`
  margin-top: 50px;
  display: block;
  margin-bottom: 50px;
  span {
    color: blue;
  }
`;

const Alpha = styled.span`
  position: fixed;
  top: 125px;
  left: 30px;
  border: 1px solid yellow;
  background: orange;
  color: #fff;
  text-transform: uppercase;
  border-radius: 30px;
  z-index: 200;
  padding: 5px;
`;

const Header2 = styled.h2`
  text-align: center;
  font-weight: 300;
  font-size: 32px;
  width: 600px;
  margin: 0 auto;
`;

const Header3 = styled.h3`
  text-align: center;
  font-weight: 300;
  font-size: 26px;
  width: 600px;
  margin: 0 auto;
  margin-top: 50px;
`;

const UserMenu = styled.div`
  position: fixed;
  top: 15px;
  right: 15px;
  display: grid;
  grid-row-gap: 10px;
  width: 150px;
  text-align: center;
  button {
    padding: 10px;
    background: none;
    border: 1px solid #000;
    font-size: 16px;
    &:hover {
      cursor: pointer;
    }
  }
  a {
    border: 1px solid #000;
    padding: 10px;
    font-size: 16px;
  }
`;

const Logo = styled.img`
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 190;
  &:hover {
    cursor: pointer;
  }
`;

const Main = styled.main`
  margin-top: 50px;
  width: ;
`;
