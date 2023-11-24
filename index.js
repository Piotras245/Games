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
const writeToJSONFile = async (fileName, jsonObj) => {
  try {
    await fs.writeJson(`./dbJSON/${fileName}.json`, jsonObj)
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}

const readJSONFile = async (fileName) => {
  let response;
  try {
    const packageObj = await fs.readJson(`./dbJSON/${fileName}.json`)
    return packageObj;
    
  } catch (err) {
    console.error(err)
  }
  return null;
}

const addFlappyScore = async (newScore, scoreList) => {

  let response = await readJSONFile("Flappy");
  let newScoreList = [...scoreList, newScore];

  const scoreSorted = newScoreList.slice().sort((a, b) => b.score - a.score);
  newScoreList = scoreSorted.slice(0, 10);

  await writeToJSONFile("Flappy", newScoreList);
  return true;
}

const addStickScore = async (newScore, scoreList) => {

  let response = await readJSONFile("Stick");
  let newScoreList = [...scoreList, newScore];

  const scoreSorted = newScoreList.slice().sort((a, b) => b.score - a.score);
  newScoreList = scoreSorted.slice(0, 10);

  await writeToJSONFile("Stick", newScoreList);
  return true;
}

const addMemoryScore = async (newScore, scoreList) => {

  let response = await readJSONFile("Mem");
  let newScoreList = [...scoreList, newScore];

  const scoreSorted = newScoreList.slice().sort((a, b) => b.score - a.score);
  newScoreList = scoreSorted.slice(0, 10);

  await writeToJSONFile("Mem", newScoreList);
  return true;
}

const addPacmanScore = async (newScore, scoreList) => {

  let response = await readJSONFile("Pac");
  let newScoreList = [...scoreList, newScore];

  const scoreSorted = newScoreList.slice().sort((a, b) => b.score - a.score);
  newScoreList = scoreSorted.slice(0, 10);

  await writeToJSONFile("Pac", newScoreList);
  return true;
}

(async ()=>{
  try {
    const newScoreFlappy = { name: "Piter", score: 100 };
    const scoreListFlappy = await readJSONFile("Flappy");

    const resultFlappy = await addFlappyScore(newScoreFlappy, scoreListFlappy);
    // console.log(resultFlappy);

    const newScoreStick = { name: "Joshep", score: 150 };
    const scoreListStick = await readJSONFile("Stick");

    const resultStick = await addStickScore(newScoreStick, scoreListStick);
    // console.log(resultStick);

    const newScoreMemory = { name: "Micky", time: 25, flips: 40 };
    const scoreListMemory = await readJSONFile("Mem");
    
    const resultMemory  = await addMemoryScore(newScoreMemory, scoreListMemory);
    // console.log(resultMemory);


    const newScorePacman = { name: "Marian", time: 25, score: 300 };
    const scoreListPacman = await readJSONFile("Pac");
    
    const resultPacman = await addPacmanScore(newScorePacman, scoreListPacman);
    // console.log(resultPacman);


  } catch (error) {
    console.error(error);
  }

})();
