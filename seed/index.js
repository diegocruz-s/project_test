
const Customer = require('../src/entities/customer');
const Car = require('../src/entities/car');
const CarCategory = require('../src/entities/carCategory');
const { faker } = require('@faker-js/faker');
const { join } = require('path');
const { writeFile } = require('fs/promises');

const seederBaseFolder = join(__dirname, '../', 'database');
const ITEMS_AMOUNT = 2;

const carCategory = new CarCategory({
  id: faker.database.mongodbObjectId(),
  name: faker.vehicle.type(),
  carIds: [],
  price: parseFloat(faker.finance.amount({ min: 20, max: 100 }))
});

const cars = [];
const customers = [];
for (let index=0;index<=ITEMS_AMOUNT;index++) {
  const car = new Car({
    id: faker.database.mongodbObjectId(),
    name: faker.vehicle.model(),
    available: true,
    gasAvailable: true,
    releaseYear: faker.date.past().getFullYear(),
  });
  carCategory.carIds.push(car.id);

  cars.push(car);

  const customer = new Customer({
    id: faker.database.mongodbObjectId(),
    name: faker.person.fullName(),
    age: faker.number.int({ min: 18, max: 50 }),
  });
  customers.push(customer);
};

const write = (filename, data) => writeFile(join(seederBaseFolder, filename), JSON.stringify(data));

;(async () => {
  await write('cars.json', cars);
  await write('customers.json', customers);
  await write('carCategories.json', [carCategory]);

  console.log('cars', cars);
  console.log('carCategory', carCategory);
  console.log('customers', customers);
})();