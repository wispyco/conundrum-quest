import Head from "next/head";
import { magicClient } from "../lib/magic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled, {createGlobalStyle} from "styled-components";
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

  const [menuState, setMenuState] = useState(true)

  const toggleMenu = () =>{
    setMenuState((state)=> !state)
  }

  return (
    <>
      <Head>
        <title>Conundrum Quest</title>
        <meta
          name="description"
          content="A place to see the world’s hardest problems. 
          And who’s working on them."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content="/logo-3.png" />
      </Head>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        type="text/javascript"
      ></Script>
      <GlobalStyle/>
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@100;300;400;500;700&display=swap" />
      <Link href="/">
        <Logo src="/logo-3.png" />
      </Link>
      <Alpha>In Alpha</Alpha>
      <Menu onClick={toggleMenu}>Toggle Menu</Menu>
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

              <a href="">Were Open Source, see our naked code</a>
              <a href="">Feedback</a>
            </UserMenu>
          ) : (
            <UserMenu>
              <Link href="/login-magic-public">login / signup</Link>

              <a href="">Were Open Source</a>
              <a href="">Feedback</a>
            </UserMenu>
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

              <a href="">Were Open Source</a>
              <a href="">Feedback</a>
            </UserMenuMobile>
          ) : (
            <UserMenuMobile>
              <Link href="/login-magic-public">login / signup</Link>

              <a href="">Were Open Source, see our naked code</a>
              <a href="">Feedback</a>
            </UserMenuMobile>
          )}
        </>
      )}
      <Header1>Conundrum Quest</Header1>
      {Router.asPath === "/" && (
        <Title>
          <Header2>
            The World’s hardest problems & who is working on them.
          </Header2>
          <Link href="/login-magic-public">Join to Add a Quest</Link>
        </Title>
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

const Title = styled.div`
  a {
    text-align: center;
    display: block;
    margin: 25px auto;
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
`;

const Alpha = styled.span`
  position: fixed;
  top: 20px;
  left: 65px;
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
  top: 15px;
  right: 15px;
  display: grid;
  grid-row-gap: 10px;
  width: 150px;
  text-align: center;
  @media(max-width:1100px){
    display:none;
  }
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
const UserMenuMobile = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  display: grid;
  grid-row-gap: 10px;
  align-items:center;
  width: 100%;
  height:100vh;
  padding-top:100px;
  grid-template-rows: 50px 50px 50px 50px;
  background:#fff;
  z-index:100;
  text-align: center;
  @media(min-width:1100px){
    display:none;
  }
  button {
    padding: 10px;
    background: none;
    border: 1px solid #000;
    width:250px;
    border-radius:30px;
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
    width:250px;
    border-radius:30px;
    margin: 0 auto;
  }
`;

const Menu = styled.button`
  position: absolute;
  right: 0;
  z-index:200;
  top:0;
  display:none;
  @media(max-width:1100px){
    display:block;
  }
`

const Logo = styled.img`
  position: fixed;
  top: 0px;
  left: 0px;
  padding: 15px 20px;
  //box-sizing:border-box;
  width: 75px;
  z-index: 190;
  background: #fff;
  &:hover {
    cursor: pointer;
  }
`;

const Main = styled.main`
  margin-top: 50px;
  margin: 0 auto;
  padding: 50px 0;
`;

const GlobalStyle = createGlobalStyle`
  body {
    @media(max-width:1100px){
      overflow:hidden;
    }
  }
`;
