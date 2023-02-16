import { ethers } from "hardhat";

export const setupContractsFixture = async () => {
  const accounts = await ethers.provider.listAccounts();
  const owner = await ethers.getSigner(accounts[0]);
  const account1 = await ethers.getSigner(accounts[1]);

  const GarageStorage = await ethers.getContractFactory("GarageStorage");
  const garageStorage = await GarageStorage.deploy();

  const GarageStorageLibrary = await ethers.getContractFactory(
    "GarageStorageLibrary"
  );
  const garageStorageLibrary = await GarageStorageLibrary.deploy();

  const Shop = await ethers.getContractFactory("Shop");
  const shop = await Shop.connect(garageStorageLibrary.signer).deploy(
    garageStorage.address
  );

  const Car = await ethers.getContractFactory("Car");
  const car = await Car.deploy(shop.address);

  const CarFactory = await ethers.getContractFactory("CarFactory");
  const carFactory = await CarFactory.deploy(shop.address, car.address);

  await garageStorage.setShop(shop.address);
  await shop.setCarFactory(carFactory.address);

  return {
    garageStorage,
    shop,
    car,
    carFactory,
    owner,
    account1,
  };
};