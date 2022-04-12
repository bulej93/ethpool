// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.3;
import './Dai.sol';
import "hardhat/console.sol";

contract EthPool {
    string public name;
    address admin;
    DaiToken public daiToken;
    uint public rewards;
    uint public RewardDepositTime;
    uint ethbal;

    constructor(DaiToken _daiToken) {
        name = 'EthPool';
        admin = msg.sender;
        daiToken = _daiToken;
        rewards = 0;
        ethbal = 0; 
    }

    struct Deposits {
        address deposit_address;
        uint amount ;
        uint time;
    }


    mapping(address => uint) public balances;
    mapping(address => Deposits) public depositers;

    receive() external payable {
       depositers[msg.sender] = Deposits(msg.sender, msg.value, block.timestamp);
       balances[msg.sender] = balances[msg.sender] + msg.value;
    }
  
    function balanceOf() external view returns (uint) {
        return address(this).balance;
    }

    function depositRewards(uint _amount) public {
        require(msg.sender == admin);
        daiToken.transferFrom(msg.sender, address(this), _amount);
        rewards = rewards + _amount;
        RewardDepositTime = block.timestamp;
        ethbal = address(this).balance;
    }

    function withdrawRewards(uint _amount) public  {
       uint _balance = balances[msg.sender];
        
        require(_amount <= _balance, 'balance cannot be less than 0');
        require(depositers[msg.sender].time < RewardDepositTime, 'you deposited after rewards have been deposited, cant withdraw');
        console.log('eth bal at withdraw is %s ', ethbal);
        uint _getRewards = ethbal / _balance;
         uint rewardsSent = rewards / _getRewards;
         balances[msg.sender] = balances[msg.sender] - _amount ;
         daiToken.transfer(msg.sender, rewardsSent);
         payable(msg.sender).transfer(_amount);
    }

    


}