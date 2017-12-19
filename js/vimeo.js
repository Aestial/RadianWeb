
var vimeo = (function(){
  var verbose = false; // CONSOLE
  var iframe;
  var player;
  // var iframe = document.querySelector('iframe');
  // var player = new Vimeo.Player(iframe);
  var init = function () {
    iframe = document.getElementById("vimeo");
    player = new Vimeo.Player(iframe);
    player.getVideoTitle().then(function(title) {
        console.log('title:', title);
    });
    player.on('play', function() {
        console.log('played the video!');
    });
  };
  var reset = function () {
    player.element.src = player.element.src;
  };
  return {
    init : init,
    reset : reset
  };
})();
