const tj = require("tabtojsonobj");
const fs = require('fs');

let text = fs.readFileSync('./test.txt').toString();
let j1 = tj.tabtojsonObj(text);
console.log(JSON.stringify(j1, undefined, "\t"));