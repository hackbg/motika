<template>
  <div class="generate-multisig-tx">
    <form @submit.prevent="handleSubmit">
      <input v-model="fromAlias" type="text" placeholder="From name" required />
      <input v-model="toAddress" type="text" placeholder="To" required />
      <input v-model="amount" type="text" placeholder="Amount" required />usrct
      <button type="submit">Generate</button>
    </form>
    <br />
    <textarea v-model="output" cols="40" rows="20"></textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { generateMultisigSendTx } from "@/utils/secretcli";

export default defineComponent({
  data() {
    return {
      fromAlias: "",
      toAddress: "",
      amount: "",
      output: "",
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const result = await generateMultisigSendTx(
          this.fromAlias,
          this.toAddress,
          +this.amount
        );
        this.output = result;
      } catch (error) {
        alert(error.message || "Error");
      }
    },
  },
});
</script>
