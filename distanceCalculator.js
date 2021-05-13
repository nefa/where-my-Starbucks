const haversine = require('haversine-distance');

class DistanceCalculator {

  static csvToList(data) {
    return data.split('\n').map(location => {
      const [name, latitude, longitude] = location.split(',');
      return {name, latitude: parseFloat(latitude), longitude: parseFloat(longitude)};
    });
  }

  static calculateDistance(locationList, currentLocation) {
    return locationList.map(({latitude, longitude, name}) => {
      const distance = haversine({
        latitude, 
        longitude
      }, 
      {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude
      });

      return {name, distance /** 0.000621371192 //transform to miles */};
    });
  }

  static orderByProximity(locationList) {
    return locationList.sort((a, b) => {
      if (a.distance < b.distance) return -1;

      if (a.distance > b.distance) return 1;

      return 0;
    })
  }
}

module.exports = DistanceCalculator;
