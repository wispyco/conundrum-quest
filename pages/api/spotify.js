// var SpotifyWebApi = require("spotify-web-api-node");
const axios = require("axios");
import qs from "qs";

export default async (req, res) => {
  console.log("req", req.query.id);

  const client_id = "189239b06d63481981ed50287f51ad29";
  const client_secret = process.env.CLIENT_SECRET_SPOTIFY;

  const serialize = function (obj) {
    var str = [];
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
    return str.join("&");
  };

  const str = client_id + ":" + client_secret;

  let auth = Buffer.from(str, "utf-8");

  auth = auth.toString("base64");

  let name = req.query.id;

  name = encodeURIComponent(name);

  console.log("name", name);

  const data = axios
    .post(
      "https://accounts.spotify.com/api/token",
      serialize({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          Authorization: "Basic " + auth,
        },
      }
    )
    .then((res) => {
      const test = axios
        .get(
          `https://api.spotify.com/v1/search?q=${name}&type=episode&market=US`,
          {
            headers: {
              Authorization: `Bearer ${res.data.access_token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(function (response) {
          // handle success
          // console.log(response.data.episodes);
          return response.data.episodes;
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });

      return test;
    })
    .catch((err) => {
      console.log(err);
    });

  const boy = async () => {
    // console.log("data", await data);
    res.status(200).json({ data: await data });
  };
  boy();
};
