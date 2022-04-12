
const hre = require("hardhat");

async function main() {
 
  const DaiToken = await hre.ethers.getContractFactory("DaiToken");
  const dai = await DaiToken.deploy();
  await dai.deployed()
  console.log("dai token deployed to:", dai.address);


  const EthPool = await hre.ethers.getContractFactory("EthPool");
  const ethpool = await EthPool.deploy(dai.address);
  await ethpool.deployed()
  console.log("ethpool deployed to:", ethpool.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
