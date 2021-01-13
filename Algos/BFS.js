/*=+=+=+=+=+=+=+=+=+=+=+=+=+ Breadth First Search Algorithm +=+=+=+=+=+=+=+=+=+=+=+=+=*/

function BFS()
{   
    //Initialization
    var pathFound = false,                  //stores if the path is found               
        isEnd = true,                       //if path is formed till destination point or alternate destination point
        myQueue = new Queue(),              //new object of defined data structure Queue
        visited = createWallsVisited(),     //stores the cell walls which are visited
        path = createPath();                //stores the paths between cells   
 
    //pushing starting point
    myQueue.enqueue( startCell );
 
    //animateCellsList.push(startCell, "searching");
    visited[ startCell[0] ][ startCell[1] ] = true;
 
    //Poping current cell out of the queue and pushing its neighbour in it
    //till destination cell is reached
    while( !myQueue.isEmpty() )
    {
        //Pop current cell
        var cell = myQueue.dequeue(),
            i = cell[0],
            j = cell[1];
 
        //add current cell to animate cells list as visited
        animateCellsList.push( [cell, "visited"] ); 
        
        //if destination point reached
        if( i == endCell[0] && j == endCell[1] )
        {
            pathFound = true;
            break;
        }
        //if alternate destination point reached
        if( i == tempCell[0] && j == tempCell[1] )
        {
            isEnd = false;
            pathFound = true;
            break;
        }
        
        //finding all neighboring cells and pushing in queue
        var neighbors = getNeighbors( i, j );
        for( var k = 0; k < neighbors.length; k++ )
        {
            var m = neighbors[k][0];
            var n = neighbors[k][1];
 
            if( !visited[m][n] )
            {
                visited[m][n] = true;
                path[m][n] = [i, j];
                animateCellsList.push( [neighbors[k], "searching"] );
                myQueue.enqueue( neighbors[k] );
            }
        }
    }
 
    //call function to create path on the path found
    makePath( path, pathFound, isEnd );
    
    return pathFound;
}
