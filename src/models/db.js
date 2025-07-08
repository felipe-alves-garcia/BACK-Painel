const mongoose = require("mongoose");
require("dotenv").config();
//import mongoose from "mongoose"   --> Pode ser assim também

const urlDB = process.env.DB_URL;

async function conexaoDB (){
    mongoose.connect(urlDB);
}

module.exports = { conexaoDB };