angular.module('starter.controllers', ['ionic'])
    .controller('HomeCtrl', function($scope, $state, DataStore) {
        //HomeCtrl empty as of now
    })
    .controller('LocationsCtrl', function($scope, $rootScope, $state, $ionicLoading, DataStore) {
        var data = window.localStorage.getItem('stores'),
            mockLocation = true,
            maxStores = 20;
        // EMPTY stores instance
        $scope.stores = {},
        $scope.maxDistance = 50; //max search radius in miles

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
                    $scope.getStores(DataStore.currentLocation, $scope.maxDistance);
                });
            }
        };

        // STEP 4: Get stores based on user's current location.
        $scope.getStores = function(currentLocation, maxDistance) {

            Parse.initialize("Mvrt7PkZ9nuhs2wyhsH9HXjUc6A0FOFDBstPH8u6", "Sw0Hw9RaoOiln6YDx5s7YgVkKAn8JP6KEw3Uo6Bg");

            var userGeoPoint = new Parse.GeoPoint(currentLocation),
                storeObj = Parse.Object.extend("stores"),
                query = new Parse.Query(storeObj);

            // Build the query && execute it
            //query.near("coords", userGeoPoint);
            query.withinMiles("coords", userGeoPoint, maxDistance)
            query.limit(maxStores);
            query.find({
                success: function(results) {
                    $scope.stores = {};
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
        if (mockLocation) {
            DataStore.setCurrentLocation({
                latitude: 47.6097,
                longitude: -122.3331
            });
            $scope.getStores(DataStore.currentLocation, $scope.maxDistance);
        } else {
            $scope.getUserLocation();
        }

        // Called when pull to refresh is performed by user
        $scope.doRefresh = function() {
            $scope.getUserLocation();
        }

        $scope.setMaxDistance = function(max) {
            var dragObj = max,
                distance = dragObj.distance;

            if ((2 < distance < 101) && ($scope.maxDistance !== distance)) {
                $scope.maxDistance = distance;
                $scope.getStores(DataStore.currentLocation, $scope.maxDistance);
            }
        }

    })
    .controller('StoreDetailCtrl', function($scope, $stateParams, $state, DataStore) {

        var storeId = $stateParams.storeId,
            data = JSON.parse(window.localStorage.getItem('stores'));

        $scope.current = data[storeId];
        $scope.current.streetView = "https://maps.googleapis.com/maps/api/streetview?size=640x640&location=" + $scope.current.address + "&fov=100&pitch=-30&key=AIzaSyCfIddS2nOkwKCAmhDEDAx2rvPfjuCBqFc";

        // Open Directions when user taps on Address
        $scope.openDirections = function() {
            var mappApp = "http://maps.google.com/?daddr=" + $scope.current.coords.latitude + "," + $scope.current.coords.longitude;
            if (ionic.Platform.isIOS()) {
                mappApp = "http://maps.apple.com/?daddr=" + $scope.current.address;
            }
            window.open(mappApp, '_blank', 'location=yes');
        };
    })
    .controller('SettingsCtrl', function($scope) {
        //manages app settings
    })
