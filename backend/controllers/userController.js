const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId, ReturnDocument } = require("mongodb");
const dotenv = require("dotenv");
var objectId = require("mongodb").ObjectId;

dotenv.config();
const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
    if (!client) {
        client = new MongoClient(uri, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        await client.connect();
    }
}




async function signup(req, res) {
    const { username, password, email } = req.body;
    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollections = db.collection("users");

        const user = await usersCollections.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "User already exists !" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUsers: [],
            starsRepos: [],
        }

        const result = await usersCollections.insertOne(newUser);

        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        res.json({ token });
    } catch (err) {
        console.error("Error during signup:", err.message);
        res.status(500).send("Server error");
    };
};

async function login(req, res) {
    const { email, password } = req.body;
    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollections = db.collection("users");

        const user = await usersCollections.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials !" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, userId: user._id });

    } catch (error) {
        console.error("Error during login :", error.message);
        res.status(500).send("Server error !");
    }
};


async function getAllUsers(req, res) {
    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollections = db.collection("users");

        const users = await usersCollections.find({}).toArray();
        res.json(users);
    } catch (error) {
        console.error("Error during fetching :", error.message);
        res.status(500).send("Server error !");
    }
};


async function getUserProfile(req, res) {
    const currentID = req.params.id;
    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollections = db.collection("users");

        const user = await usersCollections.findOne({
            _id: new ObjectId(currentID),
        });

        if (!user) {
            return res.status(400).json({ message: "User not found !" });
        }

        res.send(user, { message: "Profile fetched!" });

    } catch (error) {
        console.error("Error during fetching :", error.message);
        res.status(500).send("Server error !");
    }

};

async function updateUserProfile(req, res) {
    const currentID = req.params.id;
    const { email, password } = req.body;

    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollections = db.collection("users");

        let updateFields = { email };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }

        const result = await usersCollections.findOneAndUpdate(
            {
                _id: new ObjectId(currentID),
            },
            { $set: updateFields },
            { returnDocument: "after" }
        );
        if (!result) {
            return res.status(404).json({ message: "User not found" })
        }

        res.send(result);
        // console.log("findOneAndUpdate result:", result);

    } catch (error) {
        console.error("Error during updating :", error.message);
        res.status(500).send("Server error !");
    }
};

async function deleteUserProfile(req, res) {
    const currentID = req.params.id;
    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollections = db.collection("users");

        const result = await usersCollections.deleteOne({
            _id: new ObjectId(currentID),
        });

        if (result.deleteCount == 0) {
            return res.status(404).json({ message: "User not found" })
        };

        res.json({ message: "User Profile Deleted" });

    } catch (error) {
        console.error("Error during updating :", error.message);
        res.status(500).send("Server error !");
    }
};

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
}