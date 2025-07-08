const app = require("../src/app");
require("dotenv").config();

const PORT = process.env.PORT;

//-----

app.listen(PORT, () => {
    console.log("Server Rodando em http://localhost:"+PORT);
})