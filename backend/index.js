const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const { initRepo } = require("./controllers/init");

yargs(hideBin(process.argv)).command("init", "Initialise a new repository", {}, initRepo).demandCommand(1, "You need at least one command").argv;