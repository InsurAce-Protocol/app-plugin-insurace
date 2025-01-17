/*******************************************************************************
 *   Ethereum 2 Deposit Application
 *   (c) 2020 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/

#include <stdbool.h>
#include <stdint.h>
#include <string.h>

#include "os.h"
#include "cx.h"

#include "insurace_plugin.h"

// List of selectors supported by this plugin.
// EDIT THIS: Adapt the variable names and change the `0x` values to match your selectors.

// Txn https://etherscan.io/tx/0x651e1be4a0f5ebc6efdc24bcb8a869d4f8c737ed67bd81c26939160bf2caa48a
static const uint32_t SELECTOR_INSURACE_C_COVER_M_BUY_COVER_V3 = 0xaaef41b9;

// Txn https://etherscan.io/tx/0x9d9ea4c89daa7c93b69a07674bd6ac44e95ee6975b224339f36c17a04e5e7fbb
static const uint32_t SELECTOR_INSURACE_C_COVER_M_CANCEL_COVER = 0xb77b9409;

// Txn - https://etherscan.io/tx/0x60132f221121a16beb6757426a2ebe9697658154bfc3eb5bdf49612cb6c91976
static const uint32_t SELECTOR_INSURACE_C_StakingV2Controller_M_stakeTokens = 0x0bea440d;

// Txn - https://etherscan.io/tx/0xff04f02dfdf18710986df748c6b7922cfc3b1f48e671cd6f1a63e5769fd58f01
static const uint32_t SELECTOR_INSURACE_C_StakingV2Controller_M_proposeUnstakes = 0x5ace4df7;

// Txn - https://etherscan.io/tx/0xe5d67f8acaf43eb28aa6cda8b07b291ce21c6a71837a5cf75948a510a7cd579a
static const uint32_t SELECTOR_INSURACE_C_StakingV2Controller_M_withdrawTokens = 0x31e6cbb4;

// Txn - https://etherscan.io/tx/0x9a65941106bfc25c3521fa36483b3803579c81b1dd6dbaea624ea7bb5e721813
static const uint32_t SELECTOR_INSURACE_C_RewardController_M_unlockReward = 0x6a69d93f;

// Txn - https://etherscan.io/tx/0xbe5ef4de24df01b5a231244bd3ac45522d7531b43ffad3dffb0c2a8508a06573
static const uint32_t SELECTOR_INSURACE_C_RewardController_M_withdrawReward = 0x523a3f08;

// Array of all the different boilerplate selectors. Make sure this follows the same order as the
// enum defined in `boilerplate_plugin.h`
// EDIT THIS: Use the names of the array declared above.
const uint32_t INSURACE_SELECTORS[NUM_SELECTORS] = {
    SELECTOR_INSURACE_C_COVER_M_BUY_COVER_V3,
    SELECTOR_INSURACE_C_COVER_M_CANCEL_COVER,
    SELECTOR_INSURACE_C_StakingV2Controller_M_stakeTokens,
    SELECTOR_INSURACE_C_StakingV2Controller_M_proposeUnstakes,
    SELECTOR_INSURACE_C_StakingV2Controller_M_withdrawTokens,
    SELECTOR_INSURACE_C_RewardController_M_unlockReward,
    SELECTOR_INSURACE_C_RewardController_M_withdrawReward,
};

// Function to dispatch calls from the ethereum app.
void dispatch_plugin_calls(int message, void *parameters) {
    switch (message) {
        case ETH_PLUGIN_INIT_CONTRACT:
            handle_init_contract(parameters);
            break;
        case ETH_PLUGIN_PROVIDE_PARAMETER:
            handle_provide_parameter(parameters);
            break;
        case ETH_PLUGIN_FINALIZE:
            handle_finalize(parameters);
            break;
        case ETH_PLUGIN_PROVIDE_INFO:
            handle_provide_token(parameters);
            break;
        case ETH_PLUGIN_QUERY_CONTRACT_ID:
            handle_query_contract_id(parameters);
            break;
        case ETH_PLUGIN_QUERY_CONTRACT_UI:
            handle_query_contract_ui(parameters);
            break;
        default:
            PRINTF("Unhandled message %d\n", message);
            break;
    }
}

// Calls the ethereum app.
void call_app_ethereum() {
    unsigned int libcall_params[3];
    libcall_params[0] = (unsigned int) "Ethereum";
    libcall_params[1] = 0x100;
    libcall_params[2] = RUN_APPLICATION;
    os_lib_call((unsigned int *) &libcall_params);
}

// Weird low-level black magic. No need to edit this.
__attribute__((section(".boot"))) int main(int arg0) {
    // Exit critical section
    __asm volatile("cpsie i");

    // Ensure exception will work as planned
    os_boot();

    // Try catch block. Please read the docs for more information on how to use those!
    BEGIN_TRY {
        TRY {
            // Low-level black magic.
            check_api_level(CX_COMPAT_APILEVEL);

            // Check if we are called from the dashboard.
            if (!arg0) {
                // Called from dashboard, launch Ethereum app
                call_app_ethereum();
                return 0;
            } else {
                // Not called from dashboard: called from the ethereum app!
                const unsigned int *args = (const unsigned int *) arg0;

                // If `ETH_PLUGIN_CHECK_PRESENCE` is set, this means the caller is just trying to
                // know whether this app exists or not. We can skip `dispatch_plugin_calls`.
                if (args[0] != ETH_PLUGIN_CHECK_PRESENCE) {
                    dispatch_plugin_calls(args[0], (void *) args[1]);
                }

                // Call `os_lib_end`, go back to the ethereum app.
                os_lib_end();
            }
        }
        FINALLY {
        }
    }
    END_TRY;

    // Will not get reached.
    return 0;
}
