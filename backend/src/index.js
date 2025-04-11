import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import pool from "./config/db.js";
import bodyParser from 'body-parser';

import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import applicationStageRoutes from "./routes/applicationStageRoutes.js";
import workflowRoutes from "./routes/workflowRoutes.js";
import createApplicationTable from "./data/createApplicationTable.js";
import createApplicationStagesTable from "./data/createApplicationStages.js";
import createWorkflowTable from "./data/createWorkflowTable.js";
import createUsers, { createAdminUsers } from "./data/createUsers.js";
// import documentRoutes from "./routes/documentRoutes.js"
//import errorHandler from "./middlewares/errorMiddleware.js";
import inspectorRoutes from "./routes/inspectorRoutes.js"
import bcrypt from "bcryptjs";
// import createDocumentsTable from "./data/createDocuments.js";
//import createInspector  from "./data/createInspector.js";



dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

//Middleware
app.use(express.json());
app.use(cors()); // Only call this once
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Routes
app.use('/api/auth', authRoutes);
app.use('/api/inspectors', inspectorRoutes);
app.use('/api/applications', applicationRoutes); // More specific path
app.use('/api/application-stages', applicationStageRoutes);
app.use('/api/workflow', workflowRoutes); // New workflow routes
// app.use('/api/documents', documentRoutes)


//error handling middleware
//app.use(errorHandler);



//Create tables and initialize data before starting server
async function initializeDatabase() {
    try {
        // Create tables
        await createUsers();
        await createApplicationTable();
        await createApplicationStagesTable();
        await createWorkflowTable();
        // Create admin users (both admin and superadmin)
        await createAdminUsers();
        console.log('Database initialization completed');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

// Initialize the database
initializeDatabase();


//testing db connection
app.get("/", async (req, res) => {
const result = await pool.query("SELECT current_database()");
res.send(`the database name is : ${result.rows[0].current_database}`)
});


//server running
app.listen(port, () => {
    console.log(`Server is running at port http:locahost:${port}`);
});
