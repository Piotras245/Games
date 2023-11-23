const fs = require('fs-extra')

const express = require("express");
const path = require("path");

const PORT = 4000;

// const app = express();

// app.use(express.static(path.join(__dirname)));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

// app.listen(PORT, () => {
//   console.log("Server started");
// });
async function example2 (fileName, jsonObj) {
  try {
    await fs.writeJson(`./dbJSON/${fileName}.json`, jsonObj)
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}



async function example (fileName) {
  let response;
  try {
    const packageObj = await fs.readJson(`./dbJSON/${fileName}.json`)
    return packageObj;
    
  } catch (err) {
    console.error(err)
  }
  return null;
}

(async ()=>{
  let response = await example("Flappy");
  await example2("Pac",response);
  console.log(response);
  console.log(response[0]);
})();
