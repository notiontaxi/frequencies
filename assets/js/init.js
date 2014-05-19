// GLOBALS

  // FUNCTIONS
  function testIfTouchDevice() {
    return ('ontouchstart' in window) || ('onmsgesturechange' in window) // IE10
  }
  window.isTouchDevice = testIfTouchDevice()


// DEP MANAGEMENT
  require.config({
      baseUrl: 'assets/lib',
      paths: {
            templates: '../templates'
          , js: '../js'
          , home: '../'
          , lib: '.'
      }
  });


// INHERITANCE
__hasProp = {}.hasOwnProperty,
__extends = function(child, parent) { 
  for (var key in parent) { 
    if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; }; 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor(); 
    child.__super__ = parent.prototype; 
    return child; };  


// HACKS
  // hide while it is not in use
   jQuery.mobile.autoInitializePage = false

  // workaround for older safari versions
  if(!Function.prototype.bind){
    Function.prototype.bind = function (bind) {
        var self = this;
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return self.apply(bind || null, args);
        };
    };    
  }


// Helper

// http://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
  Array.prototype.move = function (old_index, new_index) {
      if (new_index >= this.length) {
          var k = new_index - this.length;
          while ((k--) + 1) {
              this.push(undefined);
          }
      }
      this.splice(new_index, 0, this.splice(old_index, 1)[0]);
      return this; // for testing purposes
  };

// http://stackoverflow.com/questions/5023514/how-do-i-normalize-css3-transition-functions-across-browsers
  function whichTransitionEvent(){
      var t;
      var el = document.createElement('fakeelement');
      var transitions = {
        'transition':'transitionend',
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
      }

      for(t in transitions){
          if( el.style[t] !== undefined ){
              return transitions[t];
          }
      }
  }

  var inArray = function(array, needle) {
    var i = -1, index = -1
    for(var i = 0; i < array.length; i++) {
        if(array[i] == needle) {
            index = i
            break
        }
    }
    return index
  };

  var keyInAArray = function(array, needle) {
    var i = -1
    var index = -1

    for (var key in array) {
      i++
      if(key == needle) {
        index = i
        break
      }
    }

    return index
  };

  function aArrayUnique(array) {
      var a = array.concat();
      for(var keyA in array) {
          for(var keyB in array) {
              if(a[keyA] === a[keyB])
                  a.splice(keyB, 1);
          }
      }

      return a;
  };

  function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value) 
}

