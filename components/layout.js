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
import Cookies from "js-cookie";
import Image from "next/image";
import { Analytics } from '@vercel/analytics/react';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Layout({ children }) {
  const Router = useRouter();

  // console.log("ctx", ctx);

  const logout = () => {
    magicClient.user.logout().then(async (test) => {
      // console.log(await magicClient.user.isLoggedIn()); // => `false`
      // const res = await fetch("/api/logout", {
      //   method: "GET",
      // });

      Cookies.remove("fauna_client");

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

  if (!user) return <Loading />;

  return (
    <>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        type="text/javascript"
      ></Script>
      <GlobalStyle />
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@100;300;400;500;700&display=swap" />
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Hahmlet:wght@100;300;500&display=swap" />
      {/* <Link href="/">
        <Logo src="/logo-5.png" />
      </Link> */}
      <Alpha>In Alpha</Alpha>
      <Menu onClick={toggleMenu}>
        {menuState ? <AiOutlineMenu size={40} /> : <GrClose size={40} />}
      </Menu>
      {menuState ? (
        <>
          {userMenu ? (
            <Nav>
              <Header1>Conundrum Quest</Header1>
              <Link href="/">
                <Logo src="/logo-5.png" />
              </Link>
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
            </Nav>
          ) : (
            <Nav>
              <Header1>Conundrum Quest</Header1>
              <Link href="/">
                <Logo src="/logo-5.png" />
              </Link>
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
            </Nav>
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
      {/* <Header1>Conundrum Quest</Header1> */}
      {Router.pathname === "/" && (
        <Title>
          <div>
            <Header2 className="title">
              {/* <em>T</em>he <span>Worlds</span> hardest problems and who is
              working on them. */}
              <em>A</em> place to see who is working on hard problems and new
              ideas.
            </Header2>
          </div>
          <HeroIconGrid>
            <div className="img">
              <p>Paul’s is working on bringing communities together</p>
              <Image src="/paul.png" width="97.59px" height="146.29px" />
            </div>
            <div className="img">
              <p>Kate is working on new way’s to Electrify the world</p>
              <Image src="/kate.png" width="97px" height="150px" />
            </div>
          </HeroIconGrid>
          <Link href="/login-magic-public">Join to Add a Quest</Link>
        </Title>
      )}
      <Main>{children}</Main>
      <Analytics />

      <Made>
        <Header2>
          Made for the <ImEarth /> and its <IoIosPeople />
        </Header2>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.conundrum-public.quest"
        >
          Updates, Roadmap, Expenses, Project Board, Income, Public posts,
          Analytics, Public Roam, and Figma
        </a>
        <Link href="/privacy-policy">Privacy Policy</Link>
        <a href="https://wispy.co">by wispy.co</a>
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

const HeroIconGrid = styled.div`
  display: grid;
  width: 800px;
  margin: 0 auto;
  grid-template-columns: 400px 400px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    width: 100%;
  }
  p {
    text-align: center;
    width: 50%;
    margin: 0 auto;
    line-height: 22px;
    padding-bottom: 10px;
  }
  .img {
    text-align: center;
    margin-top: 25px;
  }
`;

const NavButton = styled.button``;

const Nav = styled.div`
  display grid;
  grid-template-columns: 450px 300px 1fr;
  width:1200px;
  margin: 0 auto;
  align-items:center;
  position:fixed;
  left:50%;
  margin-left:-600px;
  top:0;
  background:#fff;
  z-index:100;
  justify-items:center;
  @media(max-width:1560px){
    width:1100px;
    margin-left:-550px;
    grid-template-columns: 450px 150px 1fr;
  }
  @media(max-width:1150px){
    grid-template-columns: 1fr;
    grid-row-gap:25px;
  }
  @media (-webkit-min-device-pixel-ratio: 2) and (min-width:2500px)   {
    width:3000px;
    padding-top:50px;
    margin-left:-1500px;
    grid-template-columns: 1350px 250px 1350px;
    img{
      justify-self:center;
      display:block;
    }
    div{
      justify-self:self-start;
    }
    h1{
      font-size:40px;
      justify-self:self-end;
    }
  }
`;

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
  @media (max-width: 1600px) {
    top: 100px;
    padding: 100px;
  }
  @media (max-width: 1100px) {
    padding: 0;
    width: 300px;
    margin-left: -150px;
    top: 100px;
    background: none;
  }
`;

const Title = styled.div`
  margin: 100px auto -102px auto;
  background: url(/banner.jpeg);
  background: url(/mountain-lines-1.png);
  background-size: 575px;
  background-repeat: no-repeat;
  background-position: center 100px;
  /* height: 400px; */
  // background-attachment: fixed;
  padding: 300px 0 173px 0;
  color: #000;
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

const Made = styled.div`
  margin-top: 50px;
  display: block;
  margin-bottom: 50px;
  span {
    color: #000;
  }
  p {
    &:hover {
      text-decoration: underline;
    }
  }
  text-align: center;
  display: grid;
  a {
    color: #000;
    padding: 10px;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Alpha = styled.span`
  position: fixed;
  background: #a7a7a7;
  color: #fff;
  text-transform: uppercase;
  /* border-radius: 30px; */
  z-index: 990;
  padding: 3px;
  font-size: 12px;
  top: 67px;
  left: 50%;
  width: 100px;
  text-align: center;
  margin-left: -91px;
  /* box-shadow: 5px 5px 10px #dadada; */
  transform: rotate(-90deg);
  display: none;
`;

const Header2 = styled.h2`
  text-align: center;
  span {
    color: #fff;
    background: #000;
    padding: 5px;
    border-radius: 10px;
    @media (max-width: 1100px) {
      color: #fff;
      background: none;
    }
  }
  font-family: "Hahmlet", serif;
  font-weight: 100;
  &.title {
    em {
      font-size: 64px;
      letter-spacing: 6px;
      color: #000;
      @media (max-width: 620px) {
        color: #fff;
      }
    }
    font-weight: 300;
    // background: #d3d3d363;
  }
  border-radius: 10px;
  font-size: 46px;
  width: 900px;
  @media (-webkit-min-device-pixel-ratio: 2) and (min-width: 2500px) {
    width: 1400px;
    font-size: 86px;
  }
  @media (max-width: 1100px) {
    width: 75%;
    color: #000;
    font-size: 30px;
    // background: #d3d3d3c7;
    padding-bottom: 20px;
    margin-top: 50px;
    &.title em {
      color: #000;
    }
    span {
      color: #000;
    }
  }
  margin: 75px auto;
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
  //position: fixed;
  background: #fff;
  //top: 0px;
  // right: 0px;
  //left: 50%;
  //padding: 80px 0px 0 75px;
  z-index: 100;
  display: grid;
  grid-template-columns: 60px 110px 110px 110px 150px;
  // grid-row-gap: 10px;
  //width: 50%;
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
  @media (-webkit-min-device-pixel-ratio: 2) and (min-width: 2500px) {
    grid-template-columns: 200px 200px 250px 275px 200px;
    a,
    button {
      font-size: 36px;
    }
  }
`;
const UserMenuOut = styled.div`
  //position: fixed;
  background: #fff;
  top: 0px;
  //right: 0px;
  //left: 50%;
  //padding: 25px 0 35px 50px;
  z-index: 100;
  display: grid;
  grid-template-columns: 150px 100px 175px 150px;
  // grid-row-gap: 10px;
  //width: 100%;
  align-items: center;
  text-align: center;
  @media (max-width: 1250px) {
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
  @media (-webkit-min-device-pixel-ratio: 2) and (min-width: 2500px) {
    grid-template-columns: 250px 200px 350px 350px;
    a,
    button {
      font-size: 36px;
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
  z-index: 300;
  text-align: center;
  @media (min-width: 1250px) {
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
  position: fixed;
  right: 15px;
  z-index: 400;
  top: 15px;
  background: none;
  border: none;
  display: none;
  @media (max-width: 1250px) {
    display: block;
  }
`;

const Logo = styled.img`
  //position: fixed;
  //top: 25px;
  //left: 50%;
  //margin-left: -50px;
  padding: 2px;
  //box-sizing:border-box;
  width: 100px;
  z-index: 890;
  margin-top: 25px;
  // background: #fff;
  border-radius: 50%;

  box-shadow: 5px 5px 10px #dadada;
  &:hover {
    cursor: pointer;
  }
  @media (max-width: 1100px) {
    margin-top: 0;
  }
  @media (-webkit-min-device-pixel-ratio: 2) and (min-width: 2500px) {
    // img{
    width: 150px;
    // }
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
  *{
    //border: 1px solid aqua;
  }
`;
