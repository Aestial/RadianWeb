// GLOBAL CONTROL
var debug = true;
// TODO: Fix this temporal globals
// Interface with jQueryExtents (Animation)
var isPlaying = false;
// Script globals
var imageActive = false;
var imageNames = ["French.jpg","Dog.jpg","Chilaquil.jpg","Pug.jpg"];
var isLoaded = false;
var loadBar;

var fullPageParams = {
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
      triggerAnim(1);
    }
  }
};

// LOAD MANAGER (THREE)
var manager = new THREE.LoadingManager();
manager.onStart = onManagerStart;
manager.onLoad = onManagerLoad;
manager.onProgress = onManagerProgress;
manager.onError = onManagerError;
// Manager Handlers
function onManagerStart (item, loaded, total) {
  console.log( 'Loading started' );
}
function onManagerLoad () {
  console.log('Loading complete');
  $('#logo').hover(OnEnterPage);
  $('#loadBar').animateOnce('fadeOut');
  $('#logo').animateOnce('tada');
  if (!debug) {
    $('#fullpage').fullpage.moveTo('aboutus');
  }
  isLoaded = true;
}
function onManagerProgress (item, loaded, total) {
  loadBar.set((loaded*100.0)/total*1.0)
}
function onManagerError (url) {
  console.log( 'Error loading' );
}
function OnEnterPage ()
{
  $('#loadScreen').animateOnce('fadeOut');
  $.fn.fullpage.setAllowScrolling(true);
  //if (debug) initGUI();
  animate();
  pixi_animate();
  triggerAnim(1);
}
// MAIN ON LOADED (Javascript method)
window.addEventListener( 'load', onWindowLoaded, false );
function onWindowLoaded() {
  loadBar = document.getElementById('loadBar').ldBar;
  fullpage_init();
  init();
  pixi_init();
}
// ON LOADED (Jquery ready method)
//$(document).ready(function() {
function fullpage_init() {
  $('#fullpage').fullpage(fullPageParams);
  //});
}
// Description images behaviour
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
