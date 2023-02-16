// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "./Car.sol";
import "./GarageStorageLibrary.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

/// @author cd33
contract CarFactory {
    address public immutable car;
    address public immutable shop;

    event CarCreated(
        string _name,
        uint _timestamp,
        bool _secondHand,
        address _owner
    );

    constructor(address _shop, address _car) {
        car = address(_car);
        shop = _shop;
    }

    modifier onlyShop() {
        require(shop == msg.sender, "Only Shop authorized");
        _;
    }

    function createCar(
        string calldata _name,
        uint _price,
        bool _secondHand,
        address _owner
    ) public onlyShop returns(address) {
        address clone = Clones.clone(car);
        Car(clone).initialize(_name, _price, _secondHand, _owner);
        emit CarCreated(_name, _price, _secondHand, _owner);
        return clone;
    }
}
