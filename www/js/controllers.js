angular.module('starter.controllers', ['ionic'])
.constant('FORECASTIO_KEY', '0')
.controller('HomeCtrl', function($scope,$state,Weather,DataStore) {
   //read default settings into scope
   console.log('inside home');

   $scope.store  = DataStore.store;
   var latitude  =  DataStore.latitude;
   var longitude = DataStore.longitude;

    //call getCurrentWeather method in factory ‘Weather’
    Weather.getCurrentWeather(latitude,longitude).then(function(resp) {
    $scope.current = resp.data;
    console.log('GOT CURRENT', $scope.current);
    }, function(error) {
      alert('Unable to get current conditions');
      console.error(error);
   });
})
.controller('LocationsCtrl', function($scope,$rootScope, $state,DataStore) {
     $scope.stores = [];
     //var data = window.localStorage.getItem('stores');
     var data = null;
     Parse.initialize("APP_ID","API_KEY");

    if (data != null )  {
        $scope.stores   = null;
        $scope.stores   = JSON.parse(data);
        console.log('using local storage');
   }
   else {
       /*
       var storeObj = Parse.Object.extend("stores");
       var query = new Parse.Query(storeObj);

      query.descending("createdAt");  //specify sorting
      query.limit(20);  //specify limit -- fetch only 20 objects
*/
        // User's location
        var userGeoPoint = new Parse.GeoPoint({latitude: 47.6097, longitude: -122.3331});
        var storeObj = Parse.Object.extend("stores");
        // Create a query for places
        var query = new Parse.Query(storeObj);
        // Interested in locations near user.
        query.near("coords", userGeoPoint);
        // Limit what could be a lot of points.
        query.limit(20);
        // Final list of objects
        query.find({
           success:function(results) { 
               $scope.$apply(function() {
                  var index =0;
                  var Arrlen=results.length ;
                  //console.log(Arrlen);
                   for (index = 0; index < Arrlen; ++index) {
                       var obj = results[index];
                        //console.log(obj);
                        var pGeoPoint = new Parse.GeoPoint({ latitude: obj.attributes.coords.latitude, longitude: obj.attributes.coords.longitude });
                        var distanceFromUser = pGeoPoint.milesTo(userGeoPoint);
                        //var placeDistance = pGeoPoint.milesTo(Parse.User.current().get("coords"));
                        $scope.stores.push({ 
                          id :  obj.id,
                          price : obj.attributes.price,
                          name: obj.attributes.name,
                          address: obj.attributes.address,
                          distance: distanceFromUser,
                          coords: {
                              latitude : obj.attributes.coords.latitude,
                              longitude : obj.attributes.coords.longitude
                          }
                        });
                   }
                  window.localStorage.setItem('stores', JSON.stringify($scope.stores));
            });     
        },
        error:function(error) {
              console.log("Error retrieving stores!");
        }
    }); //end query.find
}


$scope.changeStore = function(storeId) {

    //get lat and longitude for seleted location
    var data = JSON.parse(window.localStorage.getItem('stores'));

    var lat  = data[storeId].lat; //latitude
    var lgn  = data[storeId].lgn; //longitude
    var store = (data[storeId].name.length > 0) ? data[storeId].name : data[storeId].address

    DataStore.setStore(store);
    DataStore.setLatitude(lat);
    DataStore.setLongitude(lgn);

    $state.go('tab.home');
}
})
.controller('SettingsCtrl', function($scope) {
  //manages app settings
});