// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";


/**
 * Author: Obanla Adeniyi (Niy42)
 * Title: AVAXGODS build
 */

contract Game is ERC1155 {

    string baseURI;

    struct Player {
        address player;
        string playerName;
        uint256 playerHealth;
        uint256 playerMana;
        bool inBattle;
    }

    struct Battle {
        string battleName;
        BattleStatus battleStatus;
        bytes32 battleHash;
        address[2] players;
        uint8[2] move;
        address winner;
    }

    // struct to store player token
    struct PlayerToken {
        string name; // battle card name
        uint256 id; // randomly generated ID
        uint256 attackStrength; // randomly generated attack strength
        uint256 defenseStrength; // randomly generated defense strength
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

    function isPlayer(address _player) public view returns(bool){
        return playerInfo[_player] != 0;
    }
    
    function getPlayer(address _player) public view returns(Player memory){
        require(isPlayer(_player), "Player is not registered!");
        return players[playerInfo[_player]];

    }

    function getAllPlayers() public view returns(Player[] memory){
        return players;
    }
    
    function getAllPlayerToken() public view returns(PlayerToken[] memory){
        return playersToken;
    }

   function isBattle(string memory _name) public view returns(bool){
        return battleInfo[_name] != 0;
   }

   function getBattle(string memory _name) public view returns(Battle memory) {
        require(isBattle(_name), "Battle doesn't exist");
        return battles[battleInfo[_name]];
   }

   function getAllBattles() public view returns(Battle[] memory){
        return battles;
   }

   // updates an indexed battle
   function updateBattle(
    string memory _name,
    Battle memory _newBattle) private {
        require(isBattle(_name), "Battle doesn't exist!");
        battles[battleInfo[_name]] = _newBattle;
    }

   //events
   event NewPlayer(address indexed owner, string playerName);
   event NewBattle(string battleName, address indexed player01, address indexed player02);
   event BattleMove(string indexed battleName, bool indexed isFirstMove);
   event BattleEnded(string battleName, address indexed winner, address indexed loser);
   event NewPlayerToken(
    address indexed owner,
    uint256 id,
    uint256 attackStrength,
    uint256 defenseStrength
   );
   event RoundEnded(address[2] indexed damagedPlayers);

   constructor(string memory _metadataURI) ERC1155(_metadataURI) {
        baseURI = _metadataURI;
        initialize();
   }
   
   // function to initialize declared arrays
   function initialize() private {
        players.push(Player({
            player: address(0),
            playerName: "",
            playerHealth: 0,
            playerMana:  0,
            inBattle: false
        }));
        playersToken.push(
            PlayerToken("", 0, 0, 0)
        );
        battles.push(Battle({
            battleName: "",
            battleStatus: BattleStatus.PENDING,
            players: [address(0), address(0)],
            move: [0, 0],
            battleHash: bytes32(0),
            winner: address(0)
        }));
   }

   function setURI(string memory uri) public {
        _setURI(uri);
   }

   function registerPlayer(string memory _playerName, string memory _playerToken) public {
        require(!isPlayer(msg.sender), "Player is registered");
        Player[] storage _p = players; // replacement for players array to be used accross functions
        _p.push(Player(msg.sender, _playerName, 25, 10, false)); // registering player and adding to the players array
        uint256 _index = _p.length;
        playerInfo[msg.sender] = _index;

        createRandomPlayerToken(_playerToken);
        emit NewPlayer(msg.sender, _playerName);
   }
   

   function createRandomPlayerToken(string memory _playerToken) internal {
    //
   }
}