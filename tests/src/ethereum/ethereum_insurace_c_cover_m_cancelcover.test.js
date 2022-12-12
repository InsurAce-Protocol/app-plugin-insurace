import "core-js/stable";
import "regenerator-runtime/runtime";
import { waitForAppScreen, zemu, genericTx, nano_models,SPECULOS_ADDRESS, txFromEtherscan} from '../test.fixture';
import { ethers } from "ethers";
import { parseEther, parseUnits} from "ethers/lib/utils";

// EDIT THIS: Replace with your contract address
const contractAddr = "0x88ef6f235a4790292068646e79ee563339c796a0";  // InsurAce contract Cover - https://etherscan.io/address/0x88Ef6F235a4790292068646e79Ee563339c796a0#code
// EDIT THIS: Replace `boilerplate` with your plugin name
const pluginName = "insurace";
const testNetwork = "ethereum";
const abi_path = `../../networks/${testNetwork}/${pluginName}/abis/` + contractAddr + '.json';
const abi = require(abi_path);

// Test from replayed transaction: https://etherscan.io/tx/0x9d9ea4c89daa7c93b69a07674bd6ac44e95ee6975b224339f36c17a04e5e7fbb - CancelCover
// EDIT THIS: build your own test
nano_models.forEach(function(model) {
  test('[Nano ' + model.letter + '] InsurAce Cover / Cancel Cover', zemu(model, async (sim, eth) => {

  // The rawTx of the tx up above is accessible through: https://etherscan.io/getRawTx?tx=0x9d9ea4c89daa7c93b69a07674bd6ac44e95ee6975b224339f36c17a04e5e7fbb // CancelCover
  const serializedTx = txFromEtherscan("0x02f8900173843b9aca008503ddf1a3978304177b9488ef6f235a4790292068646e79ee563339c796a080a4b77b94090000000000000000000000000000000000000000000000000000000000000003c080a0f8d2995ed2ac66a75ae055beda7453100ccc1df62ebe349ba2ef7d4eed6db808a03181f3b086cfaecb78fcee32bf839e1dfa88474cba9e5b132a665167ddea8b49");

  const tx = eth.signTransaction(
    "44'/60'/0'/0",
    serializedTx,
  );

  const right_clicks = model.letter === 'S' ? 6 : 4;

  // Wait for the application to actually load and parse the transaction
  await waitForAppScreen(sim);
  // Navigate the display by pressing the right button `right_clicks` times, then pressing both buttons to accept the transaction.
  await sim.navigateAndCompareSnapshots('.', model.name + '_ethereum_insurace_c_cover_m_cancelcover', [right_clicks, 0]);

  await tx;
  }));
});
