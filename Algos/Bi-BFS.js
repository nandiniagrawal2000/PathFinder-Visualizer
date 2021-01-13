/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+ Bidirectional Breadth First Search +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
function BiBFS() 
{
    var startOpenList   = [], 
        endOpenList     = [],
        neighbors, 
        neighbor, 
        node,
        BY_START        = 0, 
        BY_END          = 1,
        path            = createPath(),
        openVisited     = createWallsVisited(),
        closeVisited    = createWallsVisited(),
        bylist          = createDistances(),
        pathFound       = false,
        fromEnd         = false,
        i, l, r1, c1, r2, c2;
 
    //push the start nodes into start lists and mark open visited
    startOpenList.push( [startCell[0], startCell[1]] );
    openVisited[ startCell[0] ][ startCell[1] ] = true;
    bylist[ startCell[0] ][ startCell[1] ] = BY_START;
    
    //push the end nodes into end lists and mark open visited
    endOpenList.push( [endCell[0], endCell[1]] );
    openVisited[ endCell[0] ][ endCell[1] ] = true;
    bylist[ endCell[0] ][ endCell[1] ] = BY_END;
    
    //while both the lists are not empty
    while( startOpenList.length && endOpenList.length ) 
    {
        //break if path already found
        if( pathFound )
            break;
 
        // expand start open list
 
        //pops the node from the start list and mark visited        
        node = startOpenList.shift();
        animateCellsList.push( [node, "visited"] );  
        
        r1 = node[0];
        c1 = node[1];
        closeVisited[r1][c1] = true;
 
        //iterate for all the neighbors of current node
        neighbors = getNeighbors( r1, c1 );
        for( i = 0; i < neighbors.length; i++ ) 
        {
            neighbor = neighbors[i];
 
            if( !closeVisited[ neighbor[0] ][ neighbor[1] ] )
            {
                if( openVisited[ neighbor[0] ][ neighbor[1] ] ) 
                {
                    // if this node has been inspected by the reversed search,
                    // then a path is found.
                    if( bylist[ neighbor[0] ][ neighbor[1] ] === BY_END ) 
                    {
                        // console.log("from start");
                        pathFound = true;
                        break;
                    }
                    continue;
                }
                //add neighbor to start list, path, open visited and animate cells list
                startOpenList.push( [neighbor[0], neighbor[1]] );
                path[ neighbor[0] ][ neighbor[1] ] = [r1, c1];
                openVisited[ neighbor[0] ][ neighbor[1] ] = true;
                animateCellsList.push( [neighbors[i], "searching"] );
                bylist[ neighbor[0] ][ neighbor[1] ] = BY_START;
            }
        }
 
        if( pathFound )
            break;
        // expand end open list    
        
        //pops the node from the end list and mark visited
        node = endOpenList.shift();
        animateCellsList.push( [node, "visited"] );
 
        r2 = node[0];
        c2 = node[1];
        closeVisited[r2][c2] = true;
 
        //iterate for all the neighbors of current node
        neighbors = getNeighbors( r2, c2 );
        for( i = 0; i < neighbors.length; i++ ) 
        {
            neighbor = neighbors[i];
 
            if( !closeVisited[ neighbor[0] ][ neighbor[1] ] ) 
            {
                if( openVisited[ neighbor[0] ][ neighbor[1] ] ) 
                {
                    // if this node has been inspected by the reversed search,
                    // then a path is found.
                    if( bylist[ neighbor[0] ][ neighbor[1] ] === BY_START ) 
                    {
                        // console.log("from end");
                        pathFound = true;
                        fromEnd = true;
                        break;
                    }
                    continue;
                }
                //add neighbor to end list, path, open visited and animate cells list
                endOpenList.push( [neighbor[0], neighbor[1] ] );
                path[ neighbor[0] ][ neighbor[1] ] = [r2, c2];
                openVisited[ neighbor[0] ][ neighbor[1] ] = true;
                animateCellsList.push( [neighbors[i], "searching"] );
                bylist[ neighbor[0] ][ neighbor[1] ] = BY_END;   
            }
        }
    }
 
    //call function to create path on the path found
    makePath( path, pathFound, true, neighbor );
 
    //make path from end node
    if( fromEnd )
        path[ neighbor[0] ][ neighbor[1] ] = [r2, c2];
    //make path from start node
    else
        path[ neighbor[0] ][ neighbor[1] ] = [r1, c1];

    makePath( path, pathFound, true, neighbor );
    
    return pathFound;
}