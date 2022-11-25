import "core-js/stable";
import "regenerator-runtime/runtime";
import { waitForAppScreen, zemu, genericTx, nano_models,SPECULOS_ADDRESS, txFromEtherscan} from './test.fixture';
import { ethers } from "ethers";
import { parseEther, parseUnits} from "ethers/lib/utils";

// EDIT THIS: Replace with your contract address
const contractAddr = "0x88ef6f235a4790292068646e79ee563339c796a0";  // InsurAce contract Cover - https://etherscan.io/address/0x88Ef6F235a4790292068646e79Ee563339c796a0#code
// EDIT THIS: Replace `boilerplate` with your plugin name
const pluginName = "insurace";
const testNetwork = "ethereum";
const abi_path = `../networks/${testNetwork}/${pluginName}/abis/` + contractAddr + '.json';
const abi = require(abi_path);

// Test from replayed transaction: https://etherscan.io/tx/0x651e1be4a0f5ebc6efdc24bcb8a869d4f8c737ed67bd81c26939160bf2caa48a - buyCoverV3
// EDIT THIS: build your own test
nano_models.forEach(function(model) {
  test('[Nano ' + model.letter + '] InsurAce Cover / Buy Cover V3', zemu(model, async (sim, eth) => {

  // The rawTx of the tx up above is accessible through: https://etherscan.io/getRawTx?tx=0x651e1be4a0f5ebc6efdc24bcb8a869d4f8c737ed67bd81c26939160bf2caa48a // buyCoverV3 - https://etherscan.io/tx/0x651e1be4a0f5ebc6efdc24bcb8a869d4f8c737ed67bd81c26939160bf2caa48a
  const serializedTx = txFromEtherscan("0x02f9057201028459682f00850232291c1d830e2d579488ef6f235a4790292068646e79ee563339c796a080b90504aaef41b9000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000087044e80000000000000000000000005f799f365fa8a2b60ac0429c48b153ca5a6f0cf800000000000000000000000000000000000000000000000000000000000002c0000000000000000000000000000000000000000000000000000000000000036000000000000000000000000000000000000000000000000000000000000003c00000000000000000000000000000000000000000000000000000000000000440000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000004c00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000007c0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000004a817c80000000000000000000000000000000000000000000000000000000000000000030000000000000000000000009c05e87d3448ef3223d282c8f14523ba2362af56000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000004a817c8000000000000000000000000000000000000000000000000000000d8a44262b00000000000000000000000000000000000000000000000000000000000000001f400000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000eceb08000000000000000000000000000000000000000000000000000000006320688d00000000000000000000000000000000000000000000000000000000000000587b2270726f64756374496473223a5b22313234225d2c22636f7665726564416464726573736573223a5b22307839633035653837643334343865663332323364323832633866313435323362613233363261663536225d7d00000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000012e9ab1cf2bef3be8091e6fd9492aaf3616801b2b03724895c46782946a97b866000000000000000000000000000000000000000000000000000000000000000138241a5b844677d1ccb157d81d8bc2ea6056176110b9cabc7c7033528418bc93c001a04a6981750e5245b2402f1c08edf4f952e2fc75f164cd526f2103e5fb97c54377a03998bc87f61f7fa6f94d6dd12bf30fb71b8e3ebcd7fca28c38a2ab0adef8684a");

  const tx = eth.signTransaction(
    "44'/60'/0'/0",
    serializedTx,
  );

  const right_clicks = model.letter === 'S' ? 6 : 4;

  // Wait for the application to actually load and parse the transaction
  await waitForAppScreen(sim);
  // Navigate the display by pressing the right button `right_clicks` times, then pressing both buttons to accept the transaction.
  await sim.navigateAndCompareSnapshots('.', model.name + '_insurace_buy_cover_v3', [right_clicks, 0]);

  await tx;
  }));
});

// Test from constructed transaction
// EDIT THIS: build your own test
// nano_models.forEach(function(model) {
//   test('[Nano ' + model.letter + '] InsurAce Cover / Buy Cover V3', zemu(model, async (sim, eth) => {
//   const contract = new ethers.Contract(contractAddr, abi);

//   // Constants used to create the transaction
//   // EDIT THIS: Remove what you don't need
//   const amountOutMin = parseUnits("28471151959593036279", 'wei');
//   const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
//   const SUSHI = "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2";
//   const path = [WETH, SUSHI];
//   const deadline = Number(1632843280);
//   // We set beneficiary to the default address of the emulator, so it maches sender address
//   const beneficiary = SPECULOS_ADDRESS;

//   // EDIT THIS: adapt the signature to your method
//   // signature: swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
//   // EDIT THIS: don't call `swapExactETHForTokens` but your own method and adapt the arguments.
//   const {data} = await contract.populateTransaction.swapExactETHForTokens(amountOutMin, path, beneficiary ,deadline);

//   // Get the generic transaction template
//   let unsignedTx = genericTx;
//   // Modify `to` to make it interact with the contract
//   unsignedTx.to = contractAddr;
//   // Modify the attached data
//   unsignedTx.data = data;
//   // EDIT THIS: get rid of this if you don't wish to modify the `value` field.
//   // Modify the number of ETH sent
//   unsignedTx.value = parseEther("0.1");

//   // Create serializedTx and remove the "0x" prefix
//   const serializedTx = ethers.utils.serializeTransaction(unsignedTx).slice(2);

//   const tx = eth.signTransaction(
//     "44'/60'/0'/0",
//     serializedTx
//   );

//   const right_clicks = model.letter === 'S' ? 7 : 5;

//   // Wait for the application to actually load and parse the transaction
//   await waitForAppScreen(sim);
//   // Navigate the display by pressing the right button 10 times, then pressing both buttons to accept the transaction.
//   // EDIT THIS: modify `10` to fix the number of screens you are expecting to navigate through.
//   await sim.navigateAndCompareSnapshots('.', model.name + '_swap_exact_eth_for_tokens', [right_clicks, 0]);

//   await tx;
//   }));
// });

