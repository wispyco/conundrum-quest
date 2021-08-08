// var SpotifyWebApi = require("spotify-web-api-node");
const axios = require("axios");
import qs from "qs";

// credentials are optional
// var spotifyApi = new SpotifyWebApi({
//   clientId: "189239b06d63481981ed50287f51ad29",
//   clientSecret: "fdb8dc03865949dfb633af12c71e3b87",
// });

export default async (req, res) => {
  // const str = `189239b06d63481981ed50287f51ad29:fdb8dc03865949dfb633af12c71e3b87`;

  // let auth = Buffer.from(str, "utf-8");

  // auth = auth.toString("base64");

  // axios({
  //   method: "post",
  //   url: "https://accounts.spotify.com/api/token",
  //   data: {
  //     grant_type: "client_credentials",
  //   },
  //   headers: { Authorization: `Basic ${auth}` },
  // })
  //   .then((res) => {
  //     console.log(`statusCode: ${res.status}`);
  //     console.log(res);
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });

  //Stack overflow https://stackoverflow.com/questions/62682783/getting-http-415-unsupported-media-type-during-authorization-in-the-spotify-api

  const client_id = "189239b06d63481981ed50287f51ad29";
  const client_secret = "fdb8dc03865949dfb633af12c71e3b87";

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

  axios
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
      axios
        .get(
          "https://api.spotify.com/v1/search?q=conor%20white%20sullivan&type=episode&market=US",
          {
            headers: {
              Authorization: `Bearer ${res.data.access_token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(function (response) {
          // handle success
          console.log(response.data.episodes);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          // always executed
        });
    })
    .catch((err) => {
      console.log(err);
    });

  res.status(200).json({ test: "hello" });
};
