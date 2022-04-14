const {
  TimeSeries,
  Datum,
  PercentageSeries,
  TinyInt,
  Percentage,
} = require('./Donnee.js');


/*****************Tester donnee***********************/

describe('Test class donnee', () => {

  /*****************Tester Timeseries***********************/

  describe('Test de la class Timeseries ', () => {
    let Time_series_vide = new TimeSeries();
    let filledTs = new TimeSeries(
      [1, 2, 3, 4],
      ['1', '2', '3', '4']
    );
    test('Tester si le constrcuteur filledTs est définie', () => {
      expect(filledTs).toBeDefined();
    });
    test('Récupération de valeur', () => {
      expect(filledTs.getValues()).toStrictEqual([1, 2, 3, 4]);
    });
    test('Récupération des labels', () => {
      expect(filledTs.getLabels()).toStrictEqual(['1', '2', '3', '4']);
    });
    test('Tester register', () => {
      Time_series_vide.register(1, 'Premiere valeur',);
      Time_series_vide.register(2, 'deuxieme valeur',);
      expect(Time_series_vide.getValues()[0]).toBe(1);
      expect(Time_series_vide.getValues()[1]).toBe(2);
      expect(Time_series_vide.getLabels()[0]).toBe('Premiere valeur');
      expect(Time_series_vide.getLabels()[1]).toBe('deuxieme valeur');
    });
    test('Test la moyenne (avrage)', () => {
      expect(filledTs.average()).toBe(2.5);
    });
    test('Moyenne des deux dernier', () => {
      expect(filledTs.average(2)).toBe(3.5);
    });
    test('Verification des exception ', () => {
      expect(() => new TimeSeries(1, ['1', '2', '3'])).toThrow(TypeError);
      expect(() => new TimeSeries([1, 2, 3], '1,2,3')).toThrow(TypeError);
      expect(() => new TimeSeries([1, 2, 3], ['1', '2', '3', '4'])).toThrow(
        TypeError
      );
    });
    test('Essayer d enregistrer des valeur incorrect ', () => {
      expect(() => Time_series_vide.register('3', '3')).toThrow(TypeError);
      expect(() => Time_series_vide.register(2, 2)).toThrow(TypeError);
    });
    test('Retourner les trois dernier chiffre', () => {
      expect(filledTs.lastValues(3)).toStrictEqual([2,3,4]);
    });
  });



/*********************Test Dtaum*************************/


  describe('Test de Datum', () => {
    let datum = new Datum(1);
    
    test('Tester si le constructeur est definie', () => {
      let d = new Datum();
      expect(d.getValue()).toBeDefined();
    });
    test('Tester constructeur vide', () => {
      let d = new Datum();
      expect(d.getValue()).toBeNull();
    });
   
    test('Tester constructeur', () => {
      let d2 = new Datum(0);
      expect(d2.getValue()).toBe(0);
    });
    test('Tester un constructeur non valide ', () => {
      expect(() => new Datum('constructeur Invalide')).toThrow(TypeError);
    });
    test('Recuperation de la valeur ', () => {
      expect(datum.getValue()).toBe(1);
    });
    test('Tester register', () => {
      datum.register(0);
      expect(datum.getValue()).toBe(0);
    });
    test('Tester des valeur fausse dans register', () => {
      expect(() => datum.register('valeur fausse')).toThrow(TypeError);
    });
  });

/*********************PercentageSeries Test *************/


  describe('PercentageSeries tests', () => {
    let p = new PercentageSeries();
    test('Invalid constructors', () => {
      expect(() => new PercentageSeries([-1], ['-1'])).toThrow(TypeError);
      expect(() => new PercentageSeries([101], ['101'])).toThrow(TypeError);
    });
    test('Register invalid', () => {
      expect(() => p.register(-1, 'Test')).toThrow(TypeError);
      expect(() => p.register(101, 'Test')).toThrow(TypeError);
    });
    test('Register valid', () => {
      p.register(1, 'Test');
      expect(p.getValues()).toStrictEqual([1]);
    });
  });




/****************Tester TinyInt****************************/



  describe('Test de TinyInt', () => {
    test('Tester le constructeur ', () => {
      expect(new TinyInt().getValue()).toBe(0);
      expect(new TinyInt(1).getValue()).toBe(1);
    });
    test('Test de Register avec des params invalide ', () => {
      let ti = new TinyInt(1);
      expect(() => ti.register(2)).toThrow(TypeError);
    });
  });




/****************Tester Percentage****************************/



describe('Percentage', () => {
  test('Tester constructeur ',()=>{
    expect(new Percentage().getValue()).toBe(0);
    expect(new Percentage(100).getValue()).toBe(100);
  });
    test('Tester le constructeur avec des faux params', () => {
      expect(() => new Percentage(-1)).toThrow(TypeError);
      expect(() => new Percentage(101)).toThrow(TypeError);
    });
    test('Tester register avec de faux params', () => {
      let p = new Percentage(0);
      expect(() => p.register(101)).toThrow(TypeError);
    });
    test('Tester register ', () => {
      let p = new Percentage(0);
      p.register(100);
      expect(p.getValue()).toBe(100);
    });
  });
});
