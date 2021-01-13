/*=+=+=+=+=+=+=+=+=+=+=+=+=+ Algorithms Helper Funcions +=+=+=+=+=+=+=+=+=+=+=+=+=*/

//makes walls
function makeWalls()
{
    var walls = [];
    for( var i = 0; i < totalRows; i++ )
    {
        var row = [];
        for( var j = 0; j < totalCols; j++ )
            row.push(true);
        walls.push(row);
    }
    return walls;
}

//checks for neighboring walls
function neighborsThatAreWalls( neighbors, walls )
{
    var neighboringWalls = 0;
    for( var k = 0; k < neighbors.length; k++ )
    {
        var i = neighbors[k][0];
        var j = neighbors[k][1];
        if( walls[i][j] ) 
            neighboringWalls++;
    }
    return neighboringWalls;
}
 
//Distances betweenall the cells
function createDistances()
{
    var distances = [];
    for( var i = 0; i < totalRows; i++ )
    {
        var row = [];
        for( var j = 0; j < totalCols; j++ )
            row.push(Number.POSITIVE_INFINITY);
        distances.push( row );
    }
    return distances;
}
 
//Paths between all the cells
function createPath()
{
    var path = [];
    for( var i = 0; i < totalRows; i++ )
    {
        var row = [];
        for( var j = 0; j < totalCols; j++ )
            row.push( null );
        path.push( row );
    }
    return path;
}
 
//Function which finds the neighbours of current cell
function getNeighbors( i, j )
{
    var neighbors = [];
    //top, bottom, left, right
    var limit = 4;
    //top, bottom, left, right, top-left, top-right, bottom-left, bottom-right
    if( diagnolSelected )
        limit=8;
 
    for( var k = 0; k < limit; k++ )
    {
        var newRow = i + dirX[k];
        var newCol = j + dirY[k];
        //If neighbour exists, add it into the neighbours list
        if( newRow >= 0 && newRow < totalRows && newCol >= 0 && newCol < totalCols)
            neighbors.push( [newRow, newCol] );
    }
 
    return neighbors;
}
 
//Checks all the visited walls in the grid
function createWallsVisited()
{
    var visited = [];
    var cells = $( "#tableContainer" ).find("td");
 
    for( var i = 0; i < totalRows; i++ )
    {
        var row = [];
        for( var j = 0; j < totalCols; j++ )
        {
            if( cellIsAWall( i, j, cells ) )
                row.push( true );
            else 
                row.push( false );
        }
        visited.push( row );
    }
    return visited;
}
 
//Checks if a cell is a wall/blockage
function cellIsAWall( i, j, cells )
{
    var cellNum = (i * totalCols) + j;
    return $(cells[cellNum]).hasClass("wall");
}
