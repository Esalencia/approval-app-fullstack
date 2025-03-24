import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";


import applicationRoutes from "./routes/applicationRoutes.js";
import createApplicationTable from "./data/createApplicationTable.js";
//import createUserTable from "./data/createUserTable.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

//Middleware
app.use(express.json());
app.use(cors());

//Routes
app.use("/api", applicationRoutes);

//error handling middleware
//app.use(errorHandling);

//Create table before starting server
//createUserTable();
createApplicationTable();

//testing db connection
app.get("/", async (req, res) => {
const result = await pool.query("SELECT current_database()");
res.send(`the database name is : ${result.rows[0].current_database}`)
});


//server running
app.listen(port, () => {
    console.log(`Server is running at port http:locahost:${port}`);
});
