import { ethers } from "hardhat";

async function main() {
  const GarageStorage = await ethers.getContractFactory("GarageStorage");
  const garageStorage = await GarageStorage.deploy();
  await garageStorage.deployed();
  console.log(`GarageStorage contract deployed at: ${garageStorage.address}`);

  const GarageStorageLibrary = await ethers.getContractFactory(
    "GarageStorageLibrary"
  );
  const garageStorageLibrary = await GarageStorageLibrary.deploy();
  await garageStorageLibrary.deployed();
  console.log(
    `GarageStorageLibrary contract deployed at: ${garageStorageLibrary.address}`
  );

  const Shop = await ethers.getContractFactory("Shop", {
    libraries: { garageStorageLibrary: garageStorageLibrary.address },
  });
  const shop = await Shop.deploy(garageStorage.address);
  await shop.deployed();
  console.log(`Shop contract deployed at: ${shop.address}`);

  const Car = await ethers.getContractFactory("Car");
  const car = await Car.deploy(shop.address);
  await car.deployed();
  console.log(`Car contract deployed at: ${car.address}`);

  const CarFactory = await ethers.getContractFactory("CarFactory", {
    libraries: { garageStorageLibrary: garageStorageLibrary.address },
  });
  const carFactory = await CarFactory.deploy(shop.address, car.address);
  await carFactory.deployed();
  console.log(`CarFactory contract deployed at: ${carFactory.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
