#include "insurace_plugin.h"

// Sets the first screen to display.
void handle_query_contract_id(void *parameters) {
    ethQueryContractID_t *msg = (ethQueryContractID_t *) parameters;
    const context_t *context = (const context_t *) msg->pluginContext;
    // msg->name will be the upper sentence displayed on the screen.
    // msg->version will be the lower sentence displayed on the screen.

    // For the first screen, display the plugin name.
    strlcpy(msg->name, PLUGIN_NAME, msg->nameLength);

    // EDIT THIS: Adapt the cases by modifying the strings you pass to `strlcpy`.
    // if (context->selectorIndex == INSURACE_C_COVER_M_BUY_COVER_V3) {
    //     strlcpy(msg->version, "Cover", msg->versionLength);
    //     msg->result = ETH_PLUGIN_RESULT_OK;
    // }
    // else if (context->selectorIndex == INSURACE_C_COVER_M_CANCEL_COVER) {
    //     strlcpy(msg->version, "Cover", msg->versionLength);
    //     msg->result = ETH_PLUGIN_RESULT_OK;
    // } else {
    //     PRINTF("Selector index: %d not supported\n", context->selectorIndex);
    //     msg->result = ETH_PLUGIN_RESULT_ERROR;
    // }

    switch (context->selectorIndex) {
        case INSURACE_C_COVER_M_BUY_COVER_V3:
        case INSURACE_C_COVER_M_CANCEL_COVER:
        case INSURACE_C_StakingV2Controller_M_stakeTokens:
            strlcpy(msg->version, "Transactions", msg->versionLength);
            msg->result = ETH_PLUGIN_RESULT_OK;
            break;
        // Keep this
        default:
            PRINTF("Selector index: %d not supported\n", context->selectorIndex);
            msg->result = ETH_PLUGIN_RESULT_ERROR;
            return;
    }
}