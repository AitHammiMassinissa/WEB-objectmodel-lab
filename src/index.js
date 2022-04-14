export const version = () => '1.0.0';
const fs = require('fs');
const { sensorTypeToConstructor } = require('./Sensors.js');
async function Importation_de_fichier(file) {
  let data;
  data = fs.readFileSync(file, {
    encoding: 'utf8',
  });
  return Importation_de_obj(JSON.parse(data));
}

async function Importation_de_obj(data) {
  let createdSensors = [];
  data.forEach(sensor => {
    let { type } = sensor;
    for(let sensorType in sensorTypeToConstructor) {
      if(type.toUpperCase() === sensorType) {
        createdSensors.push(sensorTypeToConstructor[sensorType].Importer_Json(sensor));
      }
    }
  });
  return createdSensors;
}

module.exports = {
  version: version,
  Importation_de_fichier: Importation_de_fichier,
  Importation_de_obj: Importation_de_obj
};