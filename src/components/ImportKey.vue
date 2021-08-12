<template>
  <div class="import-key">
    <form @submit.prevent="handleSubmit">
      <textarea
        v-model="privateKey"
        cols="40"
        rows="20"
        placeholder="Paste private key here..."
        required
      ></textarea>
      <br />
      <input v-model="keyAlias" type="text" placeholder="Key alias" required />
      <button type="submit">Import</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { importPrivateKey } from "@/utils/secretcli";

export default defineComponent({
  data() {
    return {
      keyAlias: "",
      privateKey: "",
    };
  },
  methods: {
    async handleSubmit() {
      try {
        await importPrivateKey(this.keyAlias, this.privateKey);
        alert("Sucess!");
      } catch (error) {
        alert(error.message || "Error");
      }
    },
  },
});
</script>
