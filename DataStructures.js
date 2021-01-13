//Data structures used for string cells and implementing the algorithms

function Queue() 
{ 
    this.stack = new Array();
    this.dequeue = function(){
        return this.stack.pop(); 
    } 
    this.enqueue = function( item ){
        this.stack.unshift(item);
        return;
    }
    this.isEmpty = function(){
        return ( this.stack.length == 0 );
    }
}
 
function minHeap() 
{
    this.heap = [];
 
    this.isEmpty = function(){
        return ( this.heap.length == 0 );
    }
 
    this.extractMin = function(){
        if( this.isEmpty() )
            return null;
        
        var min = this.heap[0];
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap[this.heap.length - 1] = min;
        this.heap.pop();
        if( !this.isEmpty() )
            this.bubbleDown(0);
        return min;
    }
 
    this.insert = function( item ){
        this.heap.push(item);
        this.bubbleUp(this.heap.length - 1);
        return;
    }
 
    this.parent = function( index ){
        if( index == 0 )
            return null;
        return Math.floor( (index-1) / 2 );
    }
 
    this.children = function( index ){
        return [(index * 2) + 1, (index * 2) + 2];
    }
 
    this.bubbleDown = function( index ){
        var children = this.children(index);
        var newIndex = index;
        if( children[0] <= (this.heap.length - 1) && this.heap[newIndex][0] > this.heap[children[0]][0] )
            newIndex = children[0];
        if( children[1] <= (this.heap.length - 1) && this.heap[newIndex][0] > this.heap[children[1]][0] )
            newIndex = children[1];
 
        // No bubbling down needed
        if( newIndex === index )
            return;
 
        //swap    
        var val = this.heap[index];
        this.heap[index] = this.heap[newIndex];
        this.heap[newIndex] = val;
        this.bubbleDown(newIndex);
        return;
    }
 
    this.bubbleUp = function( index ){
        var parent = this.parent(index);
        if( parent !== null && this.heap[index][0] < this.heap[parent][0] )
        {
            var val = this.heap[index];
            this.heap[index] = this.heap[parent];
            this.heap[parent] = val;
            this.bubbleUp(parent);
        }
        return;
    }
}