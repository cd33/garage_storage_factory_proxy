import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { setupContractsFixture } from "./utils";
import { Shop, CarFactory, Car } from "../typechain-types";

export default function CarFactory() {
  describe("CarFactory contract car tests", async () => {
    let shop: Shop,
      carFactory: CarFactory,
      car: Car,
      owner: SignerWithAddress,
      carAddr,
      carContract;

    beforeEach("Setup", async () => {
      ({ shop, carFactory, car, owner } = await loadFixture(
        setupContractsFixture
      ));
    });

    it("should revert when not called by Shop", async () => {
      await expect(
        carFactory.createCar("Lambo", 200000, true, owner.address)
      ).to.be.revertedWith("Only Shop authorized");
    });

    it("should create a new car clone when called from shop", async () => {
      const tx = await shop.newCar("Lambo", 200000, true);
      const receipt = await tx.wait();
      const carId =
        receipt.events &&
        receipt.events[2].args &&
        receipt.events[2].args._carId;
      const carLib = await shop.getCar(carId);
      carAddr = carLib.addressContract;
      carContract = car.attach(carAddr);
      const carData = await carContract.carData();

      expect(carData.name).to.equal("Lambo");
      expect(carData.price).to.equal(200000);
      expect(carData.secondHand).to.equal(true);
      expect(carData.owner).to.equal(owner.address);
    });
  });
}
