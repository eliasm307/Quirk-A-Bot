import InMemoryDataStorageFactory from '../../data-storage/InMemory/InMemoryDataStorageFactory';
import NumberTrait from './NumberTrait';

const dataStorageFactory = new InMemoryDataStorageFactory({});
const traitDataStorageInitialiser = dataStorageFactory.newTraitDataStorageInitialiser();
const parentPath = "NumberTrait-InMemory-test";

// todo replace all jest "test" functions with "it" functions

describe("Number trait with in memory data storage", () => {
  it("rounds values on instantiation", () => {
    const trait1 = new NumberTrait<string>({
      max: 10,
      name: "numberTrait1",
      value: 5.2,
      traitDataStorageInitialiser,
      parentPath,
      loggerCreator: null,
    });

    const trait2 = new NumberTrait<string>({
      max: 10,
      name: "numberTrait2",
      value: 5.8,
      traitDataStorageInitialiser,
      parentPath,
      loggerCreator: null,
    });
    expect(trait1.value).toEqual(5);
    expect(trait2.value).toEqual(6);
  });

  it("rounds up values with a decimal portion equal to or greater than 0.5 on value modification", async () => {
    expect.assertions(1);
    const trait1 = new NumberTrait<string>({
      max: 10,
      name: "numberTrait1",
      value: 5.2,
      traitDataStorageInitialiser,
      parentPath,
      loggerCreator: null,
    });

    await trait1.setValue(0.5);

    expect(trait1.value).toEqual(1);
  });

  it("rounds down values with a decimal portion less than 0.5 on modification", async () => {
    expect.assertions(1);

    const trait1 = new NumberTrait<string>({
      max: 10,
      name: "numberTrait1",
      value: 5.2,
      traitDataStorageInitialiser,
      parentPath,
      loggerCreator: null,
    });

    await trait1.setValue(0.4);
    expect(trait1.value).toEqual(0);
  });

  it("does not accept any value modifications above or below the defined limit", async () => {
    expect.assertions(1);

    const trait1 = new NumberTrait<string>({
      max: 10,
      name: "numberTrait1",
      value: 5.2,
      traitDataStorageInitialiser,
      parentPath,
      loggerCreator: null,
    });

    await trait1.setValue(5);
    await trait1.setValue(11);
    await trait1.setValue(-1);

    expect(trait1.value).toEqual(5);
  });

  it("logs modifications", async () => {
    expect.assertions(1);

    const trait1 = new NumberTrait<string>({
      max: 10,
      name: "numberTrait1",
      value: 5.2,
      traitDataStorageInitialiser,
      parentPath,
      loggerCreator: null,
    });
    await trait1.setValue(1);
    await trait1.setValue(2);
    await trait1.setValue(3);
    expect(trait1.log.events.length).toEqual(3);
  });
});
