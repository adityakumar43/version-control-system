const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const { initRepo } = require("./controllers/init");
const { addRepo } = require('./controllers/add');
const { commitRepo } = require('./controllers/commit');
const { pushRepo } = require('./controllers/push');
const { pullRepo } = require('./controllers/pull');
const { revertRepo } = require('./controllers/revert');
const { error, assert } = require("console");

yargs(hideBin(process.argv))
    .command("start", "Starts a new server", {}, startServer)
    .command("init", "Initialise a new repository", {}, initRepo)
    .command("add <file>", "Add a file to the repository",
        (yargs) => {
            yargs.positional("file", {
                description: "File to add to the staging area",
                type: "string",
            });
        }, (argv) => {
            addRepo(argv.file);
        })
    .command("commit <message>", "Commit the staged files",
        (yargs) => {
            yargs.positional("message", {
                describe: "Commit message",
                type: "string",
            });
        }, (argv) => {
            commitRepo(argv.message);
        })
    .command("push", "push commit to S3", {}, pushRepo)
    .command("pull", "pull commit to S3", {}, pullRepo)
    .command("revert <commitID>", "Revert to a specific commit",
        (yargs) => {
            yargs.positional("commitID", {
                describe: "Commit ID to revert to",
                type: "string",
            });
        },
        (argv) => {
            revertRepo(argv.commitID);
        }
    )
    .demandCommand(1, "You need at least one command")
    .help().argv;


function startServer() {
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use(express.json());

    const mongoURI = process.env.MONGODB_URI;

    mongoose.connect(mongoURI)
        .then(() => console.log("MongoDB connected!"))
        .catch((error) => console.error("unable to connect :", error))

    app.use(cors({ origin: "*" }));
    app.get("/", (req, res) => {
        res.send("Welcome");
    });

    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        socket.on("joinRoom", (userID) => {
            user = userID;
            console.log("=========");
            console.log(user);
            console.log("=========");
            socket.join(userID);
        });
    });
    const db = mongoose.connection;
    db.once("open", async ()=>{
        console.log("CRUD operations called");
        //crud operations
    });

    httpServer.listen(port, ()=>{
        console.log(`Server is running on PORT ${port}`);
    });
}