import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { GET_DAD_HATS_BY_USER_ID, UPDATE_USER } from "../gql/schema";
import { Header1 } from "../pages/profile";

const UpdateProfile = ({ user }) => {
  const [updateUser, { data: updateUserData, loading: saving }] = useMutation(
    UPDATE_USER,
    {
      update(cache, { data }) {
        // We use an update function here to write the
        // new value of the GET_ALL_TODOS query.
        const newUserResponse = data?.updateUser;
        console.log("newDadHatResponse", newUserResponse);
        // const existingDadHats = cache.readQuery({
        //   query: GET_DAD_HATS_BY_USER_ID,
        //   variables: { id: user.id },
        // });
        // console.log("existingDadHats", existingDadHats);

        if (newUserResponse) {
          cache.writeQuery({
            query: GET_DAD_HATS_BY_USER_ID,
            variables: { id: user.id },
            data: {
              findUserByID: {
                name: newUserResponse,
              },
            },
          });
        }
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
    console.log("user >>>>", user);
    const updateUserResponse = await updateUser({
      variables: {
        id: user.id,
        name: data.name,
      },
    }).catch(console.error);
  };
  console.log(errors);

  return (
    <ProfileName>
      <h3>Update your Profile Name</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="name" {...register("name", {})} />
        <input
          type="text"
          placeholder="Twitter Link"
          {...register("twitter", {})}
        />

        <input type="submit" />
      </form>
    </ProfileName>
  );
};

export default UpdateProfile;

const ProfileName = styled.div`
  position: absolute;
  top: 150px;
  width: 300px;
  left: 50%;
  margin-left: -150px;
`;
