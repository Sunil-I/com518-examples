const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));

app.get("/time", (req, res) => {
  res.send(`This request took ${new Date().getMilliseconds()} ms.`);
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Listening on port ${process.env.PORT || 4000}.`);
});
