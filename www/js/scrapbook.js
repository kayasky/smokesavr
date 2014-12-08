/* code to update object */
var storeObj = Parse.Object.extend("stores");

point.id = obj.id;
var location = new Parse.GeoPoint({latitude: obj.attributes.latitude, longitude: obj.attributes.longitude});
point.set("coords", location);
point.save(null, {
  success: function(point) {
    // Saved successfully.
    console.log(point);
  },
  error: function(point, error) {
      console.log(point, error);
    // The save failed.
    // error is a Parse.Error with an error code and description.
  }
});