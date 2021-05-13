const csv = require('csv-parser');
const fs = require('fs');
const https = require('https');
const axios = require('axios');

const {csvToList, calculateDistance, orderByProximity} = require('./distanceCalculator.js');

/** Execution flow */
// collect args
const [exe, file, ...argValues] = process.argv;
const [latitude, longitude, resource] = argValues;


async function initProgram ({latitude, longitude, resource}) {
  // exit when malformed
  if( isNaN(latitude) || isNaN(longitude)) {
    console.log('please input digit based coordinates only');
    return;
  }

  if (!resource) {
    console.log('please input a valid resource');
    return;
  }
  console.log('processing valid input: ', latitude, longitude, resource);

  // api
  const token = 'AA5HVELWEJRKDGHELZ6232DAOHE54';
  const path = `https://raw.githubusercontent.com/allinfra-ltd/test_oop/master/${resource}`;

  // fetch list from resource
  try {
    const res = await axios.get(path, {
      params: {
        token,
        responseType: 'blob',
      }
    });

    // normalize
    const locations = csvToList( res.data );
    // apply calculus
    const distances = calculateDistance(locations, {
      latitude: parseFloat(latitude), 
      longitude: parseFloat(longitude)
    });
    // sort
    const nearestDistances = orderByProximity(distances);

    // output
    console.log(nearestDistances)

  } catch(err) {
    console.error(err);
  }
  // exit
  
}

// start
initProgram({ latitude, longitude, resource });

// use local resources ===========
// const results = [];
// fs.createReadStream('locations.csv')
//   .pipe(csv(['Name', 'latitude', 'longitude']))
//   .on('data', (data) => results.push(data))
//   .on('end', () => {
//      console.log(results);
//   });
// ===============================
