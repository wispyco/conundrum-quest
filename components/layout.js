import Head from "next/head";
import { magicClient } from "../lib/magic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Link from "next/link";
import Script from "next/script";
import useSWR from "swr";
import { query } from "faunadb";
import { Header1 } from "../pages/profile";
import { GoogleFonts } from "next-google-fonts";
import { FeedbackFish } from "@feedback-fish/react";
import Loading from "./Loading";
import { IoIosPeople } from "react-icons/io";
import { ImEarth } from "react-icons/im";
import { AiOutlineMenu } from "react-icons/ai";
import { GrClose } from "react-icons/gr";
import LogRocket from "logrocket";
import { Waitlist } from "waitlistapi";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Layout({ children }) {
  const Router = useRouter();

  const logout = () => {
    magicClient.user.logout().then(async (test) => {
      // console.log(await magicClient.user.isLoggedIn()); // => `false`
      const res = await fetch("/api/logout", {
        method: "GET",
      });
      Router.push("/login-magic-public");
    });
  };

  const { data: cookie, error } = useSWR("/api/cookie", fetcher);

  const [userMenu, setUserMenu] = useState(false);

  // const cookie = getCookie("fauna_client");

  // useEffect(() => {
  //   if (cookie?.token === false) {
  //     console.log(Router);
  //     if (Router.asPath === "/") {
  //       setUserMenu(false);
  //     } else {
  //       magicClient.user.logout().then(async (test) => {
  //         // console.log(await magicClient.user.isLoggedIn()); // => `false`
  //         Router.push("/login-magic-public");
  //       });
  //     }
  //   }
  // }, []);

  async function test() {
    const userMagic = await magicClient.user.isLoggedIn(); // => `false`

    // console.log(userMagic, "userMagic");
    // console.log(cookie, "cookie");

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

  const [menuState, setMenuState] = useState(true);

  const toggleMenu = () => {
    setMenuState((state) => !state);
  };

  const [userData, setUserData] = useState(null);

  const { data: user, error: userError } = useSWR("/api/user", fetcher);

  LogRocket.identify(user?.id, {
    name: user?.name,
    email: user?.email,

    // Add your own custom user variables here, ie:
    role: user?.role,
  });

  const [jobs, setJobs] = useState(false);

  // if (!user) return <Loading />;

  return (
    <>
      <Head>
        <title>Conundrum Quest</title>
        <meta property="og:title" content="Conundrum Quest" />
        <meta
          property="og:description"
          content="A place to see the world’s hardest problems. 
  And who’s working on them and follow along"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:url" content="https://conundrum.quest" />
        <meta property="og:image" content="/logo-3.png" />
        <meta property="og:image:width" content="148" />
        <meta property="og:image:height" content="186" />
      </Head>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        type="text/javascript"
      ></Script>
      <GlobalStyle />
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@100;300;400;500;700&display=swap" />
      <Link href="/">
        <Logo src="/logo-3.png" />
      </Link>
      <Alpha>In Alpha</Alpha>
      <Menu onClick={toggleMenu}>
        {menuState ? <AiOutlineMenu size={40} /> : <GrClose size={40} />}
      </Menu>
      {menuState ? (
        <>
          {userMenu ? (
            <UserMenu>
              <button onClick={logout}>Logout</button>
              <Link href="/profile">
                {/* <a onMouseOver={wearH} onMouseOut={wearHB}> */}
                My Profile
                {/* </a> */}
              </Link>
              <button onClick={() => setJobs(true)}>Job Board</button>

              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/wispyco/conundrum-quest"
              >
                Were Open Source
              </a>
              <FeedbackFish projectId="38f28542cb7f31" userId={user?.email}>
                <NavButton>Send feedback</NavButton>
              </FeedbackFish>
            </UserMenu>
          ) : (
            <UserMenuOut>
              <Link href="/login-magic-public">login / signup</Link>
              <button onClick={() => setJobs(true)}>Job Board</button>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/wispyco/conundrum-quest"
              >
                Were Open Source
              </a>
              <FeedbackFish projectId="38f28542cb7f31" userId={user?.email}>
                <NavButton>Send feedback</NavButton>
              </FeedbackFish>
            </UserMenuOut>
          )}
        </>
      ) : (
        <>
          {userMenu ? (
            <UserMenuMobile>
              <button onClick={logout}>Logout</button>
              <Link href="/profile">
                {/* <a onMouseOver={wearH} onMouseOut={wearHB}> */}
                My Profile
                {/* </a> */}
              </Link>
              <button onClick={() => setJobs(true)}>Job Board</button>

              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/wispyco/conundrum-quest"
              >
                Were Open Source
              </a>
              <FeedbackFish projectId="38f28542cb7f31" userId={user?.email}>
                <NavButton>Send feedback</NavButton>
              </FeedbackFish>
            </UserMenuMobile>
          ) : (
            <UserMenuMobile>
              <Link href="/login-magic-public">login / signup</Link>
              <button onClick={() => setJobs(true)}>Job Board</button>

              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/wispyco/conundrum-quest"
              >
                Were Open Source, see our naked code
              </a>
              <FeedbackFish projectId="38f28542cb7f31" userId={user?.email}>
                <NavButton>Send feedback</NavButton>
              </FeedbackFish>
            </UserMenuMobile>
          )}
        </>
      )}
      <Header1>Conundrum Quest</Header1>
      {Router.asPath === "/" && (
        <Title>
          <Header2>
            The Worlds hardest problems and who is working on them.
          </Header2>
          <Link href="/login-magic-public">Join to Add a Quest</Link>
        </Title>
      )}
      <Main>{children}</Main>
      <Made href="https://wispy.co">
        <Header2>
          Made for the <ImEarth /> and its <IoIosPeople />
        </Header2>
        <p>by wispy.co</p>
      </Made>
      <>
        {process.browser && (
          <>
            {jobs && (
              <Wait>
                <button onClick={() => setJobs(false)}>
                  <GrClose />
                </button>
                <Waitlist
                  api_key="NB4BSM"
                  waitlist_link="https://conundrum.quest"
                />
              </Wait>
            )}
          </>
        )}
      </>
    </>
  );
}

const NavButton = styled.button``;

const Wait = styled.div`
  position: fixed;
  width: 800px;
  margin-left: -400px;
  left: 50%;
  top: 200px;
  background: #c7c7c7eb;
  padding: 200px;
  z-index: 500;
  border-radius: 20px;
  @media (max-width: 1100px) {
    padding: 0;
    width: 300px;
    margin-left: -150px;
    top: 100px;
    background: none;
  }
`;

const Title = styled.div`
  margin: 150px auto 0 auto;
  @media (max-width: 1100px) {
    margin: 25px auto 0 auto;
  }
  a {
    text-align: center;
    display: block;
    margin: 50px auto 0 auto;
    width: 200px;
    border-radius: 30px;
    padding: 15px;
    background: #25cec8;
    color: #fff;
  }
`;

const Made = styled.a`
  margin-top: 50px;
  display: block;
  margin-bottom: 50px;
  span {
    color: blue;
  }
  text-align: center;
`;

const Alpha = styled.span`
  position: fixed;
  background: #a7a7a7;
  color: #fff;
  text-transform: uppercase;
  /* border-radius: 30px; */
  z-index: 200;
  padding: 3px;
  font-size: 12px;
  top: 68px;
  left: 50%;
  width: 100px;
  text-align: center;
  margin-left: -91px;
  /* box-shadow: 5px 5px 10px #dadada; */
  transform: rotate(-90deg);
`;

const Header2 = styled.h2`
  text-align: center;
  font-weight: 300;
  font-size: 32px;
  width: 600px;
  @media (max-width: 1100px) {
    width: 75%;
  }
  margin: 0 auto;
`;

const Header3 = styled.h3`
  text-align: center;
  font-weight: 300;
  font-size: 26px;
  width: 600px;
  margin: 0 auto;
  margin-top: 50px;
  @media (max-width: 1100px) {
    width: 75%;
  }
`;

const UserMenu = styled.div`
  position: fixed;
  background: #fff;
  top: 25px;
  right: 25px;
  display: grid;
  grid-template-columns: 100px 100px 200px 200px 150px;
  // grid-row-gap: 10px;
  width: 750px;
  align-items: center;
  text-align: center;
  @media (max-width: 1100px) {
    display: none;
  }
  button {
    padding: 10px;
    background: none;
    //border: 1px solid #000;
    border: none;
    font-size: 16px;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  a {
    //border: 1px solid #000;
    padding: 10px;
    font-size: 16px;
    &:hover {
      text-decoration: underline;
    }
  }
`;
const UserMenuOut = styled.div`
  position: fixed;
  background: #fff;
  top: 25px;
  right: 25px;
  display: grid;
  grid-template-columns: 150px 200px 200px 150px;
  // grid-row-gap: 10px;
  width: 750px;
  align-items: center;
  text-align: center;
  @media (max-width: 1100px) {
    display: none;
  }
  button {
    padding: 10px;
    background: none;
    //border: 1px solid #000;
    border: none;
    font-size: 16px;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  a {
    //border: 1px solid #000;
    padding: 10px;
    font-size: 16px;
    &:hover {
      text-decoration: underline;
    }
  }
`;
const UserMenuMobile = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  display: grid;
  grid-row-gap: 10px;
  align-items: center;
  width: 100%;
  height: 100vh;
  padding-top: 150px;
  grid-template-rows: 50px 50px 50px 50px;
  background: #fff;
  z-index: 100;
  text-align: center;
  @media (min-width: 1100px) {
    display: none;
  }
  button {
    padding: 10px;
    background: none;
    border: 1px solid #000;
    width: 250px;
    border-radius: 30px;
    margin: 0 auto;
    font-size: 16px;
    &:hover {
      cursor: pointer;
    }
  }
  a {
    border: 1px solid #000;
    padding: 10px;
    font-size: 16px;
    width: 250px;
    border-radius: 30px;
    margin: 0 auto;
  }
`;

const Menu = styled.button`
  position: absolute;
  right: 15px;
  z-index: 200;
  top: 15px;
  background: none;
  border: none;
  display: none;
  @media (max-width: 1100px) {
    display: block;
  }
`;

const Logo = styled.img`
  position: fixed;
  top: 25px;
  left: 50%;
  margin-left: -50px;
  padding: 15px 20px;
  //box-sizing:border-box;
  width: 100px;
  z-index: 190;
  background: #fff;
  border-radius: 30px;
  box-shadow: 5px 5px 10px #dadada;
  &:hover {
    cursor: pointer;
  }
`;

const Main = styled.main`
  margin-top: 50px;
  margin: 0 auto;
  padding: 50px 0;
  @media (max-width: 1100px) {
    padding: 0;
  }
`;

const GlobalStyle = createGlobalStyle`
  body {
    // @media(max-width:1100px){
    //   overflow:hidden;
    // }
  }
`;
