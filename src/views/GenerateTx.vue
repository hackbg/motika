<template>
  <div class="generate-tx">
    <form @submit.prevent="handleSubmit">
      <span>
        From:
        <KeySelect
          v-model:address="state.form.senderAddress"
          v-model:alias="state.form.senderAlias"
        />
      </span>
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
    <div ref="dragRef" draggable="true" :class="{ hidden: !state.output }">
      {{ state.fileName }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch } from "vue";
import KeySelect from "@/components/KeySelect.vue";
import {
  getConfig,
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
        senderAlias: "",
        senderAddress: "",
        recipientAddress: "",
        amount: 0,
        message: "",
        sequence: 0,
      },
      output: "",
      fileName: "",
      loading: false,
    });
    const dragRef = ref<null | { ondragstart: (e: DragEvent) => void }>(null);

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

    async function handleSubmit() {
      state.loading = true;
      try {
        state.output = await generateTx();
        state.fileName = await generateFilename();
        saveOutputToFile();
        enableFileDrag();
      } catch (error) {
        alert(error.message || "Error");
      } finally {
        state.loading = false;
      }
    }

    async function generateTx() {
      switch (state.form.txType) {
        case TxType.Spend: {
          const result = await generateSendTx(
            state.form.senderAddress,
            state.form.recipientAddress,
            state.form.amount
          );
          return result;
        }
        case TxType.ContractCall: {
          const [contractHash, { accountNumber }] = await Promise.all([
            getContractHash(state.form.recipientAddress),
            queryAccount(state.form.senderAddress),
          ]);
          const result = await generateContractCallTx(
            state.form.senderAddress,
            state.form.recipientAddress,
            contractHash,
            state.form.sequence,
            accountNumber,
            state.form.message
          );
          return result;
        }
      }
    }

    async function generateFilename() {
      const { chainId } = await getConfig(["chain-id"]);
      return `${state.form.senderAlias}-${chainId}-seq-${state.form.sequence}-tx.json`;
    }

    function saveOutputToFile() {
      window.fs.writeFileSync(state.fileName, state.output);
    }

    function enableFileDrag() {
      if (dragRef.value) {
        dragRef.value.ondragstart = (event: DragEvent) => {
          event.preventDefault();
          window.electron.startDrag(state.fileName);
        };
      }
    }

    return { state, dragRef, handleSubmit };
  },
});
</script>

<style lang="scss" scoped>
.generate-tx {
  .hidden {
    visibility: hidden;
  }
}
</style>
