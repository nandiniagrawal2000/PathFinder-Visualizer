//Functions to return the calculated distances from selected heuristic functions

function manhattanDist( dx, dy )
{
    return (dx + dy);
}
 
function euclideanDist( dx, dy )
{
    return ( Math.sqrt( Math.pow(dx,2) + Math.pow(dy,2) ) );
}
 
function octileDist( dx, dy )
{
    var F = Math.sqrt(2) - 1;
    return (dx < dy) ? (F*dx+dy) : (F*dy+dx);
}
 
function chebyshevDist( dx, dy )
{
    return Math.max( dx, dy );
}