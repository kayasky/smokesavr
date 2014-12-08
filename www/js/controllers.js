angular.module('starter.controllers', ['ionic'])
.controller('HomeCtrl', function($scope,$state,DataStore) {
   //read default settings into scope
   $scope.store  = DataStore.store;
   var data = {
       latitude : DataStore.latitude,
       longitude : DataStore.longitude,
       price : DataStore.price,
       distance : DataStore.distance,
       address : DataStore.address
   };

   $scope.current = data;
})
.controller('LocationsCtrl', function($scope,$rootScope, $state,DataStore) {
     $scope.stores = [];
     //var data = window.localStorage.getItem('stores'); //commenting this out for now.
     var data = null;
     Parse.initialize("Mvrt7PkZ9nuhs2wyhsH9HXjUc6A0FOFDBstPH8u6","Sw0Hw9RaoOiln6YDx5s7YgVkKAn8JP6KEw3Uo6Bg");

    if (data != null )  {
        $scope.stores   = null;
        $scope.stores   = JSON.parse(data);
        console.log('using local storage');
   }
   else {
        // User's **dummy** location
        var userGeoPoint = new Parse.GeoPoint({latitude: 47.6097, longitude: -122.3331});
        var storeObj = Parse.Object.extend("stores");
        // Create a query for places
        var query = new Parse.Query(storeObj);
        // Interested in locations near user.
        query.near("coords", userGeoPoint);
        // Limit what could be a lot of points.
        query.limit(50);
        // Final list of objects
        query.find({
           success:function(results) { 
               $scope.$apply(function() {
                  var index =0;
                  var Arrlen=results.length ;
                   for (index = 0; index < Arrlen; ++index) {
                       var obj = results[index];
                        var pGeoPoint = new Parse.GeoPoint({ latitude: obj.attributes.coords.latitude, longitude: obj.attributes.coords.longitude });
                        var distanceFromUser = pGeoPoint.milesTo(userGeoPoint);
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
              console.log("Error retrieving stores!", error);
        }
    }); //end query.find
}


$scope.changeStore = function(storeId) {

    //get lat and longitude for seleted location
    var data = JSON.parse(window.localStorage.getItem('stores'));

    var lat  = data[storeId].coords.latitude; //latitude
    var lgn  = data[storeId].coords.longitude; //longitude
    var store = (data[storeId].name.length > 0) ? data[storeId].name : data[storeId].address;
    var price = data[storeId].price;
    var distance = data[storeId].distance;
    var address = data[storeId].address;

    DataStore.setStore(store);
    DataStore.setLatitude(lat);
    DataStore.setLongitude(lgn);
    DataStore.setPrice(price);
    DataStore.setDistance(distance);
    DataStore.setAddress(address);

    $state.go('tab.home');
}
})
.controller('SettingsCtrl', function($scope) {
  //manages app settings
});