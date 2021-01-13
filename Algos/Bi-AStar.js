/*+=+=+=+=+=+=+=+=+=+=+=+=+= BiA* +=+=+=+=+=+=+=+=+=+=+=+=+=*/
function BiAStar() 
{
    
    var startOpenList   = new minHeap(),
        endOpenList     = new minHeap(),
        openVisited     = createWallsVisited(),
        closeVisited    = createWallsVisited(),
        bylist          = createDistances(),
        distances       = createDistances(), 
        path            = createPath(),
        costs           = createDistances(),
        fromEnd         = false,
        pathFound       = false,
        BY_START        = 0, 
        BY_END          = 1,
        node, neighbors, neighbor, i,newCost,
        r1, c1, r2, c2;
 
    // set the 'g' and 'f' value of the start node to be 0 where 'g' here is 'distances' and 'f' is 'costs'
    // and push it into the start open list
    startOpenList.insert( [0, [startCell[0], startCell[1]]] );
    openVisited[ startCell[0] ][ startCell[1] ] = true;
    bylist[ startCell[0] ][ startCell[1] ] = BY_START;
    distances[ startCell[0] ][ startCell[1] ] = 0;
    
    // set the distances and costs value of the end node to be 0
    // and push it into the end open list
    endOpenList.insert( [0, [endCell[0], endCell[1]]] );
    openVisited[ endCell[0] ][ endCell[1] ] = true;
    bylist[ endCell[0] ][ endCell[1] ] = BY_END;
    distances[ endCell[0] ][ endCell[1] ] = 0;
    
    //push start to animate list as searching
    animateCellsList.push( [ [startCell[0], startCell[1]], "searching" ] );
 
    // while both the open lists are not empty
    while( !startOpenList.isEmpty() && !endOpenList.isEmpty() ) 
    {
        if( pathFound )
            break;
        
        // pop the position of start node which has the minimum cost.
        node = startOpenList.extractMin();
        
        r1 = node[1][0];
        c1 = node[1][1];
        closeVisited[r1][c1]=true;
        animateCellsList.push( [node[1], "visited"] );
        
        // get neigbours of the current node
        neighbors = getNeighbors( r1, c1 );
        for( i = 0; i < neighbors.length; i++ ) 
        {   
            neighbor = neighbors[i];

            var m = neighbor[0];
            var n = neighbor[1];

            if( closeVisited[m][n] ) 
                continue;
            
            if( openVisited[m][n] ) 
            {
                // if this node has been inspected by the reversed search,
                // then a path is found.
                if( bylist[m][n] === BY_END ) 
                {
                    //console.log("from start");
                    pathFound = true;   
                    break;
                }
                continue;
            }
 
            // get the distance between current node and neighbor
            // and calculate the next distance
            var newDistance = distances[r1][c1] + ( (m - r1 === 0 || n - c1 === 0) ? 1 : Math.sqrt(2) );
 
            // check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if( !openVisited[m][n] || newDistance < distances[m][n] ) 
            {
                distances[m][n] = newDistance;
                newCost = distances[r1][c1] + calcHeuristicDistance(Math.abs(endCell[0] - m),Math.abs(endCell[1] - n));
                path[m][n] = [r1,c1];
                animateCellsList.push( [[m, n], "searching"] );
                
                if (!openVisited[m][n]) 
                {   
                    openVisited[m][n] = true;
                    bylist[m][n] = BY_START;
                } 
                if (newCost < costs[m][n])
                {
                    costs[m][n] = newCost;
                    startOpenList.insert( [newCost, [m, n]] );
                }   
            }
        }
 
        if( pathFound )
            break;
        
        // pop the position of end node which has the minimum cost.
        node = endOpenList.extractMin();
        
        r2 = node[1][0];
        c2 = node[1][1];

        closeVisited[r2][c2] = true;
        animateCellsList.push( [node[1], "visited"] );
 
        // get neigbours of the current node
        neighbors = getNeighbors( r2, c2 );
        for( i = 0; i < neighbors.length; i++ ) 
        {
            neighbor = neighbors[i];
            var m = neighbor[0];
            var n = neighbor[1];

            if( closeVisited[m][n] ) 
                continue;
    
            if (openVisited[m][n]) 
            {
                // if this node has been inspected by the reversed search,
                // then a path is found.
                if (bylist[m][n] === BY_START) 
                {
                    //console.log("from end");
                    fromEnd = true;
                    pathFound = true;
                    break;
                }
                continue;
            }            
 
            // get the distance between current node and neighbor
            // and calculate the next distance
            var newDistance = distances[r2][c2] + ( (m - r2 === 0 || n - c2 === 0) ? 1 : Math.sqrt(2) );
            
            // check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if( !openVisited[m][n] || newDistance < distances[m][n] ) 
            {
                distances[m][n] = newDistance;
                newCost = distances[r2][c2] + calcHeuristicDistance( Math.abs(startCell[0] - m), Math.abs(startCell[1] - n) );
                path[m][n] = [r2,c2];
                animateCellsList.push( [[m, n], "searching"] );
 
                if( !openVisited[m][n] ) 
                {
                    openVisited[m][n] = true;
                    bylist[m][n] = BY_END;
                }  
                if (newCost < costs[m][n])
                {
                    costs[m][n] = newCost;
                    endOpenList.insert( [newCost, [m, n]] );
                }   
            }        
        } 
    }
 
    //make path from the path found
    makePath( path, pathFound, true, neighbor );
    
    if( fromEnd )
        path[ neighbor[0] ][ neighbor[1] ] = [r2, c2];
    else
        path[ neighbor[0] ][ neighbor[1] ] = [r1, c1];
    
    makePath( path, pathFound, true, neighbor );
     
    return pathFound;
} 
