angular.module('starter.controllers', ['ionic'])
    .controller('HomeCtrl', function($scope, $state, DataStore) {
        //HomeCtrl empty as of now
    })
    .controller('StoreDetailCtrl', function($scope, $rootScope, $state, DataStore) {
        var data = {
            latitude: DataStore.latitude,
            longitude: DataStore.longitude,
            price: DataStore.price,
            distance: DataStore.distance,
            address: DataStore.address
        };
        $scope.store = DataStore.store;
        $scope.current = data;
    })
    .controller('LocationsCtrl', function($scope, $rootScope, $state, DataStore) {
        var data = window.localStorage.getItem('stores');

        $scope.stores = {};
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
                        window.localStorage.setItem('stores', JSON.stringify($scope.stores));
                    });
                },
                error: function(error) {
                    console.log("Error retrieving stores!", error);
                }
            }); //end query.find
        };

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

        $scope.changeStore = function(storeId) {
            var data = JSON.parse(window.localStorage.getItem('stores')),
                lat = data[storeId].coords.latitude, //latitude
                lgn = data[storeId].coords.longitude, //longitude
                price = data[storeId].price,
                distance = data[storeId].distance,
                address = data[storeId].address,
                store = (data[storeId].name.length > 0) ? data[storeId].name : data[storeId].address;

            DataStore.setStore(store);
            DataStore.setLatitude(lat);
            DataStore.setLongitude(lgn);
            DataStore.setPrice(price);
            DataStore.setDistance(distance);
            DataStore.setAddress(address);

            $state.go('tab.storedetail', {
                'storeId': storeId
            });
        }

        $scope.getUserLocation();
    })
    .controller('SettingsCtrl', function($scope) {
        //manages app settings
    });