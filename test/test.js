const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("EthPool contract", function () {

    let owner;
    let wallet1;
    let wallet2;
    let EthPool;
    let ethpool;
    let DaiToken;
    let daitoken;

    beforeEach (async function() {
         [owner, wallet1, wallet2] = await ethers.getSigners();

         DaiToken = await ethers.getContractFactory('DaiToken');
         daitoken = await DaiToken.deploy()
         
  
         EthPool = await ethers.getContractFactory("EthPool");
         ethpool = await EthPool.deploy(daitoken.address);
    })

    it("It should deploy", async function () {
      expect(await ethpool.name()).to.equal('EthPool')
      const ownerBalance = await daitoken.balanceOf(owner.address)
      expect(await daitoken.totalSupply()).to.equal(ownerBalance)
    });

    it('should deposit eth', async function () {
      const provider = waffle.provider;
    await wallet1.sendTransaction({to: ethpool.address, value: 100})
      expect(await provider.getBalance(ethpool.address)).to.equal(100)
    })


    it('should deposit rewards', async function () {
      await daitoken.approve(ethpool.address, 100)
      await ethpool.connect(owner).depositRewards(100)
      expect(await daitoken.balanceOf(ethpool.address)).to.equal(100)
    })

    it('should withdraw rewards and Eth', async function () {
      //deposit eth
      const provider = waffle.provider;
      await wallet2.sendTransaction({to: ethpool.address, value: 150})
      await wallet1.sendTransaction({to: ethpool.address, value: 150})
      await owner.sendTransaction({to: ethpool.address, value: 150})
      
      //deposit rewards
      await daitoken.approve(ethpool.address, 300)
      await ethpool.connect(owner).depositRewards(300)

      
      
      //withdraw rewards
      await ethpool.connect(wallet2).withdrawRewards(150)
      await ethpool.connect(owner).withdrawRewards(150)
      await ethpool.connect(wallet1).withdrawRewards(150)
      

      expect(await daitoken.balanceOf(ethpool.address)).to.equal(0)
      expect(await daitoken.balanceOf(wallet1.address)).to.equal(100)
      expect(await daitoken.balanceOf(wallet2.address)).to.equal(100)

      expect(await  provider.getBalance(ethpool.address)).to.equal(0)
      

    })

  });