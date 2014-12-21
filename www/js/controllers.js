angular.module('starter.controllers', ['ionic'])
    .controller('HomeCtrl', function($scope, $state, DataStore) {
        //HomeCtrl empty as of now
    })
    .controller('LocationsCtrl', function($scope, $rootScope, $state, $ionicLoading, DataStore) {
        var data = window.localStorage.getItem('stores');

        // EMPTY stores instance
        $scope.stores = {};

        // STEP 1: Show the Loading overlay
        $ionicLoading.show({
            template: 'Loading...'
        });

        // STEP 3: Get user's current location
        $scope.getUserLocation = function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    DataStore.setCurrentLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    $scope.getStores(DataStore.currentLocation);
                });
            }
        };

        // STEP 4: Get stores based on user's current location.
        $scope.getStores = function(currentLocation) {

            Parse.initialize("Mvrt7PkZ9nuhs2wyhsH9HXjUc6A0FOFDBstPH8u6", "Sw0Hw9RaoOiln6YDx5s7YgVkKAn8JP6KEw3Uo6Bg");

            var userGeoPoint = new Parse.GeoPoint(currentLocation),
                storeObj = Parse.Object.extend("stores"),
                query = new Parse.Query(storeObj);

            // Build the query && execute it
            query.near("coords", userGeoPoint);
            query.limit(20);
            query.find({
                success: function(results) {
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply(function() {
                        var index = 0,
                            Arrlen = results.length;
                        for (index = 0; index < Arrlen; ++index) {
                            if (results[index].attributes.price > 0) {
                                var obj = results[index],
                                    distanceFromUser,
                                    pGeoPoint = new Parse.GeoPoint({
                                        latitude: obj.attributes.coords.latitude,
                                        longitude: obj.attributes.coords.longitude
                                    });
                                distanceFromUser = pGeoPoint.milesTo(userGeoPoint);

                                $scope.stores[obj.id] = {
                                    id: obj.id,
                                    price: obj.attributes.price,
                                    name: obj.attributes.name,
                                    address: obj.attributes.address,
                                    distance: distanceFromUser,
                                    coords: {
                                        latitude: obj.attributes.coords.latitude,
                                        longitude: obj.attributes.coords.longitude
                                    }
                                };
                            }
                        }
                        DataStore.setStores($scope.stores);
                        window.localStorage.setItem('stores', JSON.stringify($scope.stores));
                    });
                },
                error: function(error) {
                    console.log("Error retrieving stores!", error);
                }
            }); //end query.find
        };


        // STEP 5: Call this when user tries to navigate to a certain store
        $scope.changeStore = function(storeId) {

            $state.go('tab.storedetail', {
                'storeId': storeId
            });
        }

        // STEP 2: Call the function to get userLocation
        $scope.getUserLocation();

        // Called when pull to refresh is performed by user
        $scope.doRefresh = function() {
            $scope.getUserLocation();
        }
    })
    .controller('StoreDetailCtrl', function($scope, $stateParams, $state, DataStore) {

        var storeId = $stateParams.storeId,
            data = JSON.parse(window.localStorage.getItem('stores'));

        $scope.current = data[storeId];

        // Open Directions when user taps on Address
        $scope.openDirections = function() {
            var mappApp = "http://maps.google.com/?daddr=" + data.latitude + "," + data.longitude;
            if (ionic.Platform.isIOS()) {
                mappApp = "http://maps.apple.com/?daddr=" + data.address;
            }
            window.open(mappApp, '_blank', 'location=yes');
        };
    })
    .controller('SettingsCtrl', function($scope) {
        //manages app settings
    });
