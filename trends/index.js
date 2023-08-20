const { ScoreCalc } = require("./score_calc/score_calc");

async function main() {
  const calc = new ScoreCalc();

  await calc.init();

  calc.calculateScores();
}

main();
