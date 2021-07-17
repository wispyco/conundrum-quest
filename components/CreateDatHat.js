import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { CREATE_DAD_HAT, GET_DAD_HATS_BY_USER_ID } from "../gql/schema";

const CreateDadHat = ({ user, setShowCreateDadHat }) => {
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
    useMutation(CREATE_DAD_HAT, {
      update(cache, { data }) {
        // We use an update function here to write the
        // new value of the GET_ALL_TODOS query.
        const newDadHatResponse = data?.createDadHat;
        console.log("newDadHatResponse", newDadHatResponse);
        const existingDadHats = cache.readQuery({
          query: GET_DAD_HATS_BY_USER_ID,
          variables: { id: user.id },
        });
        console.log("existingDadHats", existingDadHats);

        if (newDadHatResponse && existingDadHats) {
          cache.writeQuery({
            query: GET_DAD_HATS_BY_USER_ID,
            variables: { id: user.id },
            data: {
              findUserByID: {
                hats: {
                  data: [
                    ...existingDadHats?.findUserByID?.hats?.data,
                    newDadHatResponse,
                  ],
                },
              },
            },
          });
        }
      },
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
    console.log("user >>>>", user);
    if (JSON.stringify(cloudLinks) === "[]") {
      alert("you forgot your image");
      return;
    }
    const createDadHatResponse = await createDadHat({
      variables: {
        connect: user.id,
        name: data.name,
        image: cloudLinks[0],
      },
    }).catch(console.error);

    setShowCreateDadHat(false);
  };
  console.log(errors);

  const close = () => {
    setShowCreateDadHat(false);
  };

  return (
    <CreateWrap>
      <button onClick={close}>X</button>
      <h3>Add StreetWear</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="name" {...register("name", {})} />

        <button
          type="button"
          onClick={clickMe}
          id="upload_widget"
          className="upload"
        >
          Choose Image
        </button>

        {JSON.stringify(cloudLinks) !== "[]" && (
          <div className="imgPreview">
            <button type="button" className="close" onClick={removeImage}>
              X
            </button>
            <img src={cloudLinks[0]} />
          </div>
        )}

        <input type="submit" />
      </form>
    </CreateWrap>
  );
};

export default CreateDadHat;

const CreateWrap = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  padding: 25px;
  background: #000;
  width: 300px;
  form {
    input {
      padding: 5px;
    }
    display: grid;
    grid-row-gap: 35px;
    .imgPreview {
      width: 250px;
      margin: 0 auto;
      position: relative;
      img {
        margin: 0 auto;
        display: block;
      }
      button {
        top: -10px;
        left: 40px;
        // margin-left: -10px;
        width: 25px;
        position: absolute;
      }
    }
  }
  img {
    width: 150px;
  }
  h3 {
    color: #fff;
  }
  pre {
    color: #fff;
  }
`;
