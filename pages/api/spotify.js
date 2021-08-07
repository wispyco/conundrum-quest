var Spotify = require('spotify-web-api-js');
var s = new Spotify();
//s.searchTracks()...

export default async (req, res) => {
    console.log(req.body);
    res.send(200)
  };