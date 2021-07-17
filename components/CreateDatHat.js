import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { CREATE_DAD_HAT } from "../gql/schema";

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
    <CreateWrap>
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
`;
