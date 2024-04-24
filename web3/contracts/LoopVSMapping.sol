// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Game {

    struct Player {
        address player;
        uint8 player_no;
        string playerName;
        uint256 playerMana;
        uint256 playerHealth;
        bool isBattle;
    }

    address[] _players;
    Player[] players;
    mapping (address => uint256) public playerInfo;

    function addPlayers(address player) public returns(address[] memory){
        _players.push(player);
        playerInfo[player] = _players.length;
        return _players;
    }

    function addPlayersInfo(
        address _player, 
        uint8 _playerNo, 
        string memory _playerName, 
        uint256 _playerMana, 
        uint256 _playerHealth, 
        bool _isBattle) public {
            players.push(Player(_player, _playerNo, _playerName, _playerMana, _playerHealth, _isBattle));
    }

    function ArrayOfPlayersInfo() public view returns (Player[] memory){
        return  players;
    } 

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
        return playerInfo[player] != 0;
    }
}