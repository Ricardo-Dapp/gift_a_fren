# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

# How to use

1. Install dependencies
2. You can either use the current contract address deployed to the sepolia test net in constants.js in order to test but you will need to add a SEPOLIA_RPC_URL and PRIVATE_KEY
   for yourself in a .env file in order for it to work.
   or you can cd into the smart_contract folder and use npx hardhat run scripts/deploy.js --network localhost while running a local node to create a local instance.
3. Everything should work from here, open another terminal and cd into ../client/gift_a_fren folder and use npm run dev in order to run the website locally.
4. Connect your wallet with the connect button at the top of the website.
5. you join the website for free or click on a persons name and enter your info in order to get started.

it takes about 15 seconds for the stuff to load in due to the way the animations work.
also you will have to refresh your page when you enter any data in order to see updated values.
