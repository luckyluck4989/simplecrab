// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
//import "./IERC20.sol";
//import "./ERC20Basic.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleCrabGame is ERC721 {

    //// **** PARAMETER DEFINITION
    enum BattleState { Waiting, Fighting, Ended }
    enum CrabState { Free, Busy }

    // Crab info
    struct Crab {
        uint256 crabID;                     // CrabID
        uint256 strength;                   // Crab Strength
        uint256 kind;                       // Crab Type (0～10)
        CrabState state;                    // Crab State
    }

    // Crab info
    struct Battle {
        uint256 battleID;                   // Battle ID
        uint256 battleAmount;               // ERC20 token must pay for this game if lose
        address p1Adress;                   // Crab1 of owner address
        uint256 p1CrabID;                   // Crab1 ID
        address p2Adress;                   // Crab2 of owner address
        uint256 p2CrabID;                   // Crab2 ID
        uint256 winerCrabID;                // Winner crabID
        BattleState battleStatus;           // Battle status (Waiting, Fighting, Ended)
        uint256 battleStartTime;            // Starttime of battle
        uint256 battleEndTime;              // Endtime of battle
    }

    ERC20 public erc20TokenInfo;
    Crab[] public crabs;
    Battle[] public battles;

    //  Random use
    uint private winBattleCnt;
    uint private loseBattleCnt;

    // **** EVENT DEFINITION
    // eventType (1001 : NewCrab, 1002: UpdateCrab, 1003: NewBattle, 1004: UpdateBatte)
    event NewCrab(uint256 indexed eventType, address owner, uint256 crabID, uint256 kind, uint256 strength, CrabState state);
    event UpdateCrab(uint256 indexed eventType, address owner, uint256 crabID, uint256 strength, CrabState state);
    event NewBattle(uint256 indexed eventType, uint256 _battleID, uint256 _battleAmount, address _p1Adress, uint256 _p1CrabID, address _p2Adress, uint256 _p2CrabID, uint256 _winerCrabID, BattleState _battleStatus, uint256 _battleStartTime, uint256 _battleEndTime);
    event UpdateBattle(uint256 indexed eventType, uint256 _battleID, address _p1Adress, uint256 _p1CrabID, address _p2Adress, uint256 _p2CrabID, uint256 _winerCrabID, BattleState _battleStatus, uint256 _battleStartTime, uint256 _battleEndTime);

    // **** CONTRACT METHOD
    // constructor
    constructor (address _tokenAddress) ERC721("CrabInfo Management Token", "SCG721") {
        winBattleCnt = 0;
        loseBattleCnt = 0;
        erc20TokenInfo = ERC20(_tokenAddress);
    }

    // User pay ERC20 token for mint crab, default 1 ERC20 token = 1 Crab
    function mintCrab() public {
        require(erc20TokenInfo.allowance(msg.sender, address(this)) != 1, 'Invalid Amount');
        // should burn this token
        erc20TokenInfo.transferFrom(msg.sender, address(this), 1);

        // crab strenth 0 - 30 random
        // crab kind 0 - 10 random
        uint256 _id = crabs.length;
        uint256 _strength = randomMax(30);
        uint256 _kind = randomMax(10);
        crabs.push(Crab(_id, _strength, _kind, CrabState.Free));
        _mint(msg.sender, _id);

        emit NewCrab(1001, msg.sender, _id, _kind, _strength, CrabState.Free);
    }

    // Start new battle
    function startBattle(uint256 _p1CrabID, uint256 _battleAmount) public {
        // balance allowance check
        require(erc20TokenInfo.allowance(msg.sender, address(this)) != _battleAmount, 'Invalid amount !');
        erc20TokenInfo.transferFrom(msg.sender, address(this), _battleAmount);

        // crab owner, crab state check
        require(ownerOf(_p1CrabID) != msg.sender, 'Invalid owner !');
        require(crabs[_p1CrabID].state != CrabState.Busy, 'Your crab is busy now !');

        // take crab to busy
        crabs[_p1CrabID].state = CrabState.Busy;
        emit UpdateCrab(1002, msg.sender, _p1CrabID, crabs[_p1CrabID].strength, CrabState.Busy);

        // start new battle
        uint256 _battleID = battles.length;
        battles.push(Battle(
            _battleID,                  // Battle ID
            _battleAmount,              // ERC20 token must pay for this game if lose
            msg.sender,                 // Crab1 of owner address
            _p1CrabID,                  // Crab1 ID
            address(0),                 // Crab2 of owner address
            0,                          // Crab2 ID
            0,                          // Winner crabID
            BattleState.Waiting,        // Battle status (Waiting, Fighting, Ended)
            block.timestamp,            // Starttime of battle
            0                           // Endtime of battle
        ));

        emit NewBattle (
             1003,                      // eventType
            _battleID,                  // Battle ID (start from 1)
            _battleAmount,              // ERC20 token must pay for this game if lose
            msg.sender,                 // Crab1 of owner address
            _p1CrabID,                  // Crab1 ID
            address(0),                 // Crab2 of owner address
            0,                          // Crab2 ID
            0,                          // Winner crabID
            BattleState.Waiting,                        // Battle status (Waiting, Fighting, Ended)
            battles[_battleID].battleStartTime,         // Starttime of battle
            0                                           // Endtime of battle
        );
    }

    // Accept battle
    function acceptBattle(uint256 _p2CrabID, uint256 _battleID) public {
        // balance allowance check
        require(erc20TokenInfo.allowance(msg.sender, address(this)) != battles[_battleID].battleAmount, 'Invalid amount !');
        erc20TokenInfo.transferFrom(msg.sender, address(this), battles[_battleID].battleAmount);

        // crab owner, crab state check
        require(ownerOf(_p2CrabID) != msg.sender, 'Invalid owner !');
        require(crabs[_p2CrabID].state != CrabState.Busy, 'Your crab is busy now !');

        // take crab to busy
        crabs[_p2CrabID].state = CrabState.Busy;
        emit UpdateCrab(1002, msg.sender, _p2CrabID, crabs[_p2CrabID].strength, CrabState.Busy);

        // check battle status
        require(battles[_battleID].battleStatus != BattleState.Waiting, 'Battle maybe already started, please reconfirm !');

        // update battle info
        battles[_battleID].battleStatus     = BattleState.Fighting;
        battles[_battleID].p2CrabID         = _p2CrabID;
        battles[_battleID].p2Adress         = msg.sender;

        emit UpdateBattle (
            1004,                               // eventType
            _battleID,                          // Battle ID (start from 1)
            battles[_battleID].p1Adress,        // Crab1 of owner address
            battles[_battleID].p1CrabID,        // Crab1 ID
            msg.sender,                         // Crab2 of owner address
            _p2CrabID,                          // Crab2 ID
            0,                                  // Winner crabID
            BattleState.Fighting,               // Battle status (Waiting, Fighting, Ended)
            battles[_battleID].battleStartTime, // Starttime of battle
            0                                   // Endtime of battle
        );

        // fighting
        endBattle(_battleID);
    }

    // Let 2 crab fight
    function endBattle(uint256 _battleID) public {
        // check battle status
        require(battles[_battleID].battleStatus != BattleState.Fighting, 'Cannot fight this battle, please reconfirm !');
        battles[_battleID].battleStatus = BattleState.Ended;

        // calculate strength
        uint256 _crab1Strength  = crabs[battles[_battleID].p1CrabID].strength;
        uint256 _crab2Strength  = crabs[battles[_battleID].p2CrabID].strength;
        uint256 _diffStrength   = _crab1Strength - _crab2Strength >= 0 ? _crab1Strength - _crab2Strength : _crab2Strength - _crab1Strength;
        uint256 _p1RandomStrength = randomMax(_diffStrength * 2);

        // p1Win
        if (_crab1Strength + _p1RandomStrength > _crab2Strength + _diffStrength - _p1RandomStrength) {
            battles[_battleID].winerCrabID = battles[_battleID].p1CrabID;
            winBattleCnt++;

            // crab1 stronger
            if (_crab1Strength >= _crab2Strength) {
                crabs[battles[_battleID].p1CrabID].strength = crabs[battles[_battleID].p1CrabID].strength + 1;
            
            // crab2 stronger
            } else {
                crabs[battles[_battleID].p1CrabID].strength = crabs[battles[_battleID].p1CrabID].strength + 2;
            }

            // transfer erc20 token
            erc20TokenInfo.transferFrom(msg.sender, battles[_battleID].p1Adress, battles[_battleID].battleAmount);

        // p2Win
        } else {
            battles[_battleID].winerCrabID = battles[_battleID].p2CrabID;
            loseBattleCnt++;

            // crab1 stronger
            if (_crab1Strength >= _crab2Strength) {
                crabs[battles[_battleID].p2CrabID].strength = crabs[battles[_battleID].p2CrabID].strength + 2;
            
            // crab2 stronger
            } else {
                crabs[battles[_battleID].p2CrabID].strength = crabs[battles[_battleID].p2CrabID].strength + 1;
            }

            // transfer erc20 token
            erc20TokenInfo.transferFrom(msg.sender, battles[_battleID].p2Adress, battles[_battleID].battleAmount);
        }

        // endgame info update
        battles[_battleID].battleEndTime = block.timestamp;
        crabs[battles[_battleID].p1CrabID].state = CrabState.Free;
        crabs[battles[_battleID].p2CrabID].state = CrabState.Free;
        emit UpdateCrab(1002, msg.sender, battles[_battleID].p1CrabID, crabs[battles[_battleID].p1CrabID].strength, CrabState.Free);
        emit UpdateCrab(1002, msg.sender, battles[_battleID].p2CrabID, crabs[battles[_battleID].p2CrabID].strength, CrabState.Free);

        emit UpdateBattle (
            1004,                                   // eventType
            _battleID,                              // Battle ID (start from 1)
            battles[_battleID].p1Adress,            // Crab1 of owner address
            battles[_battleID].p1CrabID,            // Crab1 ID
            battles[_battleID].p2Adress,            // Crab2 of owner address
            battles[_battleID].p2CrabID,            // Crab2 ID
            battles[_battleID].winerCrabID,         // Winner crabID
            BattleState.Ended,                      // Battle status (Waiting, Fighting, Ended)
            battles[_battleID].battleStartTime,     // Starttime of battle
            battles[_battleID].battleEndTime        // Endtime of battle
        );
    }

    // **** UTILITY METHOD
    // Random uint numer
    function randomMax(uint _max) public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, blockhash(block.number - 1), winBattleCnt, loseBattleCnt))) % _max;
    }
}
