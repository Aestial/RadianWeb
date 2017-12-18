var browser = (function(){
  // Public methods
  var init = function () {
		if (bowser.chrome && bowser.version >= 45){
			  alert('Welcome to the full featured Radian web site!');
		}	else{
				alert('Limited features of this site. Please download the latest Google Chrome version.');
		}
  };
  return {
    init : init
  };
})();
