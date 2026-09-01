const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");


async function createRepository(req, res) {
    const { owner, name, issues, content, description, visibility } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ message: "Repository name is required!" });
        }
        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ message: "Invalid user ID!" });
        }

        const newRepository = new Repository({
            name, 
            description, 
            visibility, 
            content, 
            issues, 
            owner,
        });

        const result = await newRepository.save();

        res.status(201).json({
            message:"Repository created!",
            repositoryID: result._id,
        });

    } catch (error) {
        console.error("Error during repository creation:", error.message);
        res.status(500).send("Server error");
    }
};

async function getAllRepositories(req, res) {
    res.send("All Repositories fetched!");
};

async function fetchRepositoryById(req, res) {
    res.send("Repository details fetched!");
};

async function fetchRepositoryByName(req, res) {
    res.send("Repository details fetched!");
};

async function fetchRepositoriesForCurrentUser(req, res) {
    res.send("Repositories for logged in user fetched!");
};

async function updateRepositoryById(req, res) {
    res.send("Repository updated!");
};

async function toggleVisibilityById(req, res) {
    res.send("Visibility toggled!");
};

async function deleteRepositoryById(req, res) {
    res.send("Repository deleted!");
};

module.exports = {
    createRepository,
    getAllRepositories,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoriesForCurrentUser,
    updateRepositoryById,
    toggleVisibilityById,
    deleteRepositoryById,
}
