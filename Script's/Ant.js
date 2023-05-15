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
    let massiv2 = [];
    let Points = [];
    let Distance = [];
    let visitedNodes = [];
    let pheromone = [];
    let CityArray = [];
    let massiv = [];
    let TotalDist = [];
    let last = 100000;
    let res = 0;
    let alpha =2;
    let beta = 3;
    let coefficient = 0.2;
    let Q = 30;
  
    function DrawLine(population, Points) {
    
    for(let i = 0; i < Points.length-1; i++) {
    ctx.beginPath(); 
    ctx.moveTo(Points[population[i]].x,Points[population[i]].y); 
    ctx.lineTo(Points[population[i+1]].x,Points[population[i+1]].y); 
    ctx.stroke(); 
    }
    ctx.beginPath();
    ctx.moveTo(Points[population[population.length-1]].x,Points[population[population.length-1]].y ); 
    ctx.lineTo(Points[population[0]].x,Points[population[0]].y); 
    ctx.stroke(); 
  };

  function CalculateDist(TotalDist, CA, Points) {
    let sum = 0;
    
    for(let i = 0;i < Points.length-1 ; i++) {
      sum += Math.sqrt(Math.pow(Points[CA[i+1]].x - Points[CA[i]].x,2) + Math.pow(Points[CA[i+1]].y - Points[CA[i]].y,2));
    }
    sum += Math.sqrt(Math.pow(Points[CA[0]].x - Points[CA[Points.length-1]].x,2) + Math.pow(Points[CA[0]].y - Points[CA[Points.length-1]].y,2));
  
    return sum;
  };

  function RefreshPheromone(pheromone, Q, CA , TotalDist, coefficient) {
    for(let i = 0; i < Points.length;i++) {
      for(let j = 0; j< Points.length;j++) {
        if(i !== j) 
          pheromone[i][j]*= coefficient;
      }
    }

    let massiv1;
    let pheromonechange;
    for(let i = 0; i < TotalDist.length;i++) {
      pheromonechange = Q/ TotalDist[i];
      massiv1 = [...CityArray[i]];
    for(let j = 0; j < Points.length-1;j++) {
      {
      pheromone[massiv1[j]][massiv1[j+1]] += pheromonechange;
      pheromone[massiv1[j+1]][massiv1[j]] += pheromonechange;
      }
    } 
    pheromone[massiv1[Points.length-1]][massiv1[0]]+= pheromonechange;  
    pheromone[massiv1[0]][massiv1[Points.length-1]]+= pheromonechange;   
  }

    return pheromone;
  };

  function selectNextNode(currentNode, pheromone, distance, alpha, beta, visitedNodes) {
  let probabilities = [];
  let sum = 0;
  for (let i = 0; i < pheromone.length; i++) {
    if (i !== currentNode && !visitedNodes.includes(i)) {
      let attractiveness = Math.pow((1 / distance[currentNode][i]), beta);
      let pheromoneLevel = Math.pow(pheromone[currentNode][i], alpha);
      let probability = pheromoneLevel * attractiveness;
      probabilities.push({ node: i, probability: probability });
      sum += probability;
    }
  }
  probabilities.forEach((p) => (p.probability /= sum));
  probabilities.sort((a, b) => b.probability - a.probability);
  let rand = Math.random();
  let cumulativeProbability = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulativeProbability += probabilities[i].probability;
    if (rand <= cumulativeProbability) {
      return probabilities[i].node;
    }
  }
};

        let iteration = 0;
    
        function AntAlgorithm () {
  
          let Ants = 4000;
          
          for (let i = 0; i < Points.length; i++) {
            Distance[i] = [];
        for (let j = 0; j < Points.length; j++) {
          Distance[i][j] = 0;
        }
      }
      for(let i = 0;i < Points.length ;i++) 
        for(let j = 0; j < Points.length;j++) 
          if(i !== j) 
            Distance[i][j] = Math.sqrt(Math.pow(Points[j].x - Points[i].x,2) + Math.pow(Points[j].y - Points[i].y,2));
          
            for (let i = 0; i < Points.length; i++) {
            pheromone[i] = [];
        for (let j = 0; j < Points.length; j++) {
          pheromone[i][j] = 0;
        }
      }
      for(let i = 0;i < Points.length ;i++) 
        for(let j = 0; j < Points.length;j++) 
          if(i !== j) 
            pheromone[i][j] = 0.2;
            
      let count = 0;
      res = 0;
      iteration = 0;
      while(iteration < 10000 && res < 14) {
        console.log("итераций");
        CityArray = [];
        iteration++;
        let currentNode = 0;
        
        for(let i = 0; i < Ants;i++ ) {
          if (count == Points.length)
            count = 0;
          visitedNodes = [];
          massiv = [];
          currentNode = count;
        for(let j = 0 ;j < Points.length-1 ;j++) 
        { massiv.push(currentNode);
          visitedNodes.push(currentNode);
          currentNode = selectNextNode(currentNode, pheromone, Distance, alpha, beta, visitedNodes);  
          
          
        }
        massiv.push(currentNode);
        CityArray.push(massiv);
        count++;
      }
      for(let i = 0 ;i < CityArray.length; i++) {
      TotalDist[i] = CalculateDist(TotalDist, CityArray[i], Points);
      }
      
      pheromone = RefreshPheromone(pheromone, Q, CityArray , TotalDist, coefficient);

      for(let i = 0;i < TotalDist.length-1;i++) {
            for(let j = 0 ; j < TotalDist.length - i - 1;j++) {
              if (TotalDist[j]> TotalDist[j+1]) {
                let temp = TotalDist[j];
                TotalDist[j] = TotalDist[j+1];
                TotalDist[j+1] = temp;
                let tmp = CityArray[j];
                CityArray[j] = CityArray[j+1];
                CityArray[j+1] = tmp;
              }
            }
          }
      
          
          if(last <= TotalDist[0])  
          {
              res++;
          }
          else  
          {
              res = 0;
              last = TotalDist[0];
              for(let i = 0 ;i < Points.length ;i++)
              massiv2[i] = CityArray[0][i];
          }
          
          
      
  }
 
      DrawLine(massiv2, Points);

};