var prev_green,prev_red;
let tabSize;

function adventure(){
    tabSize = document.getElementById("tabSize").value;
    prev_green = false,prev_red = false;
    var table = document.createElement("table");
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
    let info = document.getElementById("element");
    let pathbutton = document.getElementById("findpath");
    let erase = document.getElementById("erase");
    if(tabSize==0){
        erase.style.visibility = "hidden";
        info.style.visibility = "hidden";
        pathbutton.style.visibility="hidden";
        labirint.style.visibility="hidden";
    }else{
        info.style.visibility = "visible";
        erase.style.visibility = "visible";
        pathbutton.style.visibility="visible";
        labirint.style.visibility="visible";
    }
} 

function Findpath(){
    let startpoint;
    let endpoint;
    let size = tabSize;
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
    if(path == null){
        alert("Путь не был найден");
    } else{
        for(let i=1;i<path.length-1;i++){
            table.children[path[i][1]].children[path[i][0]].style.backgroundColor = "blue";
        }
    }
}

function astar(startPoint, endPoint, grid) {
    const size = grid.length;
    const openList = [{ x: startPoint.x, y: startPoint.y }];
    const closedList = [];
    const gScore = [];
    const fScore = [];
    for (let i = 0; i < size; i++) {
        gScore[i] = [];
        fScore[i] = [];
        for (let j = 0; j < size; j++) {
            gScore[i][j] = 0;
            fScore[i][j] = 0;
        }
    }
    gScore[startPoint.x][startPoint.y] = 0;
    fScore[startPoint.x][startPoint.y] = heuristic(startPoint, endPoint);
    while (openList.length > 0) {
        const currNode = openList[0];
        if (currNode.x === endPoint.x && currNode.y === endPoint.y) {
            let path = [];
            let curr = currNode;
            while (curr.parent) {
                path.push([curr.y, curr.x]);
                curr = curr.parent;
            }
            path.push([curr.y, curr.x]);
            return path;
        }
        openList.splice(0, 1);
        closedList.push(currNode);

        let neighbors = getNeighbors(currNode, grid);
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];
            if (closedList.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
                continue;
            }
            let tempGScore = gScore[currNode.x][currNode.y] + 1;
            if (!openList.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
                openList.push(neighbor);
            } else if (tempGScore >= gScore[neighbor.x][neighbor.y]) {
                continue;
            }
            neighbor.parent = currNode;
            gScore[neighbor.x][neighbor.y] = tempGScore;
            fScore[neighbor.x][neighbor.y] = heuristic(neighbor, endPoint);
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

function Erase_grid(){
    let cells = document.querySelectorAll("td");
    cells.forEach(function(cell){
        cell.style.backgroundColor = "";
    })
    prev_red = false;
    prev_green = false;
}

function labir_gen() {
    const maze = [];
    for (let i = 0; i < tabSize; i++) {
        maze[i] = [];
        for (let j = 0; j < tabSize; j++) {
            maze[i][j] = 1;
        }
    }
    maze[0][0] = 0;
    maze[tabSize - 1][tabSize - 1] = 0;
    const vertex = [], edges = [];
    for (let i = 0; i < tabSize; i++) {
        for (let j = 0; j < tabSize; j++) {
            vertex.push({ x: i, y: j });
            if (i > 0) {
                edges.push({ v1: i * tabSize + j, v2: (i - 1) * tabSize + j, weight: Math.random() });
            } 
            if(j > 0){
                edges.push({ v1: i * tabSize + j, v2: i * tabSize + j - 1, weight: Math.random() })
            }
        }
    }
    let visitedVertex = [vertex[0]];
    while (visitedVertex.length < vertex.length) {
        let minEdge = null;

        for (let i = 0; i < edges.length; i++) {
            let temp = edges[i];

            let firstVertex = visitedVertex.includes(vertex[temp.v1]);
            let secondVertex = visitedVertex.includes(vertex[temp.v2]);

            if ((firstVertex && !secondVertex) || (!firstVertex && secondVertex)) {
                if (!minEdge || temp.weight < minEdge.weight) {
                    minEdge = edges[i];
                }
            }
        }
        if(visitedVertex.includes(vertex[minEdge.v1])){
            visitedVertex.push(vertex[minEdge.v2]);
        } else{
            visitedVertex.push(vertex[minEdge.v1]);
        }
        let v1 = visitedVertex[visitedVertex.length - 2];
        let v2 = visitedVertex[visitedVertex.length - 1];
        let x = Math.round((v1.x + v2.x) / 2);
        let y = Math.round((v1.y + v2.y) / 2);
        maze[x][y] = 0;

        edges.splice(edges.indexOf(minEdge), 1);
    }

    spray(maze);
}

function spray(maze){
    Erase_grid();
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
