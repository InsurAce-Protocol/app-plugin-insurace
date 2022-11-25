import "core-js/stable";
import "regenerator-runtime/runtime";
import { waitForAppScreen, zemu, genericTx, nano_models,SPECULOS_ADDRESS, txFromEtherscan} from './test.fixture';
import { ethers } from "ethers";
import { parseEther, parseUnits} from "ethers/lib/utils";

// EDIT THIS: Replace with your contract address
const contractAddr = "0x7d8c3f38c8545a770d57c8043d54e5715b1c584e";  // InsurAce contract StakingV2Controller - https://etherscan.io/address/0x7D8C3F38C8545a770D57c8043d54e5715B1C584E#code
// EDIT THIS: Replace `boilerplate` with your plugin name
const pluginName = "insurace";
const testNetwork = "ethereum";
const abi_path = `../networks/${testNetwork}/${pluginName}/abis/` + contractAddr + '.json';
const abi = require(abi_path);

// Test from replayed transaction: https://etherscan.io/tx/0xff04f02dfdf18710986df748c6b7922cfc3b1f48e671cd6f1a63e5769fd58f01 - proposeUnstake
// EDIT THIS: build your own test
nano_models.forEach(function(model) {
  test('[Nano ' + model.letter + '] InsurAce StakingV2Controller / Propose Unstake', zemu(model, async (sim, eth) => {

  // The rawTx of the tx up above is accessible through: https://etherscan.io/getRawTx?tx=0xff04f02dfdf18710986df748c6b7922cfc3b1f48e671cd6f1a63e5769fd58f01
  const serializedTx = txFromEtherscan("0x02f8b1011a8459682f008503fccbcb148302179f947d8c3f38c8545a770d57c8043d54e5715b1c584e80b8445ace4df700000000000000000000000000000000000000000000002ff4002c5b3e2b17ff000000000000000000000000544c42fbb96b39b21df61cf322b5edc285ee7429c080a0bf5e77b1147b239e81dadc87faf164da6a58218905a1ad49e12635f53cb0148ea018b3637b69a469f92a51081c7c697063dcf5faed44f975fffe66e30e747567fb");

  const tx = eth.signTransaction(
    "44'/60'/0'/0",
    serializedTx,
  );

  const right_clicks = model.letter === 'S' ? 6 : 4;

  // Wait for the application to actually load and parse the transaction
  await waitForAppScreen(sim);
  // Navigate the display by pressing the right button `right_clicks` times, then pressing both buttons to accept the transaction.
  await sim.navigateAndCompareSnapshots('.', model.name + '_ethereum_insurace_c_stakingv2controller_m_proposeunstakes', [right_clicks, 0]);

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

