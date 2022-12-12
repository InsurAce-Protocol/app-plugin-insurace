import "core-js/stable";
import "regenerator-runtime/runtime";
import { waitForAppScreen, zemu, genericTx, nano_models,SPECULOS_ADDRESS, txFromEtherscan} from '../test.fixture';
import { ethers } from "ethers";
import { parseEther, parseUnits} from "ethers/lib/utils";

// EDIT THIS: Replace with your contract address
const contractAddr = "0xfba24bdbb36001f1f88b3a552c77ec1c10f5e4c0"; 
// EDIT THIS: Replace `boilerplate` with your plugin name
const pluginName = "insurace";
const testNetwork = "bsc";
const abi_path = `../../networks/${testNetwork}/${pluginName}/abis/` + contractAddr + '.json';
const abi = require(abi_path);

// Test from constructed transaction
// EDIT THIS: build your own test
nano_models.forEach(function(model) {
  test('[Nano ' + model.letter + '] InsurAce Cover / Cancel Cover', zemu(model, async (sim, eth) => {
  const contract = new ethers.Contract(contractAddr, abi);

  // Get input data from https://bscscan.com/tx/0x2c1d0c26f408057834aeef937264d7f7dde6fceb15d5ba3228ccbe47b445305c
  const inputData = "0xb77b94090000000000000000000000000000000000000000000000000000000000000001"

  // Get the generic transaction template
  let unsignedTx = genericTx;
  // Modify `to` to make it interact with the contract
  unsignedTx.to = contractAddr;
  // Modify the attached data
  unsignedTx.data = inputData;
  // EDIT THIS: get rid of this if you don't wish to modify the `value` field.
  // Modify the number of ETH sent
  unsignedTx.value = parseEther("0.1");

  // Create serializedTx and remove the "0x" prefix
  const serializedTx = ethers.utils.serializeTransaction(unsignedTx).slice(2);

  const tx = eth.signTransaction(
    "44'/60'/0'/0/0",
    serializedTx
  );

  const right_clicks = model.letter === 'S' ? 5 : 5;

  // Wait for the application to actually load and parse the transaction
  await waitForAppScreen(sim);
  // Navigate the display by pressing the right button 10 times, then pressing both buttons to accept the transaction.
  // EDIT THIS: modify `10` to fix the number of screens you are expecting to navigate through.
  await sim.navigateAndCompareSnapshots('.', model.name + '_bsc_insurace_c_cover_m_cancelcover', [right_clicks, 0]);

  await tx;
  },testNetwork));
});

