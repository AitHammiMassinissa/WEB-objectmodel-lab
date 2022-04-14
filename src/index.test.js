const fs = require('fs').promises;

import {version,} from '.';
import { Importation_de_obj, Importation_de_fichier } from '.';

let data;
beforeAll(async () => {
  data = await fs.readFile('./resources/sensors_data.json', {
    encoding: 'utf8',
  });
  data = JSON.parse(data);
});

describe('Sensor model tests', () => {
  describe('Dummy tests', () => {
    test('les données sont chargées avec 3 éléments', () => {
      expect(data.length).toBe(3);
    });
    test('numéro de version du modèle', () => {
      expect(version()).toBe('1.0.0');
    });
  });
  describe('Importation', () => {
    test('Importation des données', async () => {
      let created = await Importation_de_obj(data);
      let temp = created.find(e => e.getId() === 1234);
      expect(temp.getData().getValues()).toStrictEqual([23, 23, 22, 21, 23, 23, 23, 25, 25]);
    });
  });
  describe('Importation du fichier', () => {
    test('Importation', async () => {
      let created = await Importation_de_fichier('./resources/sensors_data.json');
      let temp = created.find(e => e.getId() === 1234);
      expect(temp.getData().getValues()).toStrictEqual([23, 23, 22, 21, 23, 23, 23, 25, 25]);
    });
  });
});
