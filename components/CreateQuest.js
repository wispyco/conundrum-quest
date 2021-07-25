import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import styled from "styled-components"
import { CREATE_QUEST } from "../gql/schema";

export default function CreateQuest({user}){

    const [createQuest, { data: createQuestData, loading: saving }] =
    useMutation(CREATE_QUEST);

    const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = async data => {
    const { name, description, heroName, heroDescription, heroWebsite, heroTwitter } = data;

    const createQuestResponse = await createQuest({
      variables: {
        ownerConnect: user.id,
        name: name,
        description: description,
        image: "https://google.com",
        heroName: heroName,
        heroDescription: heroDescription,
        heroWebsite: heroWebsite,
        heroTwitter: heroTwitter,
        heroAvatar: "https://google.com",
        knightName: user.name,
        knightConnect: user.id,
      },
    }).catch(console.error);
  }
  console.log(errors);
  
  return (
    <>
    <h1>Add a Quest</h1>
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h2>Title</h2>
      <input type="text" placeholder="title" {...register("name", {})} />
      <h2>Description</h2>
      <textarea {...register("description", {})} />
      <h2>Hero</h2>
      <input type="text" placeholder="Hero Name" {...register("heroName", {})} />
      <h2>Hero Bio</h2>
      <textarea {...register("heroDescription", {})} />
      <input type="text" placeholder="heroWebsite" {...register("heroWebsite", {})} />
      <input type="text" placeholder="heroTwitter" {...register("heroTwitter", {})} />

      <input type="submit" />
    </Form>
    <pre>
        {JSON.stringify(createQuestData,null,2)}
    </pre>
    </>
  );
}

const Form = styled.form`
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-row-gap: 20px;
    input,
    select {
        padding: 10px;
    }
`