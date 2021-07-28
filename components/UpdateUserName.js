import { useForm } from "react-hook-form";
import styled from "styled-components";
import { UPDATE_USER_NAME } from "../gql/schema";

import { useMutation, useQuery } from "@apollo/client";

export default function UpdateUserName({user}) {

    const [updateUserName, { data: updateUserNameData, loading: savingName }] = useMutation(
        UPDATE_USER_NAME
      );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
      defaultValues:{
          name:user.name
      }
  });
  const onSubmit = async (data) => {
    const updateUserNameResponse = await updateUserName({
        variables: {
          id: user.id,
          name: data.name,
        }
        // refetchQueries: [{ query: GET_QUESTS }],
      }).catch(console.error);

  };
  console.log(errors);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h3>Update your Name</h3>
      <input type="text" placeholder="name" {...register("name", {})} />

      <input type="submit" />
    </Form>
  );
}

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
