const express = require("express");
const mysql = require("mysql2");
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const initializeDbAndServer = () => {
  db.connect((err) => {
    if (err) {
      console.log(`DATABASE ERROR ${err}`);
      process.exit(1);
    }
    console.log("Database Connected Successfully");
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  });
};

app.post("/posttext", (req, res) => {
    const { text } = req.body;
    const createTextQuery = `
      INSERT INTO mytext (text)
      VALUES (${text})
    `;
  
    db.query(createTextQuery, (err, results) => {
      if (err) {
        console.log(`DB ERROR : ${err}`);
        res.status(500).json({ error: "Internal Error" });
      } else {
        res.send(results);
      }
    });
  });
  
  

app.get("/gettext", (req, res) => {
  const getTextQuery = `
    SELECT *
    FROM mytext
    ORDER BY id
    `;

  db.query(getTextQuery, (err, results) => {
    if (err) {
      console.log(`DB ERROR : ${err}`);
      res.status(500).json({ error: "Internal Error" });
    } else {
      res.send(results);
    }
  });
});






initializeDbAndServer();
