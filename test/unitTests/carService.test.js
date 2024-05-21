const { describe, it, before, beforeEach, afterEach } = require('mocha');
const CarService = require('../../src/service/carService');
const { join } = require('path');
const { expect } = require('chai');
const carsDatabase = join(__dirname, './../../database', 'cars.json');

const sinon = require('sinon');
const mocks = {
  validCar: require('./../mocks/valid-car.json'),
  validCarCategory: require('./../mocks/valid-carCategory.json'),
  validCustomer: require('./../mocks/valid-customer.json'),
};

describe('CarService Suite Test', () => {
  let carService = {};
  let sandbox = {};
  before(() => {
    carService = new CarService({
      cars: carsDatabase
    });
  });
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should retrieve a random position from a array', async () => {
    const data = [0,1,2,3,4];
    const result = await carService.getRandomPositionFromArray(data);

    expect(result).to.be.lte(data.length).and.be.gte(0);
      // menor que o tamanho de data e maior que 0
  });

  it('should choose the first id from carIds in carCategory', async () => {
    const carCategory = mocks.validCarCategory;
    const carIdIndex = 0;

    sandbox.stub(
      carService,
      carService.getRandomPositionFromArray.name
    ).returns(carIdIndex);

    const result = await carService.chooseRandomCar(carCategory);
    const expected = carCategory.carIds[carIdIndex];

    expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok;
      // teste se 'carService.getRandomPositionFromArray' é chamado apenas uma vez
        // spy
    expect(result).to.be.equal(expected);
  });

  it('given a carCategory it should return an available car', async () => {
    const car = mocks.validCar;
    // Object create para alterar o objeto sem alterar o pai(mocks)
    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.carIds = [car.id];

    sandbox.stub(
      carService.carRepository,
      carService.carRepository.find.name,
    ).resolves(car);

    sandbox.spy(
      carService,
      carService.chooseRandomCar.name,
    );

    const result = await carService.getAvailableCar(carCategory);
    const expected = car;

    expect(carService.chooseRandomCar.calledOnce).to.be.ok;
    expect(carService.carRepository.find.calledWithExactly(car.id));
      // garantir que 'carService.carRepository.find' foi chamado com o 
      // parâmetro 'car.id'
    expect(result).to.be.deep.equal(expected);
  });

});
