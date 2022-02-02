const host = process.env.DB_IP || "localhost";
const user = process.env.DB_USERNAME || "root";
const password = process.env.DB_PASSWORD || "";

const Importer = require("mysql-import");
const importer = new Importer({ host, user, password });

importer.onProgress((progress) => {
  console.log(
    `${
      Math.floor((progress.bytes_processed / progress.total_bytes) * 10000) /
      100
    }% Completed`
  );
});

importer
  .import("data/songs.sql")
  .then(() => {
    console.log(`${importer.getImported().length} SQL file(s) imported.`);
  })
  .catch((err) => {
    console.error(err);
  });
