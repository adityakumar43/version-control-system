const createIssue = ( req, res) => {
    res.send("Issue created!");
};

const updateIssueById = ( req, res) => {
    res.send("Issue updated!");
};

const deleteIssueById = ( req, res) => {
    res.send("Issue delete!");
};

const getAllIssuees = ( req, res) => {
    res.send("All Issues Fetched!");
};

const getIssueById = ( req, res) => {
    res.send("Issue Details fetched!");
};

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssuees,
    getIssueById,
}