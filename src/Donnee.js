class Data {}
class TimeSeries extends Data {
  #values;
  #labels;
  constructor(values, labels) {
    super();
    this.#values = values || [];
    this.#labels = labels || [];
    if (values && !Array.isArray(values)) {
      throw new TypeError("les valeurs doivent etre une liste");
    }
    if (labels && !Array.isArray(labels)) {
      throw new TypeError("Les labels doivent etres une liste ");
    }
    if (labels && values && labels.length !== values.length) {
      throw new TypeError(
        "Les labels et les valeurs doivent avoir la meme taille"
      );
    }
    if (labels?.some((l) => typeof l !== "string")) {
      throw new TypeError("Les labels doivent etre une liste");
    }
    if (values?.some((v) => typeof v !== "number")) {
      throw new TypeError("Les valeur doivent etres tous des nombres");
    }
  }
  register(value, label) {
    this.#values.push(value);
    this.#labels.push(label);
    if (typeof value !== "number") {
      throw new TypeError("La valeur doit etre un nombre ");
    }
    if (typeof label !== "string") {
      throw new TypeError("Les labels doivent etre des string");
    }
  }
  average(lastValuesCnt) {
    let averageFrom = this.#values;
    if (lastValuesCnt) {
      averageFrom = averageFrom.slice(averageFrom.length - lastValuesCnt);
    }
    return averageFrom.reduce((acc, val) => acc + val) / averageFrom.length;
  }
  lastValues(count) {
    return this.#values.slice(this.#values.length - count);
  }
  getValues() {
    return this.#values.slice();
  }
  getLabels() {
    return this.#labels.slice();
  }
}
class Datum extends Data {
  #value;
  constructor(value) {
    super();
    if (value !== null && value !== undefined && typeof value !== "number") {
      console.log(`La valeur est (Fucked up) : ${value}`);
      throw new TypeError("La valeur doit etre un nombre ");
    }
    this.#value = value ?? null;
  }
  register(value) {
    this.#value = value;
    if (typeof value !== "number") {
      throw new TypeError("La valeur doit etre un nombre ");
    }
  }
  getValue() {
    return this.#value;
  }
}
class PercentageSeries extends TimeSeries {
  constructor(values, labels) {
    super(values, labels);
    if (values && values.some((v) => v < 0 || v > 100)) {
      throw new TypeError(
        `Les valeurs doivent etre entre 0 et 100, ceux-ci ne correspondent pas à cette condition : (${values
          .filter((v) => v < 0 || v > 100)
          .join(", ")})`
      );
    }
  }
  register(value, label) {
    if (value > 100 || value < 0)
    throw new TypeError('La valeur doit etre entre 0 et 100');
  super.register(value, label);
  }
}
class TinyInt extends Datum {
  constructor(value) {
    super(value ?? 0);
    if (value && value !== 0 && value !== 1) {
      throw new TypeError(`La valeur doit etre 1 ou 0`);
    }
  }
  register(value) {
    super.register(value);
    if (value !== 0 && value !== 1) {
      throw new TypeError(`La valeur doit etre 1 ou 0`);
    }
  }
}
class Percentage extends Datum {
  constructor(value) {
    super(value || 0);
    if (value < 0 || value > 100) {
      throw new TypeError(` La valeur doit etre entre 0 et 100`);
    }
  }
  register(value) {
    super.register(value);
    if (value < 0 || value > 100) {
      throw new TypeError(` La valeur doit etre entre 0 et 100`);
    }
  }
}
module.exports = {
  Data: Data,
  Datum: Datum,
  TimeSeries: TimeSeries,
  PercentageSeries: PercentageSeries,
  TinyInt: TinyInt,
  Percentage: Percentage,
};
