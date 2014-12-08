'use strict';

var forecastioWeather = ['$q', '$resource', '$http', 
  function($q, $resource, $http) {
      
  var url = 'https://api.forecast.io/forecast/APIKEY/';

  var weatherResource = $resource(url, {
    callback: 'JSON_CALLBACK',
  }, {
    get: {
      method: 'JSONP'
    }
  });

  return {
    //getAtLocation: function(lat, lng) {
    getCurrentWeather: function(lat, lng) {
      return $http.jsonp(url + lat + ',' + lng + '?callback=JSON_CALLBACK');
    }
  }
}];

angular.module('starter.services', ['ngResource'])
.factory('Cities', function() {
var stores = [
    
  ];

  return {
    all: function() {
      return stores;
    },
    get: function(storeId) {
      // Simple index lookup
      return stores[storeId];
    }
  }
}).
factory('DataStore', function() {
    //create datastore with default values
    var DataStore = {
        store:       'Miami',
        latitude:   25.7877,
        longitude:  80.2241 };

    DataStore.setStore = function (value) {
       DataStore.store = value;
    };

    DataStore.setLatitude = function (value) {
       DataStore.latitude = value;
    };

    DataStore.setLongitude = function (value) {
       DataStore.longitude = value;
    };

    return DataStore;
})
.factory('Weather', forecastioWeather);