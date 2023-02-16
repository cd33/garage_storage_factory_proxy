// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./GarageStorage.sol";

/// @author cd33
library GarageStorageLibrary {
    struct CarStorage {
        address addressContract;
        bool available;
    }

    function setCar(
        address _storage,
        uint _id,
        CarStorage memory _car
    ) internal {
        GarageStorage(_storage).setAddress(
            keccak256(abi.encodePacked("car.addressContract", _id)),
            _car.addressContract
        );
        GarageStorage(_storage).setBool(
            keccak256(abi.encodePacked("car.available", _id)),
            _car.available
        );
    }

    function getCar(
        address _storage,
        uint _id
    ) internal view returns (CarStorage memory) {
        CarStorage memory car;
        car.addressContract = GarageStorage(_storage).getAddress(
            keccak256(abi.encodePacked("car.addressContract", _id))
        );
        car.available = GarageStorage(_storage).getBool(
            keccak256(abi.encodePacked("car.available", _id))
        );
        return car;
    }
}
