// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

/// @author cd33
contract Car is Initializable {
    address immutable shop;

    struct CarData {
        string name;
        uint price;
        bool secondHand;
        address owner;
    }

    CarData public carData;

    event CarBought(address _owner);

    constructor(address _shop) {
        shop = _shop;
    }

    modifier onlyShop() {
        require(shop == msg.sender, "Only Shop authorized");
        _;
    }

    function initialize(
        string calldata _name,
        uint _price,
        bool _secondHand,
        address _owner
    ) public initializer {
        carData.name = _name;
        carData.price = _price;
        carData.secondHand = _secondHand;
        carData.owner = _owner;
    }

    function buyCar(address _owner) external onlyShop {
        carData.owner = _owner;
        emit CarBought(_owner);
    }
}
