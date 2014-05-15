/*
Router class

Florian Wokurka (2014)
https://github.com/frequencies

In te current state of the project no routing is reuired. 
This class is for future use.
*/

"use strict"

require([], function() {

  function Router(){

  }

  Router.prototype.navigate = function(location){

    // extract the location i.e. .../index.html#welcome ->welcome 
    if(!location)
      var location = $(window.location).attr('href').split('#')[1];

    // simulate location click OR refer to welcome if location wasn't set
    // if(!location)
    //   $('#welcome').click()
    // else  
      $('#'+location).click()
  }

  Router.prototype.bindEvents = function(){
    // $('#welcome').click({locationClassPath: 'js/Welcome'}, this.changeLocationTo)
    $('#music-player').click({locationClassPath: 'js/MusicPlayer'}, this.changeLocationTo)
  } 

  // istantiate passed rendering-class and pass container id
  Router.prototype.changeLocationTo = function(event){
    require([event.data.locationClassPath], function(ShowMe) {
      var showMe = new ShowMe('#page-container')
    })
  }

  var router = new Router()
  router.bindEvents()
  // currently always refer to one page
  router.navigate('music-player')

})