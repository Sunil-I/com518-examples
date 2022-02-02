const mysql = require("mariadb/callback");
const express = require("express");
const app = express();

const con = mysql.createConnection({
  host: "172.17.0.3",
  user: "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "wad",
});

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use(express.json());

app.get("/time", (req, res) => {
  res.send(`This request took ${new Date().getMilliseconds()} ms.`);
});

app.get("/songs", (req, res) => {
  con.query(`SELECT * FROM songs`, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: error });
    } else {
      res.json(results);
    }
  });
});

app.get("/songs/id/:song_id", (req, res) => {
  con.query(
    `SELECT * FROM songs WHERE id = ?`,
    [req.params.song_id],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: error });
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/songs/name/:song_name", (req, res) => {
  con.query(
    `SELECT * FROM songs WHERE title LIKE ?`,
    [req.params.song_name],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: error });
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/songs/:song_name/by/:artist_name", (req, res) => {
  con.query(
    `SELECT * FROM songs WHERE title LIKE ? AND artist LIKE ?`,
    [req.params.song_name, req.params.artist_name],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: error });
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/songs/by/:artist_name", (req, res) => {
  con.query(
    `SELECT * FROM songs WHERE artist LIKE ?`,
    [req.params.artist_name],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: error });
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/songs/buy", async (req, res) => {
  let { page } = req.query;
  // 10 results per page
  const perPage = 10;
  // parse page input and remove anything thats not a number
  if (page) page = parseInt(page.toString().replace(/[^0-9]/g, ""));
  // checks for page num and how many results
  if (!page) page = 1;
  // count how many songs we have in the database
  con.query("SELECT COUNT(*) FROM songs", (errors, fields, rows) => {
    // calculate number of pages needed
    const count = Object.values(fields[0])[0];
    const numberOfPages = Math.ceil(count / perPage);
    con.query(
      "SELECT * FROM songs LIMIT ? OFFSET ?",
      [perPage, perPage * page - perPage],
      (error, songs, fields) => {
        // render page
        return res.render("songs", {
          songs: songs,
          pages: numberOfPages,
          current: page,
          q: "",
        });
      }
    );
  });
});

app.delete("/songs/delete/:song_id", (req, res) => {
  const { song_id } = req.params;
  con.query(
    "SELECT * FROM songs WHERE ID = ?",
    [song_id],
    (error, results, fields) => {
      if (error) return res.status(500).send();
      if (!results.length) return res.status(404).send();
      const song = results[0];
      con.query(
        "DELETE FROM songs WHERE ID = ?",
        [song.ID],
        (errors, results, fields) => {
          if (error) return res.status(500).send();
          return res.send();
        }
      );
    }
  );
});

app.post("/songs/buy/:song_id", (req, res) => {
  const { song_id } = req.params;
  con.query(
    "SELECT * FROM songs WHERE ID = ?",
    [song_id],
    (error, results, fields) => {
      if (error)
        return res
          .status(500)
          .json({ success: false, message: "Server side error!" });
      if (!results.length)
        return res.status(404).json({
          success: false,
          message: "Could not find song with ID " + song_id,
        });
      const song = results[0];
      if (song.quantity - 1 < 0)
        return res.status(400).json({
          success: false,
          message: "Sorry we are out of stock for this item!",
        });
      con.query(
        "UPDATE songs SET quantity=quantity-1 WHERE ID = ?",
        [song.ID],
        (errors, results, fields) => {
          if (error)
            return res
              .status(500)
              .json({ success: false, message: "Server side error!" });
          return res.json({
            success: true,
            message:
              "Song has been bought, quantity has been decreased by one!",
          });
        }
      );
    }
  );
});

app.post("/songs/create", (req, res) => {
  const {
    title,
    artist,
    day,
    month,
    year,
    chart,
    likes,
    downloads,
    review,
    quantity,
  } = req.body;
  con.query(
    `INSERT INTO songs(title, artist, day, month, year, chart ,likes, downloads, review, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      artist,
      day,
      month,
      year,
      chart,
      likes,
      downloads,
      review,
      quantity,
    ],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: error });
      } else {
        res.json(results);
      }
    }
  );
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`[Express] Listening on port ${process.env.PORT || 4000}.`);
  con.connect((err) => {
    if (err) {
      console.log(`[MariaDB] Error connecting to database: ${err}`);
    } else {
      console.log("[MariaDB] Managed to connect to database.");
    }
  });
});
