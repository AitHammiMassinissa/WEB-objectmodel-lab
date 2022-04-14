const {
  TimeSeries,
  Datum,
  PercentageSeries,
  TinyInt,
  Percentage,
} = require('./Donnee.js');

class Sensor {
  #id;
  #name;
  #type;
  #data;
  static sensorTypes = [
    'TEMPERATURE',
    'HUMIDITY',
    'LIGHT',
    'SWITCH',
    'DOOR',
    'FAN_SPEED',
  ];
 
  constructor(id, name, type, data) {
    this.#id = id;
    this.#name = name;
    this.#type = type;
    this.#data = data || new Datum();
    if (!Sensor.sensorTypes.includes(type))
    {
      throw new TypeError(
        `Le type doit etre parmis les sensorTypes (${Sensor.sensorTypes.join(', ')})`
      );   
    }
  }
  static Importer_Json(obj) {
    return new Sensor(obj.id, obj.name, obj.type, obj.data);
  }
  getId() {
    return this.#id;
  }
  getName() {
    return this.#name;
  }
  getType() {
    return this.#type;
  }
  getData() {
    return this.#data;
  }
  register(p1, p2) {
    this.#data.register(p1, p2);
  }
}

class Temperature extends Sensor {
  #unite_de_mesure;
  
  constructor(id, name, unit, data) {
    super(id, name, 'TEMPERATURE', data || new TimeSeries());
    this.#unite_de_mesure = unit || 'C';
  }

  static De_Jason(obj) {
    let ts = new TimeSeries(obj.data.values, obj.data.labels);
    return new Temperature(obj.id, obj.name, obj.unit, ts);
  }
  getUnit() {
    return this.#unite_de_mesure;
  }
  De_degre_celcius() {
    const data = this.getData();
    let values = data.getValues();
    let labels = data.getLabels();
    switch (this.#unite_de_mesure) {
      case 'C':
        return new TimeSeries(values, labels);
      case 'K':
        return new TimeSeries(
          values.map((e) => e - 273.15),
          labels
        );
      case 'F':
        return new TimeSeries(
          values.map((e) => (e - 32) * (5 / 9)),
          labels
        );
      default:
        throw new TypeError(
          `La conversion de l'unite de mesure ${this.#unite_de_mesure} n'a pas pue etre faite(implementer)`
        );
    }
  }
  De_degre_farenheit() {
    const data = this.getData();
    let values = data.getValues();
    let labels = data.getLabels();
    switch (this.#unite_de_mesure) {
      case 'C':
        return new TimeSeries(
          values.map((e) => e * (9 / 5) + 32),
          labels
        );
      case 'K':
        return new TimeSeries(
          values.map((e) => (e - 273.15) * (9 / 5) + 32),
          labels
        );
      case 'F':
        return new TimeSeries(values, labels);
      default:
        throw new TypeError(
          `La conversion de l'unite de mesure ${this.#unite_de_mesure} n'a pas pue etre faite(implementer)`
        );
    }
  }
  De_degre_kelvin() {
    const data = this.getData();
    let values = data.getValues();
    let labels = data.getLabels();
    switch (this.#unite_de_mesure) {
      case 'C':
        return new TimeSeries(
          values.map((e) => e + 273.15),
          labels
        );
      case 'K':
        return new TimeSeries(values, labels);
      case 'F':
        return new TimeSeries(
          values.map((e) => (e - 32) * (5 / 9) + 273.15),
          labels
        );
      default:
        throw new TypeError(
          `La conversion de l'unite de mesure ${this.#unite_de_mesure} hasn't been implemented`
        );
    }
  }
}

class Humidity extends Sensor {
 
  constructor(id, name, data) {
    super(id, name, 'HUMIDITY', data || new PercentageSeries());
    if (data && data.constructor.name !== 'PercentageSeries')
    {
      throw new TypeError(`Les données pour ce sesnor doivent etre de type PercentageSeries`);
  }
}

  static De_Jason(obj) {
    let p = new PercentageSeries(obj.data.values, obj.data.labels);
    return new Humidity(obj.id, obj.name, p);
  }
}

class Light extends Sensor {
  
  constructor(id, name, value) {
    super(id, name, 'LIGHT', new Percentage(value ?? 0));
  }
  static De_Jason(obj) {
    return new Light(obj.id, obj.name, obj.data.value);
  }
  isOn() {
    return this.getData().getValue() > 0;
  }
  isBright() {
    return this.getData().getValue() > 80;
  }
}

class Switch extends Sensor {
  
  constructor(id, name, value) {
    super(id, name, 'SWITCH', new TinyInt(value ?? 0));
  }
  static De_Jason(obj) {
    return new Switch(obj.id, obj.name, obj.data.value);
  }
  isOn() {
    return this.getData().getValue() === 1;
  }
}

class Door extends Sensor {
  constructor(id, name, value) {
    super(id, name, 'DOOR', new TinyInt(value ?? 0));
  }
  static De_Jason(obj) {
    return new Door(obj.id, obj.name, obj.data.value);
  }
  isOpened() {
    return this.getData().getValue() === 0;
  }
}

class FanSpeed extends Sensor {
  
  constructor(id, name, data) {
    if (data && data.constructor.name !== 'TimeSeries')
      throw new TypeError(
        `Les données de ce sesnor doivent etre de type TimeSeries`
      );
    super(id, name, 'FAN_SPEED', data ?? new TimeSeries());
  }
  static De_Jason(obj) {
    let ts = new TimeSeries(obj.data.values, obj.data.labels);
    return new FanSpeed(obj.id, obj.name, ts);
  }
  isCurrentlyOver(rpm) {
    return [this.getData().lastValues(1)] > rpm;
  }
}

const sensorTypeToConstructor = {
  TEMPERATURE: Temperature,
  HUMIDITY: Humidity,
  LIGHT: Light,
  SWITCH: Switch,
  DOOR: Door,
  FAN_SPEED: FanSpeed,
};


module.exports = {
  Sensor: Sensor,
  Temperature: Temperature,
  Humidity: Humidity,
  Light: Light,
  Switch: Switch,
  Door: Door,
  FanSpeed: FanSpeed,
  sensorTypeToConstructor: sensorTypeToConstructor,
};