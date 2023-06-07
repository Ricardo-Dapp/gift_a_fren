//SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";
error Gift__UpkeepNotNeeded();
error AddFrenFree__AlreadyJoined();

/**
 * @title Gift a Fren
 *
 * 1. Person gifts a Fren on the website.
 * 2. They get added to an array of struct people (address walletadr, string message, string name, Rank rank).
 * 3. After a certain amount of time the donation count is wiped and everyone is set back to bronze rank.
 */

contract GiftAFren is AutomationCompatibleInterface {
    enum Rank {
        bronze,
        silver,
        gold
    }
    enum State {
        open,
        resetting
    }
    struct Fren {
        string name;
        string message;
        address walletAddress;
        uint256 ethGifted;
        Rank rank;
    }

    // variables
    Fren[] public frens;
    State currentState;
    uint256 public amountOfFrensGifted;
    uint256 public amountOfEthGifted;
    uint256 public amountofFrens;
    uint256 public amountOfFreeFrens = 2;
    uint256 private lastTimeStamp;
    uint256 constant MIN_AMOUNT = 10000000000000000;
    uint256 constant SILVER_MIN_AMOUNT = 20000000000000000;
    uint256 constant GOLD_MIN_AMOUNT = 30000000000000000;
    uint256 constant INTERVAL = 59;

    constructor() {
        lastTimeStamp = block.timestamp;
        currentState = State.open;
    }

    function addFren(
        string memory _name,
        string memory _message,
        address _to
    ) public payable {
        require(
            currentState == State.open,
            "You can not gift a fren right now"
        );
        // if they dont add any name or message to havea default value
        require(msg.value >= MIN_AMOUNT, "You have to gift at least 0.01 Eth!");
        require(msg.sender != _to, "You can't send a gift to yourself!");

        // checks to see if fren is already in the array
        for (uint256 i = 0; i < frens.length; i++) {
            if (frens[i].walletAddress == msg.sender) {
                frens[i].name = _name;
                frens[i].message = _message;
                frens[i].ethGifted += msg.value;
                if (
                    frens[i].ethGifted >= GOLD_MIN_AMOUNT &&
                    frens[i].rank != Rank.gold
                ) {
                    frens[i].rank = Rank.gold;
                } else if (
                    frens[i].ethGifted >= SILVER_MIN_AMOUNT &&
                    frens[i].rank != Rank.silver &&
                    frens[i].rank != Rank.gold
                ) {
                    frens[i].rank = Rank.silver;
                }
                amountOfFrensGifted++;
                amountOfEthGifted += msg.value;
                payable(_to).transfer(msg.value);
                return;
            }
        }
        // checks to see what rank you have depending on eth amount
        Rank newRank;
        if (msg.value >= GOLD_MIN_AMOUNT) {
            newRank = Rank.gold;
        } else if (msg.value >= SILVER_MIN_AMOUNT) {
            newRank = Rank.silver;
        } else {
            newRank = Rank.bronze;
        }
        // Fren gets added to the array if they are not in the fren array already
        Fren memory newFren = Fren(
            _name,
            _message,
            msg.sender,
            msg.value,
            newRank
        );
        frens.push(newFren);
        amountOfFrensGifted++;
        amountOfEthGifted += msg.value;
        amountofFrens++;
        //sends the money to the fren you selected by getting their address
        payable(_to).transfer(msg.value);
    }

    function freeAddFren(string memory _name, string memory _message) public {
        require(currentState == State.open, "You can not join right now");
        require(amountOfFreeFrens != 0, "Sorry no more free entries...");

        // check to see if they are already in the array
        for (uint256 i = 0; i < frens.length; i++) {
            if (frens[i].walletAddress == msg.sender) {
                revert AddFrenFree__AlreadyJoined();
            }
        }
        Fren memory newFren = Fren(_name, _message, msg.sender, 0, Rank.bronze);
        frens.push(newFren);
        amountofFrens++;
        amountOfFreeFrens--;
    }

    function checkUpkeep(
        bytes memory /*checkData*/
    )
        public
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        bool isOpen = (State.open == currentState);
        bool timePassed = ((block.timestamp - lastTimeStamp) > INTERVAL);
        upkeepNeeded = (isOpen && timePassed);
        return (upkeepNeeded, "");
    }

    // function that will call the reset function once a certain amount of time has passed.
    function performUpkeep(bytes calldata /* performData */) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Gift__UpkeepNotNeeded();
        }
        currentState = State.resetting;
        reset();
    }

    function reset() private {
        amountOfFrensGifted = 0;
        amountOfEthGifted = 0;
        for (uint256 i = 0; i < frens.length; i++) {
            frens[i].ethGifted = 0;
            frens[i].rank = Rank.bronze;
        }
        lastTimeStamp = block.timestamp;
        currentState = State.open;
        // have the contract funds get sent to the deployer
    }

    function getArrayLength() public view returns (uint256) {
        return frens.length;
    }

    function getArray() public view returns (Fren[] memory) {
        return frens;
    }

    fallback() external payable {
        // addFren("anon","Hi!", );
    }

    receive() external payable {
        // addFren("anon","Hi!");
    }
}
