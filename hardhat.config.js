require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

 const INFURA_URL = 'https://rinkeby.infura.io/v3/50f77a73507440289de47df9dc3b94ea';
 const PRIVATE_KEY = '092daa904730acc93cdcffc6d0ebffa3c94b4d32f0d25e732b0e5df309a28ecf';
module.exports = {
  solidity: "0.8.3",
  paths:{
    artifacts: './src/artifacts',
  },
  networks:{
    rinkeby:{
      url: INFURA_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
