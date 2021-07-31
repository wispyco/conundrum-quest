import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { CREATE_QUEST, GET_QUESTS_BY_USER_ID } from "../gql/schema";

export default function CreateQuest({ user, clickedAddQuest }) {
  const [createQuest, { data: createQuestData, loading: saving }] = useMutation(
    CREATE_QUEST,
    {
      update(cache, { data }) {
        // We use an update function here to write the
        // new value of the GET_ALL_TODOS query.
        const newQuestResponse = data?.createQuest;
        const existingQuests = cache.readQuery({
          query: GET_QUESTS_BY_USER_ID,
          variables: { id: user.id },
        });
        if (newQuestResponse && existingQuests) {
          cache.writeQuery({
            query: GET_QUESTS_BY_USER_ID,
            variables: { id: user.id },
            data: {
              findUserByID: {
                quests: {
                  data: [
                    ...existingQuests?.findUserByID?.quests?.data,
                    newQuestResponse,
                  ],
                },
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
    const {
      name,
      description,
      heroName,
      heroDescription,
      heroWebsite,
      heroTwitter,
      category,
    } = data;

    const createQuestResponse = await createQuest({
      variables: {
        ownerConnect: user.id,
        name: name,
        description: description,
        image: "https://google.com",
        // heroName: heroName,
        // heroDescription: heroDescription,
        // heroWebsite: heroWebsite,
        // heroTwitter: heroTwitter,
        heroAvatar: "https://google.com",
        // knightName: user.name,
        // knightConnect: user.id,
        category: category,
      },
    }).catch(console.error);

    clickedAddQuest();
  };
  console.log(errors);

  return (
    <>
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
          <option value="HEALTHCARE_LIFE_SCIENCES">
            Healthcare + Life Sciences
          </option>
          <option value="TRANSPORTATION_URBAN_INFRASTRUCTURE">
            Transportation + Urban Infrastructure
          </option>
          <option value="DIGITAL_IMMERSIVE_LEARNING_THERAPIES_AMBIENT_COMPUTING">
            Digital Immersive Learning / Therapies + Ambient Computing
          </option>
        </select>
        {/* <h2>Hero</h2>
        <input
          type="text"
          placeholder="Hero Name"
          {...register("heroName", {})}
        />
        <h2>Hero Bio</h2>
        <textarea placeholder="Hero Bio" {...register("heroDescription", {})} />
        <h2>Hero Website</h2>
        <input
          type="text"
          placeholder="Hero Website"
          {...register("heroWebsite", {})}
        />
        <h2>Hero Twitter</h2>
        <input
          type="text"
          placeholder="Hero Twitter"
          {...register("heroTwitter", {})}
        /> */}

        <input type="submit" />
      </Form>
      <pre>{JSON.stringify(createQuestData, null, 2)}</pre>
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
