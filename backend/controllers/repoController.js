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
            message: "Repository created!",
            repositoryID: result._id,
        });

    } catch (error) {
        console.error("Error during repository creation:", error.message);
        res.status(500).send("Server error");
    }
};

async function getAllRepositories(req, res) {
    try {
        const repositories = await Repository.find({}).populate("owner").populate("issues");
        res.json(repositories);
    } catch (error) {
        console.error("Error during fetching repositories:", error.message);
        res.status(500).send("Server error");
    }
};

async function fetchRepositoryById(req, res) {
    const { repoID } = req.params.id;
    try {
        const repository = await Repository.find({ _id: repoID })
            .populate("owner")
            .populate("issues");

        res.json(repository);
    } catch (error) {
        console.error("Error during fetching repositories:", error.message);
        res.status(500).send("Server error");
    }
};

async function fetchRepositoryByName(req, res) {
    const { name } = req.params;
    try {
        const repository = await Repository.find({ name })
            .populate("owner")
            .populate("issues");

        res.json(repository);
    } catch (error) {
        console.error("Error during fetching repositories:", error.message);
        res.status(500).send("Server error");
    }
};

async function fetchRepositoriesForCurrentUser(req, res) {
    const userId = req.user;
    try {
        const repositories = await Repository.find({ owner: userId });
        if (!repositories || repositories.length == 0) {
            return res.status(404).json({ error: "User Repositories not found!" });
        };
        res.json({ message: "Repositories found!", repositories });
    } catch (error) {
        console.error("Error during fetching repositories:", error.message);
        res.status(500).send("Server error");
    }
};

async function updateRepositoryById(req, res) {
    const { id } = req.params;
    const { content, description } = req.body;
    try {
        const repository = await Repository.findById(id);
        if (!repository) {
            return res.status(404).json({ error: "Repository not found!" });
        };

        repository.content.push(content);
        repository.description = description;

        const updatedRepository = await repository.save();
        res.json({
            message: "Repository updated successfully!",
            repository: updatedRepository,
        });

    } catch (error) {
        console.error("Error during updating repository:", error.message);
        res.status(500).send("Server error");
    }
};

async function toggleVisibilityById(req, res) {
    const { id } = req.params;

    try {
        const repository = await Repository.findById(id);
        if (!repository) {
            return res.status(404).json({ error: "Repository not found!" });
        };

        repository.visibility = !repository.visibility;

        const updatedRepository = await repository.save();
        res.json({
            message: "Repository visibility toggled successfully!",
            repository: updatedRepository,
        });

    } catch (error) {
        console.error("Error during toggling visibility:", error.message);
        res.status(500).send("Server error");
    }
};

async function deleteRepositoryById(req, res) {
    const {id} = req.params;
    try {
        const repository = await Repository.findByIdAndDelete(id);
        if(!repository){
            return res.status(404).json({ error: "Repository not found!" });
        };
        res.json({message:"Repository deleted successfully"});
    } catch (error) {
        console.error("Error during deleting repository:", error.message);
        res.status(500).send("Server error");
    }
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
