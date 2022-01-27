const express = require("express");
const app = express();
const songs = require("./data/songs.json");

app.use(express.static(__dirname + "/public"));

app.get("/time", (req, res) => {
  res.send(`This request took ${new Date().getMilliseconds()} ms.`);
});

app.get("/artist/:artist_name", (req, res) => {
  const tracks = songs.filter(
    (song) =>
      song.artist.toLocaleLowerCase() ==
      req.params.artist_name.toLocaleLowerCase()
  );

  res.json({
    message: `You are searching for songs by ${req.params.artist_name}.`,
    data: tracks,
  });
});

app.get("/artist/:artist_name/song/:song_name", (req, res) => {
  const tracks = songs.filter(
    (song) =>
      song.artist.toLocaleLowerCase() ==
        req.params.artist_name.toLocaleLowerCase() &&
      song.name.toLocaleLowerCase() == req.params.song_name.toLocaleLowerCase()
  );

  res.json({
    message: `You are searching for ${req.params.song_name} by ${req.params.artist_name}.`,
    data: tracks,
  });
});

app.get("/from/:year1/to/:year2", (req, res) => {
  const tracks = songs.filter(
    (song) => song.year >= req.params.year1 && song.year <= req.params.year2
  );
  res.json({
    message: `You are searching for songs from ${req.params.year1} to ${req.params.year2}.`,
    data: tracks,
  });
});

app.get("/topSongs", (req, res) => {
  res.send(songs);
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Listening on port ${process.env.PORT || 4000}.`);
});
