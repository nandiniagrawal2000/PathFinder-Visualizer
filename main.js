function include(file) { 
  
  var script  = document.createElement('script'); 
  script.src  = file; 
  script.type = 'text/javascript'; 
  script.defer = true; 
  
  document.getElementsByTagName('head').item(0).appendChild(script); 
  
} 
  
include('buttons.js');  
include('DataStructures.js');
include('helper.js');
include('Heuristics.js');
include('Algos/AStar.js');
include('Algos/Bi-AStar.js');
include('Algos/BFS.js');
include('Algos/Bi-BFS.js');
include('Algos/Dijkstra.js');
include('Algos/Greedy Best First.js');


//variables used
var totalRows        = 25,
    totalCols        = 60,
    ongoingProcess   = false,
    animateCellsList = [],
    createWalls      = false,
    algorithm        = null,
    startCell        = [10, 15],
    endCell          = [10, 30],
    tempCell         = [10 ,35],
    startCellMoving  = false,
    endCellMoving    = false,
    tempCellMoving   = false,
    distanceMethod   = "Manhattan",
    diagnolSelected  = false,
    prev             = [],
    dirX             = [ 1, 0,-1, 0, 1, 1, -1, -1],
    dirY             = [ 0,-1, 0, 1, 1, -1, 1, -1];


//Prototype for generating grid
function generateGrid()
{
    var grid = "<table>";
    for( var row = 0; row < totalRows; row++ )
    {
        grid += "<tr>"; 
        for( var col = 0; col <totalCols; col++ )
        {      
            grid += "<td></td>";
        }
        grid += "</tr>"; 
    }
    grid += "</table>"
    return grid;
}

// Variable for grid based on the given prototype
var myGrid = generateGrid();
$( "#tableContainer" ).append( myGrid );
 
 
/*=+=+=+=+=+=+=+=+=+=+=+=+=+ Mouse Functions +=+=+=+=+=+=+=+=+=+=+=+=+=*/
 
//Mouse-down function for cell
$( "td" ).mousedown( function(){
    var index = $( "td" ).index( this ),
        startCellIndex = ( startCell[0] * totalCols ) + startCell[1],
        endCellIndex = ( endCell[0] * totalCols ) + endCell[1],
        tempCellIndex = ( tempCell[0] * totalCols ) + tempCell[1];
 
    if ( !ongoingProcess )
    {    
        //if starting position is moved
        if( index == startCellIndex )
            startCellMoving = true;
        
        //if destination position is moved 
        else if( index == endCellIndex )
            endCellMoving = true;

        //if alternate destination point is moved    
        else if( index == tempCellIndex )
            tempCellMoving = true;
        
        //if barriers are created in between the path
        else
            createWalls = true;
    }
});
 
//Mouse-up function for cell
$( "td" ).mouseup( function(){
    createWalls = false;
    startCellMoving = false;
    endCellMoving = false;
    tempCellMoving = false;
}); 
 
//Fucntion triggered whenever mouse enetrs the grid
$( "td" ).mouseenter( function(){
    //If start or end is not moved and the walls aren't created
    if( !createWalls && !startCellMoving && !endCellMoving && !tempCellMoving )
        return;
 
    var index = $( "td" ).index( this ),
        startCellIndex = ( startCell[0] * totalCols ) + startCell[1],
        endCellIndex = ( endCell[0] * totalCols ) + endCell[1],
        tempCellIndex = ( tempCell[0] * totalCols ) + tempCell[1];
 
    if( !ongoingProcess )
    {   
        //if starting position is changed
        if( startCellMoving && index != endCellIndex && index != tempCellIndex )
            moveStartOrEnd(  index, "start" );
    
        //if destination is changed
        else if( endCellMoving && index != startCellIndex && index != tempCellIndex )
            moveStartOrEnd(  index, "end" );

        //if alternate destination point os changed  
        else if( tempCellMoving && index != startCellIndex && index != endCellIndex )
            moveStartOrEnd( index, "temp" );
    
        //if only walls are created 
        else if( index != startCellIndex && index != endCellIndex && index != tempCellIndex )
            $( this ).addClass( "wall" );
    }
});
 
//Function for mouse click
$( "td" ).click( function(){
    var index = $( "td" ).index(this),
        startCellIndex = ( startCell[0] * totalCols ) + startCell[1],
        endCellIndex = ( endCell[0] * totalCols ) + endCell[1],
        tempCellIndex = ( tempCell[0] * totalCols ) + tempCell[1];
 
    if( (ongoingProcess == false) && !(index == startCellIndex) && !(index == endCellIndex) && !(index == tempCellIndex) )
        $(this).toggleClass( "wall" );
});
 
//Mouse-up function for body
$( "body" ).mouseup( function(){
    createWalls = false;
    startCellMoving = false;
    endCellMoving = false;
    tempCellMoving = false;
});


/*=+=+=+=+=+=+=+=+=+=+=+=+=+ Functions +=+=+=+=+=+=+=+=+=+=+=+=+=*/
 
//Update function if starting point or destination point is moved
function moveStartOrEnd(  newIndex, startOrEnd )
{
    var newCellY = newIndex % totalCols,
        newCellX = Math.floor( (newIndex - newCellY) / totalCols );
     
    //start point moved    
    if( startOrEnd == "start" )
        startCell = [newCellX, newCellY];
    //destiantion point moved
    else if( startOrEnd == "end" )
        endCell = [newCellX, newCellY];
    //alternate destiantion point moved    
    else
        tempCell = [newCellX, newCellY];
    
    clearOrInitialiseBoard( keepWalls = true );
    return;
} 

function updateStartBtn()
{
    switch( algorithm )
    {
        case "Dijkstra"                                 : $("#startBtn").html("Start Dijkstra");              break;
        case "Breadth-First Search (BFS)"               : $("#startBtn").html("Start BFS");                   break;
        case "Bi-directional Breadth-First Search (BFS)": $("#startBtn").html("Start Bi-BFS");                break;
        case "A*"                                       : $("#startBtn").html("Start A*");                    break;
        case "Bi-directional A*"                        : $("#startBtn").html("Start Bi-A*");                 break;
        case "Greedy Best-First Search"                 : $("#startBtn").html("Start Greedy Best-First");     break;        
    }
    return;
}

//to create random walls like a maze
async function randomWalls()
{
    ongoingProcess = true;
    clearOrInitialiseBoard( keepWalls = false );

    var visited = createWallsVisited(),
        walls = makeWalls(),
        cells = [ startCell, endCell ];
    
    walls[ startCell[0] ][ startCell[1] ] = false;
    walls[ endCell[0] ][ endCell[1] ] = false;
    visited[ startCell[0] ][ startCell[1] ] = true;
    visited[ endCell[0] ][ endCell[1] ] = true;

    while( cells.length > 0 )
    {
        var random = Math.floor(Math.random() * cells.length),
            randomCell = cells[random];

        cells[random] = cells[cells.length - 1];
        cells.pop();
        
        var neighbors = getNeighbors( randomCell[0], randomCell[1] );
        
        if( neighborsThatAreWalls( neighbors, walls ) < 2 )
            continue;

        walls[ randomCell[0] ][ randomCell[1] ] = false;
        for( var k = 0; k < neighbors.length; k++ )
        {
            var i = neighbors[k][0],
                j = neighbors[k][1];
            if( !visited[i][j] )
            {
                visited[i][j] = true;
                cells.push([i, j]);
            }
        }
    }

    //Animate cells
    var cells = $("#tableContainer").find("td");
    for( var i = 0; i < totalRows; i++ )
    {
        for( var j = 0; j < totalCols; j++ )
        {
            if( walls[i][j] )
                animateCellsList.push( [[i, j], "wall"] ); 
        }
    }
    await cellsAnimation();
    ongoingProcess = false;
    return;
}
 
//Function for graph traversal
//Returns promise( async function ) 
async function startGraphExploring()
{
    //Traversal in progress
    ongoingProcess = true;
    clearOrInitialiseBoard( keepWalls = true );
 
    //Record time before starting execution
    var startTime = Date.now(); 
    //To find the path
    var pathFound = executeAlgo();
    //Record time after execution
    var endTime = Date.now();
 
    //Waits until that promise settles and returns its result
    await cellsAnimation();
    
    //Update results if path is found or not
    if ( pathFound ) 
        updateResults( (endTime - startTime), true, pathLength() );
    else
        updateResults( (endTime - startTime), false, pathLength() );
 
    //Traversal finished
    prev = [];
    ongoingProcess = false;
}
 
//Call the execution of the selected algorithm to find shortest path
function executeAlgo()
{
    var pathFound;
    switch( algorithm )
    {
        case "Dijkstra"                                 : pathFound = dijkstra();              break;
        case "Breadth-First Search (BFS)"               : pathFound = BFS();                   break;
        case "Bi-directional Breadth-First Search (BFS)": pathFound = BiBFS();                 break;
        case "A*"                                       : pathFound = AStar();                 break;
        case "Bi-directional A*"                        : pathFound = BiAStar();               break;
        case "Greedy Best-First Search"                 : pathFound = greedyBestFirstSearch(); break;
        default                                         : pathFound = null;
    }
    //Return the path found by using selected algorithm
    return pathFound;
}

//for calling specific heuristics 
function calcHeuristicDistance( dx, dy )
{
    var calculatedDistance;
    switch( distanceMethod )
    {
        case "Manhattan": calculatedDistance = manhattanDist( dx, dy ); break;
        case "Euclidean": calculatedDistance = euclideanDist( dx, dy ); break;
        case "Octile"   : calculatedDistance = octileDist( dx, dy );    break;
        case "Chebyshev": calculatedDistance = chebyshevDist( dx, dy ); break;
        default         : calculatedDistance = 0;
    }
    return calculatedDistance;
}

//Updating message to be displayed
function update( message )
{
    $( "#resultsIcon" ).removeClass();
    $( "#resultsIcon" ).addClass("fas fa-exclamation");
    $( '#results' ).css( "background-color", "#ffc107" );
    $( "#length" ).text("");
    if( message == "wait" )
        $( "#duration" ).text( "Please wait for the algorithm to finish." );
}
 
//Used to display results
function updateResults( duration, pathFound, length )
{    
    setTimeout( function(){ 
                            $( "#resultsIcon" ).removeClass();
                            
                            if( pathFound )
                            {
                                $( '#results' ).css( "background-color", "#77dd77" );
                                $( "#resultsIcon" ).addClass("fas fa-check");
                            } 
                            else 
                            {
                                $( '#results' ).css( "background-color", "#ff6961" );
                                $( "#resultsIcon" ).addClass("fas fa-times");
                            }
                            
                            $( "#duration" ).text( "Duration: " + duration + " ms" );
                            $( "#length" ).text( "Length: " + length );
                            
                          }, 1000);
}

//Makes path on the path that has been found
function makePath( path, pathFound, isEnd, tempNode = null )
{    
    var currCell = endCell;
    //if alternate destination point has shorter path than destination point
    if( !isEnd )
        currCell = tempCell;
    //in case of bidirectionsl algorithm
    if( tempNode )
        currCell = tempNode;
    //if a path exists
    if( pathFound ) 
    {
        var i = currCell[0],
            j = currCell[1];
        prev.push( [i,j] );
        //Animate the cuurent cell, through which path exists
        if( isEnd )
            animateCellsList.push( [currCell, "success"] );
        else 
            animateCellsList.push( [currCell, "successHault"] );
        
        while( path[i][j] != null )
        {
            var pathCell = path[i][j];
            i = pathCell[0];
            j = pathCell[1];
            prev.push( [i, j] );
            if( isEnd )
                animateCellsList.push( [[i, j], "success"] );
            else
                animateCellsList.push( [[i, j], "successHault"] );       
        }
        prev = prev.reverse();
    }
}

//Counts length of success
function pathLength() 
{
    var sum = 0, a, b, dx, dy;
    for( var i = 1; i < prev.length; ++i ) 
    {
        a = prev[i - 1];
        b = prev[i];
        dx = Math.abs(a[0] - b[0]);
        dy = Math.abs(a[1] - b[1]);
        
        if( dx > 1 || dy > 1 )
        {
            dx = 0;
            dy = 0;
        }
        sum += Math.sqrt( (dx*dx) + (dy*dy) );
    }
    return sum.toPrecision(4);
}
 
//Animates cells
async function cellsAnimation()
{    
    var cells = $( "#tableContainer" ).find("td"),
        startCellIndex = ( startCell[0] * totalCols ) + startCell[1],
        endCellIndex = ( endCell[0] * totalCols ) + endCell[1],
        tempCellIndex = ( tempCell[0] * totalCols ) + tempCell[1],
        delay = 0;

    if( algorithm == "Bi-directional A*" || algorithm == "Bi-directional Breadth-First Search (BFS)" )
    {
        $(cells[tempCellIndex]).removeClass("temp");
    }    
 
    for( var i = 0; i < animateCellsList.length; i++ )
    {
        var cellCoordinates = animateCellsList[i][0],
            x = cellCoordinates[0],
            y = cellCoordinates[1],
            num = (x * totalCols) + y;
        
        if( num == startCellIndex || num == endCellIndex )
                    continue;

        if( num == tempCellIndex )
        {
            if( algorithm !== "Bi-directional A*" && algorithm !== "Bi-directional Breadth-First Search (BFS)" )
                continue;
        }
 
        var cell = cells[num];
        var colorClass = animateCellsList[i][1];
 
        //Waits until that promise settles(its time to animate) and returns its result
        await new Promise(resolve => setTimeout(resolve, delay));
 
        $(cell).removeClass();
        $(cell).addClass(colorClass);
    }
 
    animateCellsList = [];
    return new Promise(resolve => resolve(true));
}
 
//To clear or initialise the board/grid  
function clearOrInitialiseBoard( keepWalls )
{
    var cells = $("#tableContainer").find("td"),
        startCellIndex = ( startCell[0] * totalCols ) + startCell[1],
        endCellIndex = ( endCell[0] * totalCols ) + endCell[1],
        tempCellIndex = ( tempCell[0] * totalCols ) + tempCell[1];
 
    for( var i = 0; i < cells.length; i++ )
    {
        isWall = $( cells[i] ).hasClass("wall");
        
        $( cells[i] ).removeClass(); 
        
        if( i == startCellIndex )
            $(cells[i]).addClass("start"); 
        else if( i == endCellIndex )
            $(cells[i]).addClass("end"); 
        else if( i == tempCellIndex )
            $(cells[i]).addClass("temp");
        else if( keepWalls && isWall ) 
            $(cells[i]).addClass("wall"); 
    }
}
 
//Default Board Initialisation
clearOrInitialiseBoard();
