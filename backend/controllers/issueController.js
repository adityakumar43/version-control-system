const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");


async function createIssue( req, res){
    const {id} = req.params;
    const {title, description} = req.body;
    try {
        const issue = new Issue({
        title,
        description,
        repository: id,
    });

    await issue.save();

    res.status(201).json(issue);

    } catch (error) {
        console.error("Error during issue creation:", error.message);
        res.status(500).send("Server error");
    }
};

async function updateIssueById( req, res){
    res.send("Issue updated!");
};

async function deleteIssueById( req, res){
    res.send("Issue delete!");
};

async function getAllIssuees( req, res){
    res.send("All Issues Fetched!");
};

async function getIssueById( req, res){
    res.send("Issue Details fetched!");
};

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssuees,
    getIssueById,
}