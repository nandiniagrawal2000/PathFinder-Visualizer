function dijkstra() 
{
    var pathFound = false,                  //stores if the path is found
        myHeap    = new minHeap(),          //new object of defined data structure, minHeap to store intermediate paths
        distances = createDistances(),      //stores dstances between cells
        visited   = createWallsVisited(),   //stores the cell walls which are visited 
        path      = createPath();           //stores the paths between cells
        isEnd     = true;                   //if path is formed till destination point or alternate destination point
 
    //put distance at starting cell as zero and add it into the heap
    distances[ startCell[0] ][ startCell[1] ] = 0;
    myHeap.insert( [0, [startCell[0], startCell[1]]] );

    //add it into the list and mark as searching
    animateCellsList.push( [[startCell[0], startCell[1]], "searching"] );
    
    //iterate throughout the whole minHeap
    while( !myHeap.isEmpty() )
    {
        //extract cell closest to current cell
        var cell = myHeap.extractMin(),
            i = cell[1][0],
            j = cell[1][1];
 
        //check visited and add to list
        if( visited[i][j] ) 
            continue; 
        visited[i][j] = true; 

        animateCellsList.push( [[i, j], "visited"] );
 
        //exit loop if destination cell reached
        if( i == endCell[0] && j == endCell[1] )
        {
            pathFound = true;
            break;
        }
        //exit loop if alternate destination cell reached
        if( i == tempCell[0] && j == tempCell[1] )
        {
            isEnd = false;
            pathFound = true;
            break;
        }
 
        //get all neighbours of current cell
        var neighbors = getNeighbors(i, j);
        //iterate and find the closest neighbor
        for( var k = 0; k < neighbors.length; k++ )
        {
            var m = neighbors[k][0],
                n = neighbors[k][1];

            if( !visited[m][n] )
            {
                //calculate distance till the neighbor
                var newDistance = distances[i][j] + ( (m - i === 0 || n - j === 0) ? 1 : Math.sqrt(2) );
                //update if closer neighbor found
                if( newDistance < distances[m][n] )
                {
                    distances[m][n] = newDistance;
                    path[m][n] = [i, j];
                    myHeap.insert( [newDistance, [m, n]] );
                    animateCellsList.push( [[m, n], "searching"] );
                }
            }
        }
    }
 
    //call function to create path on the path found
    makePath( path, pathFound, isEnd );
    
    return pathFound;
}
