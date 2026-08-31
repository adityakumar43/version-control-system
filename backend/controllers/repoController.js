const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");


async function createRepository(req, res){
    res.send("Repository created!");
};

async function getAllRepositories(req, res){
    res.send("All Repositories fetched!");
};

async function fetchRepositoryById(req, res){
    res.send("Repository details fetched!");
};

async function fetchRepositoryByName(req, res){
    res.send("Repository details fetched!");
};

async function fetchRepositoriesForCurrentUser(req, res){
    res.send("Repositories for logged in user fetched!");
};

async function updateRepositoryById(req, res){
    res.send("Repository updated!");
};

async function toggleVisibilityById(req, res){
    res.send("Visibility toggled!");
};

async function deleteRepositoryById(req, res){
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
