// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @author cd33
contract GarageStorage is Ownable {
    address public shop;

    mapping(bytes32 => bool) private boolStorage;
    mapping(bytes32 => address) private addressStorage;

    modifier onlyShop() {
        require(shop == msg.sender, "Only Shop authorized");
        _;
    }

    function setShop(address _shop) external onlyOwner {
        shop = _shop;
    }

    function setBool(bytes32 _key, bool _value) external onlyShop {
        boolStorage[_key] = _value;
    }

    function setAddress(bytes32 _key, address _value) external onlyShop {
        addressStorage[_key] = _value;
    }

    function deleteBool(bytes32 _key) external onlyShop {
        delete boolStorage[_key];
    }

    function deleteAddress(bytes32 _key) external onlyShop {
        delete addressStorage[_key];
    }

    function getBool(bytes32 _key) external view returns (bool) {
        return boolStorage[_key];
    }

    function getAddress(bytes32 _key) external view returns (address) {
        return addressStorage[_key];
    }
}
