<template>
  <div class="generate-tx">
    <form @submit.prevent="handleSubmit">
      <span>From: <KeySelect @change="handleSenderChange" /></span>
      <input
        v-model="state.form.recipientAddress"
        type="text"
        placeholder="To"
        required
      />
      <br />
      <div>
        <label>
          <input v-model="state.form.txType" type="radio" value="spend" />
          Spend
        </label>
        <label>
          <input
            v-model="state.form.txType"
            type="radio"
            value="contractCall"
          />
          Contract Call
        </label>
      </div>
      <br />
      <div v-if="state.form.txType === 'spend'">
        <input
          v-model="state.form.amount"
          type="text"
          placeholder="Amount"
          required
        />usrct
      </div>
      <div v-else-if="state.form.txType === 'contractCall'">
        <label for="sequence">Sequence #</label>
        <input
          id="sequence"
          type="number"
          v-model="state.form.sequence"
          :disabled="state.loading"
          required
        />
        <br />
        <textarea
          v-model="state.form.message"
          cols="40"
          rows="5"
          placeholder="Message"
          required
        ></textarea>
      </div>
      <button type="submit" :disabled="state.loading">Generate</button>
    </form>
    <br />
    <textarea
      v-if="state.output"
      v-model="state.output"
      cols="40"
      rows="20"
    ></textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";
import KeySelect from "@/components/KeySelect.vue";
import {
  queryAccount,
  getContractHash,
  generateSendTx,
  generateContractCallTx,
} from "@/utils/secretcli";
import { TxType } from "@/types";

export default defineComponent({
  components: { KeySelect },
  setup() {
    const state = reactive({
      form: {
        txType: TxType.Spend,
        senderAddress: "",
        recipientAddress: "",
        amount: 0,
        message: "",
        sequence: 0,
      },
      output: "",
      loading: false,
    });

    watch(
      () => state.form.senderAddress,
      async (newValue) => {
        if (state.form.txType !== TxType.ContractCall) return;
        state.loading = true;
        try {
          const { sequence } = await queryAccount(newValue);
          state.form.sequence = sequence;
        } catch (error) {
          alert(error.message || "Error");
        }
        state.loading = false;
      }
    );

    // TODO: use v-model
    function handleSenderChange(value: string) {
      state.form.senderAddress = value;
    }

    async function handleSubmit() {
      state.loading = true;
      try {
        switch (state.form.txType) {
          case TxType.Spend: {
            state.output = await generateSendTx(
              state.form.senderAddress,
              state.form.recipientAddress,
              state.form.amount
            );
            break;
          }
          case TxType.ContractCall: {
            const [contractHash, { accountNumber }] = await Promise.all([
              getContractHash(state.form.recipientAddress),
              queryAccount(state.form.senderAddress),
            ]);
            state.output = await generateContractCallTx(
              state.form.senderAddress,
              state.form.recipientAddress,
              contractHash,
              state.form.sequence,
              accountNumber,
              state.form.message
            );
            break;
          }
        }
      } catch (error) {
        alert(error.message || "Error");
      } finally {
        state.loading = false;
      }
    }

    return { state, handleSenderChange, handleSubmit };
  },
});
</script>
