// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SCG20Token is ERC20 {
    constructor() ERC20("CrabGame Token", "SCG20") {
        _mint(msg.sender, 50000 * 10 ** 18);
    }
}