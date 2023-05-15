const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");
const size_window = innerWidth;
if(innerWidth < 1000){
  canvas.height=400;
  canvas.width=400;
} else{
  canvas.height=700;
  canvas.width=700;
}
ctx.fillStyle = "#fff"; 
ctx.fillRect(0, 0, canvas.width, canvas.height); 
let count = 0;
let populationCount = 2100;

let Points = [];
let population = [];
let res = 0;
let min = 1000000;
let childgen = 1200;
let iteration = 0;

let min1=0;
let fitness = []

let MutRate = 0.9;

window.addEventListener(`resize`, event => {
  if(window.innerWidth < 1000){
    canvas.height=400;
    canvas.width=400;
    ctx.fillStyle = "#fff"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    Points = []; 
  } else {
    canvas.height=700;
    canvas.width=700;
    ctx.fillStyle = "#fff"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
    Points = [];
  }
}, false);

canvas.addEventListener("click", function(event) {
 
  
    let x = event.offsetX;
    let y = event.offsetY;
    
    
    ctx.fillStyle = "black"; 
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2, true); 
    ctx.fill(); 
    Points.push({x: x, y: y});
  });

  function DrawLine(population, Points) {
    
    for(let i = 0; i < Points.length-1; i++) {
    ctx.beginPath(); 
    ctx.moveTo(Points[population[i]].x,Points[population[i]].y ); 
    ctx.lineTo(Points[population[i+1]].x,Points[population[i+1]].y); 
    ctx.stroke(); 
    }
    ctx.beginPath();
    ctx.moveTo(Points[population[population.length-1]].x,Points[population[population.length-1]].y ); 
    ctx.lineTo(Points[population[0]].x,Points[population[0]].y); 
    ctx.stroke(); 
  }

  function CalculateSumm(population, Points) {
    let summ = 0; 

    for(let i = 0; i < Points.length-1; i++) {
      summ += Math.sqrt(Math.pow(Points[population[i+1]].x - Points[population[i]].x,2) + Math.pow(Points[population[i+1]].y - Points[population[i]].y,2));
    }
    summ += Math.sqrt(Math.pow(Points[population[0]].x - Points[population[Points.length-1]].x,2) + Math.pow(Points[population[0]].y - Points[population[Points.length-1]].y,2));

    return summ;
  }
  
  function crossingover(FP, SP, MutRate) {
    let PointStop = Math.floor(Math.random() * Points.length);
    let child = [];
    for(let i = 0; i < PointStop; i++) {
      child.push(FP[i]);
    }
    for(let i = PointStop; i < SP.length;i++) {
      let gen = SP[i];
      if(!child.includes(gen)) {
        child.push(gen);
      } 
    }
    
    for(let i = 0; i < FP.length; i++)
    {
      let gen = FP[i];
        if(!child.includes(gen))
        {
            child.push(FP[i]);
        }
    }
    if (Math.random() < MutRate) {
        let MutateChild = Mutate(child);
        
        return MutateChild;
        }
        
    return child;

  }

  function Mutate(child) {
    let MutateChild= [];
    for(let i = 0;i < child.length ;i++) {
      MutateChild.push(child[i]);
    }
    let Rn1 = Math.floor(Math.random() * Points.length);
    let Rn2 = Math.floor(Math.random() * Points.length); 
    temp = child[Rn1];
    child[Rn1] = child[Rn2];
    child[Rn2] = temp;

    return child;
  }
  
  function GeneticAlghorithm() {

  res = 0;

  let rows = Points.length;
  let cols = Points.length;
  for (let i = 0; i < populationCount; i++) {
  population[i] = [];
  for (let j = 0; j < cols; j++) {
    population[i][j] = 0;
  }
}
for (let i = 0; i < Points.length; i++) {
  population[0][i] = i;
}
for(let i = 1; i< populationCount; i++) {
  for(let k = 0;k<Points.length;k++ )
    population[i][k] = k;
   for(let j =0; j < Points.length;j++) {
      let RandNum1 = Math.floor(Math.random() * Points.length);
      let RandNum2 = Math.floor(Math.random() * Points.length);
      let temp = population[i][RandNum1]
      population[i][RandNum1] = population[i][RandNum2]
      population[i][RandNum2] = temp;
   }  
  

  } 
  

   iteration = 0;
  
   while (iteration < 10000 && res < 100) {
    console.log("h");
    iteration++;
      for(let h = 0; h < childgen; h++) {
     
      let Rn1 = Math.floor(Math.random() * population.length);
      let Rn2 = Math.floor(Math.random() * population.length);

        let child = crossingover(population[Rn1],  population[Rn2], MutRate);
        let child1 = crossingover(population[Rn2],  population[Rn1], MutRate);

        population.push(child);
        population.push(child1);

        }
        
        for(let i = 0; i<population.length; i++) {
            fitness[i] = CalculateSumm(population[i], Points) 
        }
         
        for(let i = 0;i < population.length-1;i++) {
            for(let j = 0 ; j < population.length - i - 1;j++) {
              if (fitness[j]> fitness[j+1]) {
                let temp = fitness[j];
                fitness[j] = fitness[j+1];
                fitness[j+1] = temp;
                let tmp = population[j];
                population[j] = population[j+1];
                population[j+1] = tmp;
              }
            }
          }

        min = fitness[0];
        if (min === min1) 
        res++;
        else 
        res = 0;
        

        min1 = min;
        
        for(let i =0; i < childgen *2; i++) {
          population.pop();
          fitness.pop();
        }
        count = 0;
        
        
       
        
   }
   DrawLine(population[0], Points);
    
    
  }
    
    
    
        
    