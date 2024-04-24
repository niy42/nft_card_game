// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Game {
    //  player info object
    struct PlayerInfo {
        address player;
        uint8 player_no;
        string playerName;
        uint256 playerMana;
        uint256 playerHealth;
        bool isBattle;
    }

    address[] _players;  // _players address array
    PlayerInfo[] players; // players info array

    // creating a playerInfo and address mapping
    mapping (address => uint256) public playersAddress;
    mapping (uint256 => PlayerInfo) public playerInfo;

    // function to add player addresses to the _players array
    function addPlayers(address player) public returns(address[] memory){
        _players.push(player);
        playersAddress[player] = _players.length;
        return _players;
    }

    // function to add playerInfo to the _players array
    function addPlayersInfo(
        address _player, 
        uint8 _playerNo, 
        string memory _playerName, 
        uint256 _playerMana, 
        uint256 _playerHealth, 
        bool _isBattle) public {
            uint256 count = 0;
            players.push(PlayerInfo(_player, _playerNo, _playerName, _playerMana, _playerHealth, _isBattle));
            uint256 _id = players.length;
            playerInfo[count] = players[_id - 1];
            count++;
    }

    // returns an array of playersInfo
    function ArrayOfPlayersInfo() public view returns (PlayerInfo[] memory){
        return  players;
    } 

    // returns an array of players addresses
    function ArrayOfPlayers() public view returns(address[] memory){
        return _players;
    }

    // Looping a collection of items to identify a value
    // not gas-cost efficient
    function Looping(address player) public view returns(bool){
        uint256 i = 0;
        while(i < _players.length){
            if(_players[i] == player){
                return true;
            }
            i++;
        }

        return false;
    }

    // mapping enables direct access to values based on known keys
    // Advantage minimies gas cost
    function Mapping(address player) public view returns(bool) {
        return playersAddress[player] != 0;
    }

    // returns the info of a player at a particular index in the players array
    function returnPlayerInfo(uint256 _index) public view returns(PlayerInfo memory){
        return playerInfo[_index];
    }
}