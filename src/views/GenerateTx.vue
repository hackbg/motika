<template>
  <div class="generate-tx">
    <form @submit.prevent="handleSubmit">
      <span>From: <KeySelect @change="handleKeyChange" /></span>
      <input v-model="toAddress" type="text" placeholder="To" required />
      <br />
      <div>
        <label>
          <input v-model="txType" type="radio" value="spend" />
          Spend
        </label>
        <label>
          <input v-model="txType" type="radio" value="contractCall" />
          Contract Call
        </label>
      </div>
      <br />
      <div v-if="txType === 'spend'">
        <input
          v-model="amount"
          type="text"
          placeholder="Amount"
          required
        />usrct
      </div>
      <div v-else-if="txType === 'contractCall'">
        <label for="sequence">Sequence #</label>
        <input
          id="sequence"
          type="number"
          v-model="sequence"
          :disabled="loading"
          required
        />
        <br />
        <textarea
          v-model="message"
          cols="40"
          rows="5"
          placeholder="Message"
          required
        ></textarea>
      </div>
      <button type="submit" :disabled="loading">Generate</button>
    </form>
    <br />
    <textarea v-if="output" v-model="output" cols="40" rows="20"></textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import KeySelect from "@/components/KeySelect.vue";
import {
  getKey,
  queryAccount,
  getContractHash,
  generateSendTx,
  generateContractCallTx,
} from "@/utils/secretcli";
import { TxType } from "@/types";

export default defineComponent({
  components: { KeySelect },
  data() {
    return {
      txType: TxType.Spend,
      fromAlias: "",
      fromAddress: "",
      toAddress: "",
      amount: "",
      message: "",
      sequence: 0,
      accountNumber: 0,
      output: "",
      loading: false,
    };
  },
  watch: {
    async fromAlias(newValue: string) {
      this.loading = true;
      try {
        const { address } = await getKey(newValue);
        this.fromAddress = address;
        const { accountNumber, sequence } = await queryAccount(address);
        this.accountNumber = accountNumber;
        this.sequence = sequence;
      } catch (error) {
        alert(error.message || "Error");
      }
      this.loading = false;
    },
  },
  methods: {
    handleKeyChange(keyAlias: string) {
      this.fromAlias = keyAlias;
    },
    async handleSubmit() {
      this.loading = true;
      try {
        let result = "";
        if (this.txType === TxType.Spend) {
          result = await generateSendTx(
            this.fromAddress,
            this.toAddress,
            +this.amount
          );
        } else if (this.txType === TxType.ContractCall) {
          const contractHash = await getContractHash(this.toAddress);
          result = await generateContractCallTx(
            this.fromAddress,
            this.toAddress,
            contractHash,
            this.sequence,
            this.accountNumber,
            this.message
          );
        }
        this.output = result;
      } catch (error) {
        alert(error.message || "Error");
      }
      this.loading = false;
    },
  },
});
</script>
