
var Weight = [];
for(let i = 0 ;i < 16 ;i++) {
 Weight[i] = []; 
for(let j = 0;j < 25 ;j++) {
 
 let randomNum = Math.round(Math.random() * 100 - 50) / 100;
 randomNum = parseFloat(randomNum.toFixed(2));
 Weight[i][j] = randomNum;
}
}
var SecondWeight = [];
for(let i = 0 ;i < 10 ;i++) {
 SecondWeight[i] = []; 
for(let j = 0;j < 16 ;j++) {
 let randomNum = Math.round(Math.random() * 100 - 50) / 100;
 randomNum = parseFloat(randomNum.toFixed(2));
 SecondWeight[i][j] = randomNum;
}
}

var answers = [];

var OutputLayers = [];

var maxIndex = 0;

var inputNeuro;
var SecondLayer = [];

let sum = 0;
var outputCount = 10;
let learningRate = 0.9;

const cells = document.querySelectorAll('#Table td');

cells.forEach(cell => {
cell.addEventListener('click', () => {
 if (cell.classList.contains('black')) {
   cell.classList.remove('black');
   cell.classList.add('white');
 } else {
   cell.classList.remove('white');
   cell.classList.add('black');
 }
});
});
function CreatMatrix() {
  let index = 0;
  let matrix = []
  for(let i = 0; i<5;i++) {
   matrix[i] = [];
     for(let j = 0;j < 5 ;j++){
     }
  }
  for(let i = 0;i < 5 ;i++) {
    for(let j = 0 ; j < 5;j++, index++) {
    if(cells[index].classList.contains('white')) {
      matrix[i][j] = 1;
    }
    else {
      matrix[i][j] = 0;
    }
    }
  }
  return matrix;
}
function Predict() {
let matrix = CreatMatrix()
inputNeuro = [];
for(let i = 0; i < matrix.length;i++) {
  for(let j = 0; j < matrix.length;j++) {
    inputNeuro.push(matrix[i][j]); 
  }
}



var layersCount = 1;
var layersNeuron = 16;


for(let i = 0;i < layersNeuron ; i++) {
  sum = 0;
  for(let j = 0;j < inputNeuro.length;j++) {
    sum += inputNeuro[j] * Weight[i][j];
  }
  SecondLayer[i] = 1 / (1 + Math.exp(-sum));
}


console.log(Weight)
console.log(inputNeuro);
console.log(SecondLayer);

for(let i = 0;i < 10 ; i++) {
 sum = 0;
 for(let j = 0;j < SecondLayer.length;j++) {
 sum += SecondLayer[j] * SecondWeight[i][j];
 }
 OutputLayers[i] = 1 / (1 + Math.exp(-sum));
}


console.log(OutputLayers);
 
let max = -10000;
for(let i = 0;i < 10 ;i++) {
  if(max < OutputLayers[i]) {
    max= OutputLayers[i];
    maxindex = i;
  }
}
alert(maxindex);

}

function Uncorrect() {
  OutputLayers[maxindex]=0;
  let max = -10000;
  for(let i = 0;i < 10 ;i++) {
    if(max < OutputLayers[i]) {
      max= OutputLayers[i];
      maxindex = i;
    }
  }
    console.log(OutputLayers);
  alert(maxindex);
}


function analize(){
  let tempsave = answers;
  let matrix = CreatMatrix();
  console.log(matrix);
  for(let i=0;i<answers.length;i++){
    console.log(answers[i]);
    if(correctmatrix(matrix, tempsave[i].x1)){
      alert(tempsave[i].x2);
    }
  }
}

function Correct(){
  let temp = maxindex;
  let tempmatrix = CreatMatrix();
  answers.push({x1 : tempmatrix, x2: temp})
  console.log(answers);
}

function correctmatrix(one,two){
  let count = true;
  console.log(one)
  console.log(two)
  for(let i=0;i<one.length;i++){
    for(let j=0;j<one.length;j++){
      if(one[i][j] !== two[i][j]){
        count=false;
      }
    }
  }
  return count;
}
