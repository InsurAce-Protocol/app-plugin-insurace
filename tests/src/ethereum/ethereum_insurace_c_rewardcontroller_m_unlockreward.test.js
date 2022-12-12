import "core-js/stable";
import "regenerator-runtime/runtime";
import { waitForAppScreen, zemu, genericTx, nano_models,SPECULOS_ADDRESS, txFromEtherscan} from '../test.fixture';
import { ethers } from "ethers";
import { parseEther, parseUnits} from "ethers/lib/utils";

// EDIT THIS: Replace with your contract address
const contractAddr = "0x9933b0419cfb71791da75ac2dcea952d0875c967";  // InsurAce contract RewardController - https://etherscan.io/address/0x9933b0419CfB71791dA75aC2DceA952D0875c967#code
// EDIT THIS: Replace `boilerplate` with your plugin name
const pluginName = "insurace";
const testNetwork = "ethereum";
const abi_path = `../../networks/${testNetwork}/${pluginName}/abis/` + contractAddr + '.json';
const abi = require(abi_path);

// Test from replayed transaction: https://etherscan.io/tx/0x9a65941106bfc25c3521fa36483b3803579c81b1dd6dbaea624ea7bb5e721813 - unlockReward
// EDIT THIS: build your own test
nano_models.forEach(function(model) {
  test('[Nano ' + model.letter + '] InsurAce StakingV2Controller / Unlock Reward', zemu(model, async (sim, eth) => {

  // The rawTx of the tx up above is accessible through: https://etherscan.io/getRawTx?tx=0x9a65941106bfc25c3521fa36483b3803579c81b1dd6dbaea624ea7bb5e721813
  const serializedTx = txFromEtherscan("0xf9012a2e85036c303300830505a8949933b0419cfb71791da75ac2dcea952d0875c96780b8c46a69d93f00000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000544c42fbb96b39b21df61cf322b5edc285ee742925a08272987b8757800376d6a9c1b30c51bb1706c4bb65eec9213caa10598016428fa035047c687bc07d7b096c6f8d70e718b7037b6cce698553d959159b8d0c118c97");

  const tx = eth.signTransaction(
    "44'/60'/0'/0",
    serializedTx,
  );

  const right_clicks = model.letter === 'S' ? 4 : 4;

  // Wait for the application to actually load and parse the transaction
  await waitForAppScreen(sim);
  // Navigate the display by pressing the right button `right_clicks` times, then pressing both buttons to accept the transaction.
  await sim.navigateAndCompareSnapshots('.', model.name + '_ethereum_insurace_c_rewardcontroller_m_unlockreward', [right_clicks, 0]);

  await tx;
  }));
});
