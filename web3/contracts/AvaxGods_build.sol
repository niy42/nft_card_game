// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Game is ERC1155, Ownable {

    string internal baseURI;

    struct Player {
        address player;
        string playerName;
        uint256 playerHealth;
        uint256 playerMana;
        bool inBattle;
    }

    struct Battle {
        BattleStatus battleStatus;
        string battleName;
        uint8[2] move;
        address[2] players;
        address winner;
        bytes32 battleHash;
    }

    struct PlayerToken {
        string playerName;
        uint256 id;
        uint256 attackStrength;
        uint256 defenseStrength;
    }

    enum BattleStatus {
        PENDING,
        ACTIVE,
        END
    }

    Player[] internal players;
    Battle[] internal battles;
    PlayerToken[] internal playersToken;

    mapping (address => uint256) public playerInfo;
    mapping (address => uint256) public playerTokenInfo;
    mapping (string => uint256) public battleInfo;

    event NewPlayer(address indexed player, string playerName);
    event PlayerToken(address indexed owner, uint256 id, uint256 attackStrength, uint256 defenseStrength);
    event NewBattle(string battleName, address indexed player01, address indexed player02);
    event BattleMove(string battleName, bool isFirstMove);
    event BattleEnded(string battleName, address indexed loser, address indexed winner);
    event RoundEnded(address[2] damagedPlayers);

    constructor(string memory metadataURI) ERC1155(metadataURI) Ownable(msg.sender){
        baseURI = metadataURI;
        initialize();
    }
    
    function updateBattle(string memory _name, Battle memory _newBattle) public {
        require(isBattle(_name), "Battle doesn't exist!");
        battles[battleInfo[_name]] = _newBattle;
    }

    function registerPlayer (string memory _playerName, string memory _playerToken) public {
        require(!isPlayer(msg.sender), "Player exist!");
        uint256 _id = players.length;
        Player[] storage _p = players; //changing players array name to be used across functions
        _p.push(Player({
            player: msg.sender,
            playerName: _playerName,
            playerHealth: 35,
            playerMana: 10,
            inBattle: false
        }));
        playerInfo[msg.sender] = _id;
        createRandomPlayerToken(_playerToken);
        emit NewPlayer(msg.sender, _playerName);
    }

    function isPlayer(address _player) public view returns (bool){
        return playerInfo[_player] != 0;
    }
    
    function getPlayer(address _player) public view returns (Player memory){
        require(isPlayer(_player), "Player doesn't exist");
        return players[playerInfo[_player]];
    }

    function getAllPlayers() public view returns (Player[] memory){
        return players;
    }

    function isBattle(string memory _battleName) public view returns (bool) {
        return battleInfo[_battleName] != 0;
    }

    function getBattle(string memory _battleName) public view returns (Battle memory) {
        require(isBattle(_battleName), "Battle doesn't exist");
        return battles[battleInfo[_battleName]];
    }

    function getAllBattles() public view returns (Battle[] memory) {
        return battles;
    }

    function returnPlayersArrayLength() public view returns (uint256) {
        return players.length; // initial length is 1 due to initialized Player's struct
    }
    
    // initializing each array with an empty Player, PlayerToken, and Battle struct
    // makes each array length to be 1 by default
    function initialize() internal {
        players.push(Player({
            playerName: "",
            player: address(0),
            playerHealth: 0, 
            playerMana: 0,
            inBattle: false
        }));
        playersToken.push(PlayerToken("", 0, 0, 0));
        battles.push(Battle({
            battleName: "",
            battleStatus: BattleStatus.PENDING,
            move: [0, 0],
            players: [address(0), address(0)],
            winner: address(0),
            battleHash: bytes32(0)
        }));
    }
    
    function setURI(string memory newuri) internal onlyOwner {
        _setURI(newuri);
    }
    
    function createRandomPlayerToken(string memory _playerToken) internal {
        //
    }

    
}