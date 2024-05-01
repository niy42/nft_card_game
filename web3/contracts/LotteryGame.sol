// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract LotteryGame is Ownable {
    uint256 public count;

    struct Lottery {
        string lotteryName;
        address lotteryOperator;
        uint256 lotteryOperatorCommission;
        address lotteryWinner;
        address[] tickets;
        LotteryStatus lotteryStatus;
        uint256 maxTickets;
        uint256 ticketPrice;
        uint256 expiration;
        bytes32 lotteryHash;
    }

    enum LotteryStatus {
        PENDING,
        STARTED,
        ENDED
    }

    Lottery[] internal lotteries;
    mapping(string => uint256) public lotteryInfo;

    constructor() Ownable(msg.sender) {
        initialize();
    }

    function createLottery(
        string memory _lotteryName,
        address _lotteryOperator,
        uint256 _lotteryOperatorCommission,
        uint256 _maxTickets,
        uint256 _ticketPrice,
        uint256 _expiration
    ) public onlyOwner {
        require(_expiration >= block.timestamp, "Lottery has expired!");
        require(
            _lotteryOperatorCommission % 5 == 0 &&
                _lotteryOperatorCommission > 0,
            "Operator commission must be a multiple of five and cannot be zero"
        );
        require(_ticketPrice != 0, "Ticket price cannot be zero!");
        require(_maxTickets > 0, "Max ticket must be greater than zero!");
        require(
            _lotteryOperator != address(0),
            "Lottery Operator cannot be invalid address"
        );

        bytes32 _lotteryHash = keccak256(abi.encode(_lotteryName));

        uint256 _id = lotteries.length;
        lotteries.push(
            Lottery(
                _lotteryName,
                _lotteryOperator,
                _lotteryOperatorCommission,
                address(0),
                new address[](0),
                LotteryStatus.STARTED,
                _maxTickets,
                _ticketPrice,
                _expiration,
                _lotteryHash
            )
        );

        lotteryInfo[_lotteryName] = _id;
        count++;
    }

    function buyLotteryTicket(
        uint256 _numoftickets,
        string memory _name
    ) public payable {
        uint256 _ticketsAmount = msg.value;

        Lottery storage _lottery = lotteries[lotteryInfo[_name]]; // storage is used mainly for modification purposes
        Lottery memory _lotteryTemp = getLottery(_name); // generates temporary space to hold a structure with numerous variables
        require(_numoftickets > 0, "Ticket number must be greater than zero!");
        require(
            _ticketsAmount >= _lotteryTemp.ticketPrice * _ticketsAmount,
            ""
        );
        require(
            _numoftickets <= getRemainingTickets(_name),
            "Tickets must be greater than or equal to remaining tickets or lottery unavailable!"
        );
        require(
            block.timestamp < _lotteryTemp.expiration,
            "Lottery has expired!"
        );
        require(
            _lotteryTemp.lotteryStatus == LotteryStatus.STARTED,
            "Lottery has not started!"
        );

        for (uint256 i = 0; i < _numoftickets; i++) {
            _lottery.tickets.push(msg.sender);
        }
    }

    function getRemainingTickets(
        string memory _name
    ) public view returns (uint256) {
        Lottery storage _lottery = lotteries[lotteryInfo[_name]];
        return (_lottery.maxTickets - _lottery.tickets.length);
    }

    function isLottery(string memory _lotteryName) public view returns (bool) {
        return lotteryInfo[_lotteryName] != 0;
    }

    function getAllLotteries() public view returns (Lottery[] memory) {
        return lotteries;
    }

    function lotteryLength() public view returns (uint256) {
        return lotteries.length;
    }

    function totalLotteries() public view returns (uint256) {
        return count;
    }

    function getLottery(
        string memory _lotteryName
    ) public view returns (Lottery memory) {
        return lotteries[lotteryInfo[_lotteryName]];
    }

    function initialize() internal {
        Lottery memory _lottery = Lottery({
            lotteryName: "",
            lotteryOperatorCommission: 0,
            lotteryOperator: address(0),
            lotteryHash: bytes32(0),
            tickets: new address[](0),
            maxTickets: 0,
            ticketPrice: 0,
            expiration: 0,
            lotteryStatus: LotteryStatus.PENDING,
            lotteryWinner: address(0)
        });

        lotteries.push(_lottery);
    }
}
