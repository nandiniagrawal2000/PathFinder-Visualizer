/*=+=+=+=+=+=+=+=+=+=+=+=+=+ Greedy Best First Search Algorithm +=+=+=+=+=+=+=+=+=+=+=+=+=*/

function greedyBestFirstSearch() 
{
    var pathFound = false,                  //stores if the path is found
        isEnd = true,                       //if path is formed till destination point or alternate destination point
        myHeap = new minHeap(),             //new object of defined data structure, minHeap to store intermediate paths
        visited = createWallsVisited(),     //stores the cell walls which are visited
        path = createPath(),                //stores the paths between cells
        costs = createDistances();          //stores costs between cell paths                

    //initialising cost of start and inserting in minHeap
    costs[ startCell[0] ][ startCell[1] ] = 0;
    myHeap.insert( [0, [startCell[0], startCell[1]]] );

    //add it into the list and mark as searching
    animateCellsList.push( [[startCell[0], startCell[1]], "searching"] );

    //iterate throughout the whole minHeap
    while( !myHeap.isEmpty() )
    {
        //extract minimum
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
        var neighbors = getNeighbors( i, j );
        //iterate and find the closest neighbor
        for( var k = 0; k < neighbors.length; k++ )
        {
            var m = neighbors[k][0];
            var n = neighbors[k][1];
            if( !visited[m][n] )
            {
                //calculate costs till the neighbor for destination and alternate destination using Heuristics
                var newCostEnd = calcHeuristicDistance( Math.abs( endCell[0] - m ),Math.abs( endCell[1] - n ) );
                var newCostTemp = calcHeuristicDistance( Math.abs( tempCell[0] - m ),Math.abs( tempCell[1] - n ) );
    
                //update newCost with lesser cost
                if( newCostEnd < newCostTemp )
                    var newCost = newCostEnd;
                else
                    var newCost = newCostTemp;
    
                //update if closer neighbor found
                if( newCost < costs[m][n] )
                {
                    path[m][n] = [i, j];
                    costs[m][n] = newCost;
                    myHeap.insert( [newCost, [m, n]] );
                    animateCellsList.push( [[m, n], "searching"] );
                }
            }
        }
    }
   
    //call function to create path on the path found
    makePath(path,pathFound, isEnd);
    
    return pathFound;
}
