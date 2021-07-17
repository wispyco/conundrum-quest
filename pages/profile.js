import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { gql, useMutation, useQuery } from "@apollo/client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import { useRouter } from "next/router";
import { magicClient } from "../lib/magic";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { useForm } from "react-hook-form";
import DadHats from "../components/DadHats";

export const GET_DAD_HAT = gql`
  query FindUserByID($id: ID!) {
    findUserByID(id: $id) {
      _id
      hats {
        data {
          name
          image
          _id
        }
      }
    }
  }
`;

export const CREATE_DAD_HAT = gql`
  mutation CreateDadHat($connect: ID!, $name: String!, $image: String!) {
    createDadHat(
      data: { name: $name, image: $image, owner: { connect: $connect } }
    ) {
      name
      image
    }
  }
`;

const fetcher = (url) => fetch(url).then((r) => r.json());

function useAuth() {
  const { data: user, error, mutate } = useSWR("/api/user", fetcher);

  const loading = user?.token === false || user === undefined;

  return {
    user,
    loading,
    error,
  };
}

export default function Profile() {
  const { user, loading } = useAuth();

  return (
    <Layout>
      <main>
        {loading ? (
          <ImageRotate>
            <img src="/logo-3.png" />
          </ImageRotate>
        ) : (
          <>
            <Data user={user} />
            <CreateDadHat user={user} />
          </>
        )}
      </main>
    </Layout>
  );
}

const CreateDadHat = ({ user }) => {
  const [cloudLinks, setCloudLinks] = useState([]);

  const clickMe = () => {
    const isBrowser = typeof window !== "undefined";

    if (!isBrowser) {
      return;
    }
    console.log(window.cloudinary); //
    let widget = window.cloudinary.createUploadWidget(
      {
        cloudName: `kitson-co`,
        sources: ["local", "url"],
        uploadPreset: `dadHats`,
        maxFiles: 1,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          // console.log(result.info.url)
          // setCloudLinks([...cloudLinks, result.info.url])
          setCloudLinks((state) => [...state, result.info.url]);
        }
      }
    );
    widget.open(); //
  };

  const removeImage = (e) => {
    const arrayIndex = e.target.getAttribute("name");
    // console.log(cloudLinks)
    // console.log(cloudLinks[arrayIndex])
    setCloudLinks(cloudLinks.filter((item) => item !== cloudLinks[arrayIndex]));
  };

  const [createDadHat, { data: createDadHatData, loading: saving }] =
    useMutation(CREATE_DAD_HAT);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
    console.log("user >>>>", user);
    const createDadHatResponse = await createDadHat({
      variables: {
        connect: user.id,
        name: data.name,
        image: cloudLinks[0],
      },
    }).catch(console.error);
  };
  console.log(errors);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="name" {...register("name", {})} />

        <input type="submit" />
      </form>
      {cloudLinks &&
        cloudLinks.map((img, i) => {
          return (
            <div className="imgPreview" key={i}>
              <button className="close" name={i} onClick={removeImage}>
                X
              </button>
              <img src={img} />
            </div>
          );
        })}

      <button
        type="button"
        onClick={clickMe}
        id="upload_widget"
        className="upload"
      >
        Upload files
      </button>
    </>
  );
};

const Data = ({ user }) => {
  const { loading, error, data } = useQuery(GET_DAD_HAT, {
    variables: { id: user.id },
  });

  if (loading) return <h1>Loading Data...</h1>;

  if (error) return <h1>{error.message}</h1>;

  return (
    <>
      {data && <DadHats data={data} />}
      <pre>{JSON.stringify(data?.findUserByID?.hats, null, 2)}</pre>
    </>
  );
};

const rotation = keyframes`
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

const ImageRotate = styled.div`
  width: 149px;
  height: 149px;
  left: 50%;
  margin-left: -74.5px;
  top: 25%;
  position: fixed;

  animation: ${rotation} 2s infinite linear;
`;
