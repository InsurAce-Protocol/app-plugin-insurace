import "core-js/stable";
import "regenerator-runtime/runtime";
import { waitForAppScreen, zemu, genericTx, nano_models,SPECULOS_ADDRESS, txFromEtherscan} from '../test.fixture';
import { ethers } from "ethers";
import { parseEther, parseUnits} from "ethers/lib/utils";

// EDIT THIS: Replace with your contract address
const contractAddr = "0x7d8c3f38c8545a770d57c8043d54e5715b1c584e";  // InsurAce contract StakingV2Controller - https://etherscan.io/address/0x7D8C3F38C8545a770D57c8043d54e5715B1C584E#code
// EDIT THIS: Replace `boilerplate` with your plugin name
const pluginName = "insurace";
const testNetwork = "ethereum";
const abi_path = `../../networks/${testNetwork}/${pluginName}/abis/` + contractAddr + '.json';
const abi = require(abi_path);

// Test from replayed transaction: https://etherscan.io/tx/0xe5d67f8acaf43eb28aa6cda8b07b291ce21c6a71837a5cf75948a510a7cd579a - withdrawTokens
// EDIT THIS: build your own test
nano_models.forEach(function(model) {
  test('[Nano ' + model.letter + '] InsurAce StakingV2Controller / Withdraw Tokens', zemu(model, async (sim, eth) => {

  // The rawTx of the tx up above is accessible through: https://etherscan.io/getRawTx?tx=0xe5d67f8acaf43eb28aa6cda8b07b291ce21c6a71837a5cf75948a510a7cd579a
  const serializedTx = txFromEtherscan("0xf9024b39850430e2340083045518947d8c3f38c8545a770d57c8043d54e5715b1c584e80b901e431e6cbb4000000000000000000000000e55dfd364f2eb7523e932ec0a4a9e58d0d7f9de8000000000000000000000000e55dfd364f2eb7523e932ec0a4a9e58d0d7f9de80000000000000000000000000000000000000000000000041006ae1c35e58d9b000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000f390180000000000000000000000000000000000000000000000000000000000f390180000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000160d691316e6e5ee46f1c7df30a35fd29e7c21a162680a61d3e4866bc553b751200000000000000000000000000000000000000000000000000000000000000015c7306c975e6420553bb7a573838d966614084057f32c7c65f1cad9a0367816926a0b0f6ecfb23d4d66398ada2689c6276b443213b4ae4630d8107fa273692fe9d53a066ff207bcbf1093fce0498fe425bd9ed8c2e34d3033018f05cb8471ff2c2aa99");

  const tx = eth.signTransaction(
    "44'/60'/0'/0",
    serializedTx,
  );

  const right_clicks = model.letter === 'S' ? 4 : 4;

  // Wait for the application to actually load and parse the transaction
  await waitForAppScreen(sim);
  // Navigate the display by pressing the right button `right_clicks` times, then pressing both buttons to accept the transaction.
  await sim.navigateAndCompareSnapshots('.', model.name + '_ethereum_insurace_c_stakingv2controller_m_withdrawtokens', [right_clicks, 0]);

  await tx;
  }));
});
