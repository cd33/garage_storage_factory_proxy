import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { setupContractsFixture } from "./utils";
import { Shop, Car } from "../typechain-types";

export default function Shop() {
  describe("DelphyaBase contract car tests", async () => {
    let shop: Shop,
      car: Car,
      owner: SignerWithAddress,
      account1: SignerWithAddress;

    before("Setup", async () => {
      ({ shop, car, owner, account1 } = await loadFixture(
        setupContractsFixture
      ));
    });

    it("should store a new car", async () => {
      await expect(shop.newCar("lambo", 150000, false))
        .to.emit(shop, "CarAdded")
        .withArgs(1, "0x856e4424f806D16E8CBC702B3c0F2ede5468eae5");
    });

    it("should retrieve by id a newly created car", async () => {
      const tx = await shop.newCar("lambo", 150000, false);
      const receipt = await tx.wait();
      const events = receipt.events && receipt.events[2].args;
      expect(events?._carId).to.equal(2);
      expect(events?._carAddress).to.equal(
        "0xb0279Db6a2F1E01fbC8483FCCef0Be2bC6299cC3"
      );
      const car = await shop.getCar(2);
      expect(car.addressContract).to.equal(
        "0xb0279Db6a2F1E01fbC8483FCCef0Be2bC6299cC3"
      );
      expect(car.available).to.equal(true);
    });

    it("buyCar() should become new owner", async () => {
      const carContract = car.attach(
        "0xb0279Db6a2F1E01fbC8483FCCef0Be2bC6299cC3"
      );
      let carData = await carContract.carData();
      expect(carData.owner).to.equal(owner.address);

      await shop
        .connect(account1)
        .buyCar("0xb0279Db6a2F1E01fbC8483FCCef0Be2bC6299cC3", 2);

      carData = await carContract.carData();
      expect(carData.owner).to.equal(account1.address);
      const carLib = await shop.getCar(2);
      expect(carLib.addressContract).to.equal(
        "0xb0279Db6a2F1E01fbC8483FCCef0Be2bC6299cC3"
      );
      expect(carLib.available).to.equal(false);
    });
  });
}
