// GLOBAL CONTROL
var debug = false;
// TODO: Fix this temporal globals
// Interface with jQueryExtents (Animation)
var isPlaying = false;
// Script globals
var imageActive = false;
var imageNames = ["French.jpg","Dog.jpg","Chilaquil.jpg","Pug.jpg"];
var isLoaded = false;
var loadBar;

// LOAD MANAGER (THREE)
var manager = new THREE.LoadingManager();
manager.onStart = function( item, loaded, total ) {
    console.log( 'Loading started' );
};
manager.onLoad = function() {
    $('#logo').hover(function(){
    	$('#loadScreen').animateOnce('fadeOut');
    	$.fn.fullpage.setAllowScrolling(true);
    });
    $('#loadBar').animateOnce('fadeOut');
    $('#logo').animateOnce('tada');
    console.log('Loading complete');
    if (!debug) {
    	$('#fullpage').fullpage.moveTo('aboutus');
    }
    isLoaded = true;
    TriggerAnim(1);
};
manager.onProgress = function( item, loaded, total ) {
    //console.log( item, loaded, total );
    loadBar.set((loaded*100.0)/total*1.0)
};
manager.onError = function( url ) {
    console.log( 'Error loading' );
};

// MAIN ON LOADED (Javascript method)
window.addEventListener( 'load', OnLoaded, false );
function OnLoaded() {
	loadBar = document.getElementById('loadBar').ldBar;
	fullpage_init();
	init();
	pixi_init();
	//if (debug) initGUI();
	animate();
	pixi_animate();
}

// ON LOADED (Jquery ready method)
//$(document).ready(function() {
function fullpage_init() {
	$('#fullpage').fullpage({
		sectionsColor: ['rgba(0,0,0,0)'],
		anchors: ['aboutus', 'edesign', 'vfx', 'videogames', 'contact'],
		recordHistory: false,
		menu: '#menu',
    scrollingSpeed: 2000,
		onLeave: function(index, nextIndex, direction){
			//console.log("onLeave--" + "index: " + index + " nextIndex: " + nextIndex + " direction: " +  direction);
			hideBigImage();
		},
		afterRender: function(){
			//console.log("afterRender");
		},
		afterResize: function(){
			//console.log("afterResize");
		},
		afterLoad: function(anchorLink, index){
			//console.log("afterLoad--" + "anchorLink: " + anchorLink + " index: " + index );
			if (isLoaded) {
				TriggerAnim(1);
			}
		}
	});
//});
}

function toggleBigImage(index) {
	if (!isPlaying) {
		if (imageActive) hideBigImage();
		else showBigImage(index);
	}
}
function showBigImage(index) {
	if (!imageActive) {
		var imageName = imageNames[index];
		$('#bigImage').css({
        	"background-image": "url('images/"+imageName+"')"
        }).animateOnce('fadeInRight');
		$( '.bigImage_toggle' ).text( "Close project" );
		imageActive = true;
	}
}
function hideBigImage() {
	if (imageActive) {
		$('#bigImage').animateOnce('fadeOutRight');
		$( '.bigImage_toggle' ).text( "View project" );
		imageActive = false;
	}
}
