import { useForm } from "react-hook-form";
import styled from "styled-components";
import { GET_QUESTS, UPDATE_USER_NAME } from "../gql/schema";
import Image from "next/image";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

export default function UpdateUserName({ user, setUserData }) {
  const [updateUserName, { data: updateUserNameData, loading: savingName }] =
    useMutation(UPDATE_USER_NAME);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user.name,
      twitter: user.twitter,
    },
  });
  const onSubmit = async (data) => {
    const updateUserNameResponse = await updateUserName({
      variables: {
        id: user.id,
        name: data.name,
        twitter: data.twitter,
        profileImage: cloudLinks,
      },
      // refetchQueries: [{ query: GET_QUESTS }],
    }).catch(console.error);
    setUserDetails(false);
    setUserData((value) => ({ ...value, name: data.name }));
  };
  console.log(errors);

  const [userDetails, setUserDetails] = useState(false);

  const toggleUserDetails = () => {
    setUserDetails((state) => !state);
  };

  const [cloudLinks, setCloudLinks] = useState(user?.profileImage);

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
        uploadPreset: `conundrum`,
        maxFiles: 1,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log(result.info.url);
          // setCloudLinks([...cloudLinks, result.info.url])
          setCloudLinks(result.info.url);
        }
      }
    );
    widget.open(); //
  };

  return (
    <>
      <UserDetailsToggle onClick={toggleUserDetails}>
        {!userDetails ? " Update Profile" : "X"}
      </UserDetailsToggle>
      {userDetails && (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h3>Update your Name</h3>
          <input type="text" placeholder="name" {...register("name", {})} />
          <input
            type="text"
            placeholder="Twitter url (https://twitter.com/anderskitson)"
            {...register("twitter", {})}
          />
          <button
            type="button"
            onClick={clickMe}
            id="upload_widget"
            className="upload"
          >
            Choose Profile Image
          </button>
          {cloudLinks && (
            <ImageWrap>
              <Image width="100" height="100" src={cloudLinks} />
            </ImageWrap>
          )}
          <input type="submit" />
        </Form>
      )}
    </>
  );
}

const ImageWrap = styled.div`
  object-fit: cover;
  img {
    border-radius: 50%;
  }
`;

const Form = styled.form`
  width: 400px;
  margin: 25px auto;
  text-align: center;
  display: grid;
  grid-row-gap: 20px;
  input {
    padding: 15px;
  }
`;

const UserDetailsToggle = styled.button`
  margin: 25px auto;
  width: 150px;
  padding: 20px;
  border-radius: 30px;
  display: block;
  background: #25cec8;
  color: #fff;
  border: none;
  &:hover {
    cursor: pointer;
  }
`;
