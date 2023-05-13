let canvas = document.getElementById("Canvas");
const size_window = innerWidth;
if(innerWidth < 1000){
  canvas.height=400;
  canvas.width=400;
} else{
  canvas.height=700;
  canvas.width=700;
}
let ctx=canvas.getContext("2d");
ctx.fillStyle = "#fff"; 
ctx.fillRect(0, 0, canvas.width, canvas.height); 
const button = document.getElementById("RandPoint");
let Points = [];
let CPoints = [];
let clasters = [];
let count = 0; 

window.addEventListener(`resize`, event => {
  if(window.innerWidth < 1000){
    canvas.height=400;
    canvas.width=400;
    ctx.fillStyle = "#fff"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
  } else {
    canvas.height=700;
    canvas.width=700;
    ctx.fillStyle = "#fff"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
  }
}, false);

canvas.addEventListener("click", function(event) {
    let x = event.offsetX;
    let y = event.offsetY;
    
    ctx.fillStyle = "black"; 
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2, true); 
    ctx.fill(); 
    Points.push({x: x, y: y, count: 123, color: 0});
  });
  button.addEventListener("click", function(event) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;

    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);

    let color = 'rgb(' + red + ',' + green + ',' + blue + ')';
   
    ctx.fillStyle = color; 
    ctx.beginPath(); 
    ctx.arc(x, y, 7, 0, Math.PI * 2, true); 
    ctx.fill(); 
    CPoints.push({x: x, y: y, count: count, color: color});
    count++;
    console.log((x) + " " + (y));
  });
  

  function Klust() {
    let min; 
    let d;
    let mincolor;
    for(let i = 0; i<Points.length; i++) {
      min = 10000;
      for(let j = 0;j<CPoints.length;j++) {
  
      d =  Math.sqrt(Math.pow(CPoints[j].x - Points[i].x,2) + Math.pow(CPoints[j].y - Points[i].y,2)) 
      if(min > d) {
        min = d;
        mincount = CPoints[j].count;
        mincolor = CPoints[j].color;
      }
    }
    Points[i].count = mincount;
    ctx.fillStyle = mincolor;
    Points[i].color = mincolor;
    ctx.beginPath(); 
    ctx.arc(Points[i].x, Points[i].y, 4, 0, Math.PI * 2, true); 
    ctx.fill(); 
    }
    
    return Points;
    
  };
  
  function Shifte(clasters, CPoint) {
    let New = CPoint.slice();
    let maxX;
    let maxY;
    let count1;
      for(let i = 0; i < CPoint.length;i++) {
        maxX = 0;
        maxY = 0;
        count1 = 0;
        for(let j = 0; j < clasters.length;j++) {
          if (CPoint[i].count === clasters[j].count) 
          {
            maxX+= clasters[j].x;
            maxY+= clasters[j].y;
            count1++;
          
          }
      }
      New[i].x = (maxX/count1); 
      New[i].y = (maxY/count1); 

    }
    return New;
  };
  function KMeans () {
    
    clasters = Klust(Points, CPoints); 
    console.log(CPoints);
    let NCPoints = [];

    for(let i = 0; i < CPoints.length;i++) {
      NCPoints.push({x: CPoints[i].x ,y: CPoints[i].y, count: CPoints[i].count ,color: CPoints[i].color});
    }
    
    NCPoints = Shifte(clasters, NCPoints);
    console.log(NCPoints);
    while(JSON.stringify(CPoints) !== JSON.stringify(NCPoints)) {
      for(let i = 0; i < NCPoints.length;i++) {
      CPoints[i] = {x: NCPoints[i].x ,y: NCPoints[i].y, count: NCPoints[i].count ,color: NCPoints[i].color};
    }
      clasters = Klust(Points, CPoints);
      NCPoints = Shifte(clasters, NCPoints);
      console.log("hello");
    }
    
    ctx.fillStyle = "#fff"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(let i =0;i < NCPoints.length ; i++) {
    ctx.fillStyle = NCPoints[i].color; 
    ctx.beginPath(); 
    ctx.arc(NCPoints[i].x, NCPoints[i].y, 7, 0, Math.PI * 2, true); 
    ctx.fill(); 
    }
    for(let i =0;i < clasters.length ;i++ ) {
    ctx.fillStyle = clasters[i].color; 
    ctx.beginPath(); 
    ctx.arc(Points[i].x, Points[i].y, 4, 0, Math.PI * 2, true); 
    ctx.fill(); 
    }
  
  } 