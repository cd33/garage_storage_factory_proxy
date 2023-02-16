// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "./GarageStorageLibrary.sol";
import "./CarFactory.sol";
import "./Car.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @author cd33
contract Shop is Ownable {
    address public garageStorage;
    CarFactory public carFactory;

    uint256 private nextId;

    event CarAdded(uint _carId, address _carAddress);

    constructor(address _garageStorage) {
        garageStorage = _garageStorage;
    }

    function storeCar(
        GarageStorageLibrary.CarStorage memory _carStorage
    ) private {
        nextId++;
        GarageStorageLibrary.setCar(garageStorage, nextId, _carStorage);
    }

    function setGarageStorage(address _garageStorage) external {
        garageStorage = _garageStorage;
    }

    function setCarFactory(address _carFactory) external onlyOwner {
        carFactory = CarFactory(_carFactory);
    }

    function newCar(
        string calldata _name,
        uint _price,
        bool _secondHand
    ) external onlyOwner {
        address carAddress = carFactory.createCar(
            _name,
            _price,
            _secondHand,
            msg.sender
        );
        GarageStorageLibrary.CarStorage memory carStorage;
        carStorage.addressContract = carAddress;
        carStorage.available = true;
        storeCar(carStorage);
        emit CarAdded(nextId, carAddress);
    }

    function buyCar(address _carAddress, uint _carId) external {
        GarageStorageLibrary.CarStorage memory carStorage = GarageStorageLibrary
            .getCar(garageStorage, _carId);
        require(carStorage.available, "Car not available");
        carStorage.available = false;
        GarageStorageLibrary.setCar(garageStorage, _carId, carStorage);
        Car(_carAddress).buyCar(msg.sender);
    }

    function getCar(uint _carId) external view returns (GarageStorageLibrary.CarStorage memory) {
        return GarageStorageLibrary.getCar(garageStorage, _carId);
    }
}
