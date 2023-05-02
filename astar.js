var prev_green,prev_red;
let tabSize;

function adventure(){
    tabSize = document.getElementById("tabSize").value;
    let pathbutton = document.getElementById("findpath");
    let earse = document.getElementById("earse");
    prev_green = false,prev_red = false;
    let table = document.createElement("table");
    table.id = "table";
    let tableContainer = document.getElementById("tableCon");
    tableContainer.innerHTML = "";
    tableContainer.appendChild(table);
    for (let i = 0; i < tabSize; i++) {
        let row = document.createElement("tr");
        table.appendChild(row);
        for (let j = 0; j < tabSize; j++) {
            let cell = document.createElement("td");
            row.appendChild(cell);
            cell.addEventListener("click", function() {
                if (this.style.backgroundColor === "") {
                    if(!prev_green){
                        this.style.backgroundColor = "green";
                        prev_green = true;   
                    } else if(!prev_red){
                        this.style.backgroundColor = "red";
                        prev_red = true;
                    }else{
                        this.style.backgroundColor = "grey";
                    }
                } 
                else if(this.style.backgroundColor === "red"){
                    this.style.backgroundColor = "";
                    prev_red = false;
                }
                else if(this.style.backgroundColor === "green") {
                    if(!prev_red){
                        this.style.backgroundColor = "red";
                        prev_red = true;
                    }else{
                        this.style.backgroundColor = "";
                    }
                    prev_green = false;
                }
                else{
                    this.style.backgroundColor = "";
                }
                });
            }
    }
    let pos = document.getElementById("insert");
    if(tabSize==0){
        earse.style.visibility = "hidden";
        pathbutton.style.visibility="hidden";
        labirint.style.visibility="hidden";
    }else{
        earse.style.visibility = "visible";
        pathbutton.style.visibility="visible";
        labirint.style.visibility="visible";
    }
} 

function Findpath(){
    let startpoint;
    let endpoint;
    let size = document.getElementById("tabSize").value;
    let grid = [];
    let k=0;
    let cells = document.querySelectorAll("td");
    for(let i=0;i<size;i++){
         grid[i]  = [];
         for(let j=0;j<size;j++,k++){
            if(cells[k].style.backgroundColor==="grey"){
                grid[i][j] = 1;
            }else{
                grid[i][j] = 0;
            }
         }
    }
    cells.forEach(function(cell){
        if(cell.style.backgroundColor==="green"){
            startpoint={x:cell.parentNode.rowIndex,y:cell.cellIndex}
        }
        else if(cell.style.backgroundColor ==="red"){
            endpoint={x:cell.parentNode.rowIndex,y:cell.cellIndex}
        }
    })

    let path = astar(startpoint,endpoint,grid);
    console.log(path);
    if(path == null){
        alert("Путь не был найден");
    } else{
        let table = document.getElementById("table");
        for(let i=1;i<path.length-1;i++){
        table.children[path[i][1]].children[path[i][0]].style.backgroundColor = "blue";
        }
    }
}

function astar(startPoint, endPoint, grid) {
    const size = grid.length;
    const openList = [{ x: startPoint.x, y: startPoint.y, f: 0 }];
    const closedList = [];
    const gScore =[];
    const fScore = [];
    for(let i=0;i<size;i++){
        gScore[i]=[];
        fScore[i]=[];
        for(let j=0;j<size;j++){
            gScore[i][j]=Infinity;
            fScore[i][j]=Infinity;
        }
    }
    console.log(gScore);
    gScore[startPoint.x][startPoint.y] = 0;
    fScore[startPoint.x][startPoint.y] = heuristic(startPoint, endPoint);
    while (openList.length > 0) {
        let lowestFIndex = 0;
        for (let i = 0; i < openList.length; i++) {
            if (openList[i].f < openList[lowestFIndex].f) {
            lowestFIndex = i;
        }
        }
        const currentNode = openList[lowestFIndex];
        if (currentNode.x === endPoint.x && currentNode.y === endPoint.y) {
            const path = [];
            let current = currentNode;
            while (current.parent) {
                path.push(current);
                current = current.parent;
            }
            path.push(current);
            return path.map(node => [node.y, node.x]);
        }
        openList.splice(lowestFIndex, 1);
        closedList.push(currentNode);
        
        const neighbors = getNeighbors(currentNode, grid);
        for (let i = 0; i < neighbors.length; i++) {
            const neighbor = neighbors[i];
            if (closedList.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
                continue;
            }
            const tentativeGScore = gScore[currentNode.x][currentNode.y] + 1;
            if (!openList.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
                openList.push(neighbor);
            } else if (tentativeGScore >= gScore[neighbor.x][neighbor.y]) {
                continue;
            }
            neighbor.parent = currentNode;
            gScore[neighbor.x][neighbor.y] = tentativeGScore;
            fScore[neighbor.x][neighbor.y] = heuristic(neighbor, endPoint);
            neighbor.f = gScore[neighbor.x][neighbor.y] + fScore[neighbor.x][neighbor.y];
        }
    }
    return null; 
}

function heuristic(a,b){
    return Math.abs(a.x-b.x) + Math.abs(a.y-b.y);
}

function getNeighbors(node, grid) {
    var neighbors = [];
    var x = node.x;
    var y = node.y;
    if (grid[x-1] && grid[x-1][y] == 0) {
    neighbors.push({x: x-1, y: y});
    }
    if (grid[x+1] && grid[x+1][y] == 0) {
    neighbors.push({x: x+1, y: y});
    }
    if (grid[x][y-1] == 0) {
    neighbors.push({x: x, y: y-1});
    }
    if (grid[x][y+1] == 0) {
    neighbors.push({x: x, y: y+1});
    }
    
    return neighbors;
}

function Earse_grid(){
    let cells = document.querySelectorAll("td");
    cells.forEach(function(cell){
        cell.style.backgroundColor = "";
    })
    prev_red = false;
    prev_green = false;
}

function labir_gen() {
    let maze = [];
    for(let i=0;i<tabSize;i++){
        maze[i] = [];
        for(let j=0;j<tabSize;j++){
            maze[i][j] = 1;
        }
    }
    maze[0][0] = 0;
    maze[tabSize - 1][tabSize - 1] = 0;
    const vertices = [];
    const edges = [];
    for (let i = 0; i < tabSize; i++) {
        for (let j = 0; j < tabSize; j++) {
            vertices.push({ x: j, y: i });
            if (j > 0) {
                edges.push({ v1: i * tabSize + j, v2: i * tabSize + j - 1, weight: Math.random() });
            }
            if (i > 0) {
                edges.push({ v1: i * tabSize + j, v2: (i - 1) * tabSize + j, weight: Math.random() });
            }
        }
    }
    const visitedVertices = [];
    visitedVertices.push(vertices[0]);
    while (visitedVertices.length < vertices.length) {
        let minEdge = null;
        for (let i = 0; i < edges.length; i++) {
            const { v1, v2, weight } = edges[i];
            if (
            (visitedVertices.includes(vertices[v1]) && !visitedVertices.includes(vertices[v2])) ||
            (!visitedVertices.includes(vertices[v1]) && visitedVertices.includes(vertices[v2]))
            ) {
                if (!minEdge || weight < minEdge.weight) {
                    minEdge = edges[i];
            }
            }
        }
        visitedVertices.push(
        visitedVertices.includes(vertices[minEdge.v1]) ? vertices[minEdge.v2] : vertices[minEdge.v1]);
        const { x, y } = visitedVertices[visitedVertices.length - 1];
        const { x: x2, y: y2 } = visitedVertices[visitedVertices.length - 2];
        maze[Math.round((y + y2) / 2)][Math.round((x + x2) / 2)] = 0;
        
        edges.splice(edges.indexOf(minEdge), 1);
    }
    
     spray(maze);
}

function spray(maze){
    Earse_grid();
    let cells = document.querySelectorAll("td");
    let k =0;
    for(let i=0;i<tabSize;i++){
        for(let j=0;j<tabSize;j++){
            if(maze[i][j] == 1){
                cells[k].style.backgroundColor="grey";
            }
            k++;
        }
    }
}