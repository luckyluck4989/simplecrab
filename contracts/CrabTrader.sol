// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CrabTrader is ERC721 {
	enum TradeState { Waiting, Transfering, Completed }

	struct TradeInfo {
		TradeState state;
		address sellerAddress;
		address buyerAddress;
		uint256 amount;
	}

	ERC20 public erc20TokenInfo;
	mapping(uint256 => TradeInfo) public tradeInfoMap;

	// **** CONTRACT METHOD
	// constructor
	constructor (address _tokenAddress) ERC721("CrabInfo Management Token", "SCG721") {
		erc20TokenInfo = ERC20(_tokenAddress);
	}

	// **** EVENT DEFINITION
    // eventType (2000 : SellCrab, 2001: BuyCrab, 2002: CancelTrade)
	event SellCrab(uint256 indexed eventType, uint256 crabID, uint256 amount, address sellerAddress, uint256 tradeTimestamp);
	event BuyCrab(uint256 indexed eventType, uint256 crabID, address buyerAddress, uint256 tradeTimestamp);
	event CancelTrade(uint256 indexed eventType, uint256 crabID, uint256 tradeTimestamp);

    function sellCrab(uint256 crabID, uint256 amount) public {
		// crab owner, trade state check
		require(ownerOf(crabID) != msg.sender, 'Invalid owner !');
		require(tradeInfoMap[crabID].state != TradeState.Completed, 'Unfinished !');

        tradeInfoMap[crabID] = TradeInfo({
				state			: TradeState.Waiting,
				sellerAddress	: msg.sender,
				buyerAddress	: address(0),
				amount			: amount
		});
		safeTransferFrom(msg.sender, address(this), crabID);

		emit SellCrab(2000, crabID, amount, msg.sender, block.timestamp);
    }

    function buyCrab(uint256 crabID) public {
		// balance allowance, trade state check
		require(erc20TokenInfo.allowance(msg.sender, address(this)) != tradeInfoMap[crabID].amount, 'Invalid amount !');
		require(tradeInfoMap[crabID].state != TradeState.Waiting, 'Sold !');
		erc20TokenInfo.transferFrom(msg.sender, address(this), tradeInfoMap[crabID].amount);

		// take crab to Transfering
		tradeInfoMap[crabID].state = TradeState.Transfering;
		tradeInfoMap[crabID].buyerAddress = msg.sender;

		emit BuyCrab(2001, crabID, msg.sender, block.timestamp);

		endTrade(crabID);
    }

	function endTrade(uint256 crabID) public {
		require(tradeInfoMap[crabID].state == TradeState.Transfering, 'Completed!');

		erc20TokenInfo.transferFrom(address(this), tradeInfoMap[crabID].sellerAddress, tradeInfoMap[crabID].amount);

		safeTransferFrom(address(this), tradeInfoMap[crabID].buyerAddress, crabID);

		delete tradeInfoMap[crabID];
	}

	function cancelTrade(uint256 crabID) public {
		require(tradeInfoMap[crabID].buyerAddress == msg.sender, 'Not Buyer!');
		require(tradeInfoMap[crabID].sellerAddress == msg.sender, 'Not Seller!');
		require(tradeInfoMap[crabID].state != TradeState.Completed, 'Completed!');

		if (tradeInfoMap[crabID].buyerAddress == msg.sender) {
			erc20TokenInfo.transferFrom(address(this), msg.sender, tradeInfoMap[crabID].amount);
			tradeInfoMap[crabID].state = TradeState.Waiting;

		} else {
			safeTransferFrom(address(this), tradeInfoMap[crabID].sellerAddress, crabID);
			delete tradeInfoMap[crabID];
		}

		emit CancelTrade(2002, crabID, block.timestamp);
	}
}