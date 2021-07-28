import { useMutation, useQuery } from "@apollo/client";
import Router from "next/dist/server/router";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { GET_QUEST_BY_ID, UPDATE_QUEST } from "../gql/schema";
import Loading from "./Loading";

export default function EditQuestMod({ user, data, Router }) {
  const [updateQuest, { data: updateQuestData, loading: saving }] =
    useMutation(UPDATE_QUEST);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: data.findQuestByID.name,
      description: data.findQuestByID.description,
      category: data.findQuestByID.category,
      // isBeingReviewed: JSON.stringify(data.findQuestByID.isBeingReviewed),
      isAccepted: JSON.stringify(data.findQuestByID.isAccepted),
    },
  });
  const onSubmit = async (dataSubmit) => {
    const { name, description, category, isBeingReviewed, isAccepted } = dataSubmit;

    const isBeingReviewedSet = isBeingReviewed === "true";
    const isAcceptedSet = isAccepted === "true";

    const updateQuestResponse = await updateQuest({
      variables: {
        id: Router.query.id,
        ownerConnect: data.findQuestByID.owner._id,
        name: name,
        description: description,
        image: "https://google.com",
        // heroName: heroName,
        isAccepted: isAcceptedSet,
        // isBeingReviewed: isBeingReviewedSet,
        // heroDescription: heroDescription,
        // heroWebsite: heroWebsite,
        // heroTwitter: heroTwitter,
        // heroAvatar: "https://google.com",
        knightName: user.name,
        knightConnect: user.id,
        category: category,
      },
    }).catch(console.error);

    Router.push("/profile");
  };
  console.log(errors);

  return (
    <>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>Title</h2>
        <input
          type="text"
          placeholder="Is the food we eat scalable, sustainable, healthy, nutritious and tasty?"
          {...register("name", {})}
        />
        <h2>Description</h2>
        <textarea
          placeholder="Food and climate change are linked in complicated ways. The global food industry requires an enormous amount of energy to cultivate, transport, store, prepare, and serve foods. This leads to lots of greenhouse gases, and, in the process, soils, rivers, oceans, forests, and more, are often degraded and destroyed."
          {...register("description", {})}
        />
        <h2>Category</h2>
        <select {...register("category", {})}>
          <option value="SUSTAINABILITY_HUMAN_DEVELOPMENT">
            Sustainability + Human Development
          </option>
          <option value="TECHNOLOGY_INFRASTRUCTURE_ARTIFICIAL_INTELLIGENCE">
            Technology Infrastructure + Artificial Intelligence
          </option>
        </select>
        {/* <h2>In Review</h2> */}
        {/* Not reviewing yet
        <input
          {...register("isBeingReviewed", {})}
          type="radio"
          value="false"
        />
        Reviewing
        <input {...register("isBeingReviewed", {})} type="radio" value="true" /> */}
        <h2>Is Accepted</h2>
        Not Accepted
        <input {...register("isAccepted", {})} type="radio" value="false" />
        Accepted
        <input {...register("isAccepted", {})} type="radio" value="true" />
        <input type="submit" />
      </Form>
    </>
  );
}

const Form = styled.form`
  width: 75%;
  margin: 0 auto;
  display: grid;
  grid-row-gap: 20px;
  input,
  select,
  textarea {
    padding: 10px;
    line-height: 20px;
  }
`;
