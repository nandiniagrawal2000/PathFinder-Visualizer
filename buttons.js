/*=+=+=+=+=+=+=+=+=+=+=+=+=+ Buttons and Button Functions +=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
 
//Instructions PopOver Button
$( "#instBtn" ).click( function(){
    document.getElementById( 'light' ).style.display = 'block';
    document.getElementById( 'fade' ).style.display = 'block';
});
 
//To close the Instruction Box
$( "#clBtn" ).click( function(){
    document.getElementById( 'light' ).style.display = 'none';
    document.getElementById( 'fade' ).style.display = 'none'
});
 
//Dropdown Menu of Algorithms Button
$( "#algorithms .dropdown-item " ).click( function(){
    if ( ongoingProcess )
    {
        update( "wait" ); 
        return; 
    }
    algorithm = $(this).text();
    updateStartBtn();
    console.log( algorithm );
}); 
 
//For heuristics
$( "#distancemethod .distancemethod" ).click( function(){
    distanceMethod = $(this).text();
    console.log( distanceMethod );
}); 
 
//If diagonal path search is allowed or not
$( "#diagnolBtn" ).click( function(){
    if( ongoingProcess )
    { 
        update( "wait" ); 
        return; 
    }
    if( !diagnolSelected )
    {
        $(this).html( "Click to Disallow Diagnol" );
        diagnolSelected = true;
    }
    else 
    {
        $(this).html( "Click to Allow Diagnol" );
        diagnolSelected = false;
    }
});
 
//Random maze generator
$( "#randomBtn" ).click( function(){
    if( ongoingProcess )
    {
        update( "wait" );
        return; 
    }
    randomWalls();
}); 

//Start Button
$( "#startBtn" ).click( function(){
    if( algorithm == null )
        return;
    if( ongoingProcess )
    {
        update( "wait" );
        return; 
    }
    startGraphExploring();
});
 
//Clear Button
$( "#clearBtn" ).click( function(){
    if( ongoingProcess )
    { 
        update( "wait" ); 
        return; 
    }
    clearOrInitialiseBoard( keepWalls = false );
    $( "#resultsIcon" ).removeClass();
    $( '#results' ).css( "background-color", "inherit" );
    $( "#duration" ).text( "Please select an algorithm and press Start" );
    $( "#resultsIcon" ).addClass("fas fa-exclamation");
    $( "#length" ).text('');
});
 
//When the document is ready after algorithm selection
$(document).ready( function(){
    $('.dropdown-submenu a.dropdown-item ').on( "click", function(e){
      if( ongoingProcess )
        {
          update( "wait" ); 
          return; 
        }
      $(this).next('ul').toggle();
      e.stopPropagation();
      e.preventDefault();
    });
});
