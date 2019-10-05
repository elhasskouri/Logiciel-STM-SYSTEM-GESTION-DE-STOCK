function loading(){

	loading.prototype.master = document.querySelector('#loading');
	
	loading.prototype.start  = function(){
		this.master.classList.add('start');
	}

	loading.prototype.end = function(){
		this.master.classList.add('loaded');
		self = this;
		setTimeout( function(){ loadingControl.master.classList.remove('loaded'); loadingControl.master.classList.remove('start'); } , 1200 );
	}

}

changerForm = function( page ){
	loadingControl.start();
	master = document.querySelector('#content');
	master.innerHTML = page;
	loadingControl.end();
    // hundle pagination
    allspansPagination = document.querySelectorAll(".pagination");
    allspansPagination.forEach(
        function( elm ){
            if( elm.innerText == pageIndex ) elm.classList.add("active");
            else elm.classList.remove("active");
        }
    );
    // hundle rank
    hundleRankUi();
}

function dbGets( req ){
    var result = null;
    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'dataType': 'html',
        'url': "http://localhost:84/",
        'data': { 'request': req, 'action': 'GET' },
        'success': function (data) {
            result = data;
        }
    });
    return JSON.parse( result );
}

function dbPost( req ){
	var result = null;
    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'dataType': 'html',
        'url': "http://localhost:84/",
        'data': { 'request': req, 'action': 'POST' },
        'success': function (data) {
            result = data;
        }
    });
    return result;
}

function alertBox( message ){
    document.querySelector('#alertBox').classList.toggle('hidden');
    document.querySelector('#alertBox div').innerHTML = message;
}

function print( elm ){
    myWindow=window.open('','','width=1000,height=800');
    myWindow.document.write( elm );
    myWindow.document.close(); //missing code
    myWindow.focus();
    myWindow.print(); 
}