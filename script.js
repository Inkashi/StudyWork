function test(){
    let temp = document.getElementById("tabSize").value;
    alert(temp);
}

let prev_red = false;
function adventure(){
    var tabSize = document.getElementById("tabSize").value;
    let pathbutton = document.getElementById("findpath");
    // Создаем таблицу
    let table = document.createElement("table");
    let tableContainer = document.getElementById("tableCon");
    tableContainer.innerHTML = "";
    tableContainer.appendChild(table);
    // Создаем строки и ячейки таблицы
    for (let i = 0; i < tabSize; i++) {
        let row = document.createElement("tr");
        table.appendChild(row);
        for (let j = 0; j < tabSize; j++) {
            let cell = document.createElement("td");
            row.appendChild(cell);
            cell.addEventListener("click", function() {
                if (this.style.backgroundColor === "") {
                    this.style.backgroundColor = "grey";
                } 
                else if(this.style.backgroundColor === "grey"){
                    if(!prev_red){
                        this.style.backgroundColor="red";
                        prev_red=true;
                    } else{
                        this.style.backgroundColor="";
                    }
                }
                else if(this.style.backgroundColor === "red") {
                    this.style.backgroundColor = "green";
                    prev_red = false;
                }
                else{
                    this.style.backgroundColor = "";
                }
                });
            }
    }
    if(tabSize==0){
        pathbutton.style.visibility="hidden";
    }else{
        pathbutton.style.visibility="visible";
    }
} 

function Findpath(){
    let start = null;
    let end = null;
    let obstacles = [];
    let cells = document.querySelectorAll("td");
    cells.forEach(function(cell){
        if (cell.style.backgroundColor === "green"){
            start = {x: cell.cellIndex, y: cell.parentNode.rowIndex};
        } else if (cell.style.backgroundColor ==="red"){
            end = {x: cell.cellIndex, y: cell.parentNode.rowIndex};
        } else if (cell.style.backgroundColor === "grey"){
            obstacles.push({x: cell.cellIndex, y: cell.parentNode.rowIndex,
                width:1,
                Height:1
            });
        }
    });
    if (start === null || end === null){
        alert("Установите точку начала и точку конца");
        return;
    }

    let path = Astar(start,end,obstacles);
    cells.forEach(function(cell){
        let isPath = false;
        for(let i=0;i<path.lenght;i++){
            if(cell.cellIndex === path[i].x && cell.parentNode.rowIndex === path[i].y){
                cell.style.backgroundColor="blue";
                isPath = true;
                break;
            }
        }
        if (!isPath && cell.style.backgroundColor === "blue") {
            cell.style.backgroundColor = "";
        }
    });
    if(path.lenght === undefined){
        alert("Путь не был найден");
    }
}

function Astar(start,end,obstacles){
    let openList = [{state:start,cost:0,estimate: heuristic(start,end)}];
    let closedlist = [];
    while (openList.lenght > 0){
        openList.sort(function(a,b){
            return a.estimate - b.estimate;
        });
        let node = openList.shift();
        closedlist.push(node);
        if(node.state.x == end.x && node.state.y == end.y){
            return closedlist;
        }
        let next = getNeghbors(node.state);
        for(let i =0;i<next.lenght;i++){
            let step = next[i];
            let cost = step.cost + node.cost;
            let isClosed = (closedlist( e =>{
                return e.state.x === step.cost.x && e.state.y === step.state.y;
            }))
            let isFrontier = (openList.find(e=>{
                return e.state.x === step.state.x && e.state.y === step.state.y;
            }))
            if(!isClosed && !isFrontier){
                openList.push({
                    state:step.state,
                    cost: cost,
                    estimate:cost + heuristic(step.state,end)
                });
            }
        }
    }
    return null;
}

function getNeghbors(state){
    let next = [];
    if(state.x > 0){
        if(!isObstacle(state.x -1, state.y)){
            next.push({
                state: {x:state.x-1, y:state.y},
                cost:1
            });
        }
    }
    if(state.x < tabSize - 1){
        if(!isObstacle(state.x + 1,state.y)){
            next.push({
                state:{x:state.x+1,y:state.y},
                cost:1
            });
        }
    }
    if(state.y > 0){
        if(!isObstacle(state.x,state.y-1)){
            next.push({
                state:{x:state.x, y:state.y - 1},
                cost:1
            });
        }
    }
    if (state.y < tabSize - 1) {
        // If the current state has a neighbor below it, add it to the array of next steps
        if(!isObstacle(state.x, state.y + 1)) {
          next.push({
            state: { x: state.x, y: state.y + 1 },
            cost: 1
          });
        }
      }
    return next;
}

function isObstacle(x,y){
    return obstacles.find(o=>o.x==x&&o)
}

function heuristic(cell1, cell2) {
    let d1 = Math.abs(cell1.x - cell2.x);
    let d2 = Math.abs(cell1.y - cell2.y);
    return d1 + d2;
  }
  
 