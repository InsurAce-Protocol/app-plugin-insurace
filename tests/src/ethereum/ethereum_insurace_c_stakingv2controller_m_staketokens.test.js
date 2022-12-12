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

// Test from replayed transaction: https://etherscan.io/tx/0x60132f221121a16beb6757426a2ebe9697658154bfc3eb5bdf49612cb6c91976 - stakeTokens
// EDIT THIS: build your own test
nano_models.forEach(function(model) {
  test('[Nano ' + model.letter + '] InsurAce StakingV2Controller / Stake Tokens', zemu(model, async (sim, eth) => {

  // The rawTx of the tx up above is accessible through: https://etherscan.io/getRawTx?tx=0x60132f221121a16beb6757426a2ebe9697658154bfc3eb5bdf49612cb6c91976
  const serializedTx = txFromEtherscan("0x02f8b101118459682f0085040d6bbe7a83047868947d8c3f38c8545a770d57c8043d54e5715b1c584e80b8440bea440d000000000000000000000000000000000000000000000213a4b5f259bc302000000000000000000000000000544c42fbb96b39b21df61cf322b5edc285ee7429c080a00da8bcea3813d1755d72ede26b6e18456eab127c007fbcbc00b7380c51882c92a0792da4337d2defb6472be55397efad08f13eb76d2a1b8bc8ed537a98294135c4");

  const tx = eth.signTransaction(
    "44'/60'/0'/0",
    serializedTx,
  );

  const right_clicks = model.letter === 'S' ? 6 : 4;

  // Wait for the application to actually load and parse the transaction
  await waitForAppScreen(sim);
  // Navigate the display by pressing the right button `right_clicks` times, then pressing both buttons to accept the transaction.
  await sim.navigateAndCompareSnapshots('.', model.name + '_ethereum_insurace_c_stakingv2controller_m_staketokens', [right_clicks, 0]);

  await tx;
  }));
});
