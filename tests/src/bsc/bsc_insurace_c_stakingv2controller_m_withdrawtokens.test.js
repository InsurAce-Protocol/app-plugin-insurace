import "core-js/stable";
import "regenerator-runtime/runtime";
import { waitForAppScreen, zemu, genericTx, nano_models,SPECULOS_ADDRESS, txFromEtherscan} from '../test.fixture';
import { ethers } from "ethers";
import { parseEther, parseUnits} from "ethers/lib/utils";

// EDIT THIS: Replace with your contract address
const contractAddr = "0xdecafc91000d4d3802a0562a8fb896f29b6a7480"; 
// EDIT THIS: Replace `boilerplate` with your plugin name
const pluginName = "insurace";
const testNetwork = "bsc";
const abi_path = `../../networks/${testNetwork}/${pluginName}/abis/` + contractAddr + '.json';
const abi = require(abi_path);

// Test from constructed transaction
// EDIT THIS: build your own test
nano_models.forEach(function(model) {
  test('[Nano ' + model.letter + '] InsurAce StakingV2Controller / Withdraw Tokens', zemu(model, async (sim, eth) => {
  const contract = new ethers.Contract(contractAddr, abi);

  // Get input data from https://bscscan.com/tx/0xbbf990867fb46bb11f6a621aba090b92e408e4f58184efe7ddeeb55819e93aac
  const inputData = "0x31e6cbb40000000000000000000000001d3bd80d53dd22141fcd2e64e8377c51a285545b0000000000000000000000001d3bd80d53dd22141fcd2e64e8377c51a285545b00000000000000000000000000000000000000000000040bd255ee40551c71c20000000000000000000000008ac76a51cc950d9822d68b83fe1ad97b32cd580d00000000000000000000000000000000000000000000000000000000016baddd00000000000000000000000000000000000000000000000000000000016baddd0000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000012771ad70b4aad326d50497dd8cd8e014bd9734cab4e6e6a963852ec961833bc500000000000000000000000000000000000000000000000000000000000000010756a248a9dd3330bb93d2bb1f0b7e7a36b3f6653f039d23580b3bdac84a18b1"

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
  await sim.navigateAndCompareSnapshots('.', model.name + '_bsc_insurace_c_stakingv2controller_m_withdrawtokens', [right_clicks, 0]);

  await tx;
  },testNetwork));
});

