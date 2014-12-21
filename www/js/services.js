'use strict';
angular.module('starter.services', ['ngResource']).factory('Cities', function() {
    var stores = [];
    return {
        all: function() {
            return stores;
        },
        get: function(storeId) {
            // Simple index lookup
            return stores[storeId];
        }
    }
})
.factory('DataStore', function() {
    //create datastore with default values
    var DataStore = {
        latitude: 0,
        longitude: 0,
        price: 0.00,
        distance: 0,
        address: "",
        currentLocation: {
            latitude: 0,
            longitude: 0
        },
        stores: {}
    };
    DataStore.setStore = function(value) {
        DataStore.store = value;
    };
    DataStore.getStore = function(value) {
        return DataStore.store;
    };
    DataStore.setStores = function(value) {
        DataStore.stores = value;
    };
    DataStore.setLatitude = function(value) {
        DataStore.latitude = value;
    };
    DataStore.setLongitude = function(value) {
        DataStore.longitude = value;
    };
    DataStore.setPrice = function(value) {
        DataStore.price = value;
    };
    DataStore.setDistance = function(value) {
        DataStore.distance = value;
    };
    DataStore.setAddress = function(value) {
        DataStore.address = value;
    };
    DataStore.setCurrentLocation = function(value) {
        DataStore.currentLocation = value;
    };

    return DataStore;
});