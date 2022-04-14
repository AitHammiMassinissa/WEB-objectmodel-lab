const {
  Sensor,
  Temperature,
  Humidity,
  Light,
  Switch,
  Door,
  FanSpeed,
} = require('./Sensors.js');
const { 
  Datum, 
  TimeSeries,
  Percentage 
} = require('./Donnee.js');



/********************Test de Sensor********************/


describe('Test de la class SENSOR', () => {


  describe('Test du constructeur', () => {

    test('Avec des parametre non valide', () => {
      expect(() => new Sensor(1, 'name', 'NOT_A_TYPE')).toThrow(TypeError);
    });

   
    test('Tester la définition du constructeur avec des parametre', () => {
      let datum = new Datum(1);
      let sensor = new Sensor(1,'name','TEMPERATURE',datum);
      expect(sensor).toBeDefined();
    });

    test('Tester getvalue()', () => {
      let s = new Sensor(1, 'name', 'TEMPERATURE', new Datum(1));
      expect(s.getData().getValue()).toBe(1);
    });
   
    test('Tester les getteur', () => {
      let s = new Sensor(1, 'name', 'TEMPERATURE', new Datum(23));
      expect(s.getId()).toBe(1);
      expect(s.getName()).toBe('name');
      expect(s.getType()).toBe('TEMPERATURE');
    });
    test('Tester l\'importation json', () => {
      let s = Sensor.Importer_Json({
        id: 1234,
        name: 'Température Bureau',
        type: 'TEMPERATURE',
        data: {
          values: [23, 23, 22, 21, 23, 23, 23, 25, 25],
          labels: [
            '2021-01-19T08:00:00.000Z',
            '2021-01-19T09:00:00.000Z',
            '2021-01-19T10:00:00.000Z',
            '2021-01-19T11:00:00.000Z',
            '2021-01-19T12:00:00.000Z',
            '2021-01-19T13:00:00.000Z',
            '2021-01-19T14:00:00.000Z',
            '2021-01-19T15:00:00.000Z',
            '2021-01-19T16:00:00.000Z',
          ],
        },
      });
      expect(s.getId()).toBe(1234);
      expect(s.getName()).toBe('Température Bureau');
      expect(s.getType()).toBe('TEMPERATURE');
    });
  });



/*****************Tester Temperature*********************/
 
describe('Temperature sensor', () => {
  // différentes valeur de degré

  let valeur_en_celsius = new TimeSeries([0, 20], ['0', '20']);
  let celsius = new Temperature(1, 'celsius', 'C', valeur_en_celsius);
  test('Constructeur sans unité', () => {
    let t = new Temperature(1, 'celsius');
    expect(t.getUnit()).toBe('C');
  });

  let valeur_en_kelvin = new TimeSeries([273.15], ['273,15']);
  let valeur_en_farenheit = new TimeSeries([5, 50], ['5', '50']);

  
  let kelvin = new Temperature(1, 'kelvin', 'K', valeur_en_kelvin);
  let farenheit = new Temperature(1, 'farenheit', 'F', valeur_en_farenheit);
  describe('Tester les différentes conversion celsius', () => {
  test('celsius => farenheit', () => {
    expect(celsius.De_degre_farenheit().getValues()).toStrictEqual([32, 68]);
   });
  test('celsius => kelvin', () => { 
    expect(celsius.De_degre_kelvin().getValues()).toStrictEqual([273.15, 293.15]);
  });
  test('celsius => verification', () => {
    expect(celsius.De_degre_celcius().getValues()).toStrictEqual(
      celsius.getData().getValues()
      );
  });
});
describe('Tester les différentes conversion farenheit', () => {
  test('farenheit => celsius', () => {
    expect(farenheit.De_degre_celcius().getValues()).toStrictEqual([-15, 10]);
   });
  test('farenheit => kelvin', () => { 
    expect(farenheit.De_degre_kelvin().getValues()).toStrictEqual([258.15, 283.15]);
  });
  test('farenheit => verification', () => {
    expect(farenheit.De_degre_farenheit().getValues()).toStrictEqual(
      farenheit.getData().getValues()
    );
  });
});
 
describe('Tester les différentes conversion kelvin', () => {
  test('Kelvin => farenheit', () => {
    expect(kelvin.De_degre_farenheit().getValues()).toStrictEqual([32]);
   });
  test('kelvin => celcius', () => { 
    expect(kelvin.De_degre_celcius().getValues()).toStrictEqual([0]);
  });
  test('kelvin => verification', () => {
    expect(kelvin.De_degre_kelvin().getValues()).toStrictEqual(
      kelvin.getData().getValues()
    );
  });
});
  test('Tester des conversion invalide ', () => {
    let t = new Temperature(1, 't', 'NOT_A_UNIT');
    expect(() => t.De_degre_celcius()).toThrow(TypeError);
    expect(() => t.De_degre_farenheit()).toThrow(TypeError);
    expect(() => t.De_degre_kelvin()).toThrow(TypeError);
  });
});



/*********************Tester Humidity **********************/

describe('Tester Humidity de sensor', () => {
  test('Tester si le constructeur est définie', () => {
    let h = new Humidity(1, 'hum');
    h.register(50, 'Test');
    expect(h).toBeDefined();
  });
  test('Test du constructeur', () => {
    expect(() => new Humidity(1, 'hum', new TimeSeries())).toThrow(TypeError);
    let h = new Humidity(1, 'hum');
    h.register(50, 'Test');
    expect(h.getData().getValues()).toStrictEqual([50]);
  });
  test('Tester l\'importation json', () => {
    let h = Humidity.De_Jason({
      id: 1,
      name: 'Humidité salle',
      type: 'HUMIDITY',
      data: {
        values: [1, 2, 3, 4, 5],
        labels: ['1', '2', '3', '4', '5'],
      },
    });
    expect(h.getId()).toBe(1);
    expect(h.getName()).toBe('Humidité salle');
    expect(h.getType()).toBe('HUMIDITY');
  });
});


/*********************Tester Light **********************/


describe('Test Light de sensor', () => {

  test('Tester si le constructeur est définie', () => {
    let l= new Light(1, 'l', 50);
    expect(l).toBeDefined();
  });

  test('Tester le constructeur', () => {
    expect(() => new Light(1, 'l', -1)).toThrow(TypeError);
    expect(new Light(1, 'l', 50).getData().getValue()).toBe(50);
  });
  describe('Test les méthode de customisation', () => {
    let l1 = new Light(0, 'off');
    let l2 = new Light(1, 'l', 60);
    let lBright = new Light(2, 'l2', 90);
  test('Tester isOn', () => { 
    expect(l1.isOn()).toBeFalsy();
    expect(l2.isOn()).toBeTruthy();
  });
  test('Tester isBright', () => {
    expect(lBright.isBright()).toBeTruthy();
  });
});
  test('Test Importation ', () => {
    let h = Light.De_Jason({
      id: 0,
      name: 'Lumiere Salon',
      type: 'LIGHT',
      data: {
        value: 0,
      },
    });
    expect(h.getId()).toBe(0);
    expect(h.getName()).toBe('Lumiere Salon');
    expect(h.getType()).toBe('LIGHT');
  });
});


/*********************Tester Switch **********************/


describe('Switch', () => {
  test('Tester si le constructeur est définie', () => {
    let s= new Switch(1, 's', 1);
    expect(s).toBeDefined();
  });
  test('Tester le constructeur', () => {
    expect(() => new Switch(1, 's', -1)).toThrow(TypeError);
    expect(new Switch(1, 's', 1).getData().getValue()).toBe(1);
    expect(new Switch(1, 's').getData().getValue()).toBe(0);
  });


  test('Tester les methode de customisation', () => {
    let s = new Switch(1, 's', 1);
    expect(s.isOn()).toBeTruthy();
  });
});


/*********************Tester Door **********************/


describe('Tester Door de sensor', () => {

  test('Tester si le constructeur est définie', () => {
    let d= new Door(2, 'd2', 1);
    expect(d).toBeDefined();
  });
  test('Tester le constructeur', () => {
    expect(() => new Door(1, 'd', -1)).toThrow(TypeError);
    expect(new Door(2, 'd2', 1).getData().getValue()).toBe(1);
    expect(new Door(3, 'd3').getData().getValue()).toBe(0);
  });
  test('Tester la methode de customisation', () => {
    let d = new Door(1, 'd');
    expect(d.isOpened()).toBeTruthy();
    d.register(1);
    expect(d.isOpened()).toBeFalsy();
  });
  test('Tester l\'importation', () => {
    let h = Switch.De_Jason({
      id: 0,
      name: 'Interrupteur',
      type: 'SWITCH',
      data: {
        value: 0,
      },
    });
    expect(h.getId()).toBe(0);
    expect(h.getName()).toBe('Interrupteur');
    expect(h.getType()).toBe('SWITCH');
  });
});

/*********************Tester de FanSpeed ******************/



describe('Tester FanSpeed de sensor', () => {
  test('Tester si le constructeur est définie', () => {
    let f = new FanSpeed(1, 'f');
    expect(f).toBeDefined();
  });
  test('Tester le constructeur', () => {
    expect(() => new FanSpeed(1, 'f', new Percentage(0))).toThrow(TypeError);
  });
  test('Tester la methode de customisation ', () => {
    let f = new FanSpeed(1, 'f');
    f.register(2400, 'Now');
    expect(f.isCurrentlyOver(2000)).toBeTruthy();
  });
});
});