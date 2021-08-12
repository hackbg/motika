<template>
  <div class="export-key">
    <form @submit.prevent="handleSubmit">
      <input v-model="keyAlias" type="text" placeholder="Key alias" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">Export</button>
    </form>
    <br />
    <textarea v-model="output" cols="40" rows="20"></textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { exportPrivateKey } from "@/utils/secretcli";

export default defineComponent({
  data() {
    return {
      keyAlias: "",
      password: "",
      output: "",
    };
  },
  methods: {
    async handleSubmit() {
      const result = await exportPrivateKey(this.keyAlias, this.password);
      this.output = result;
    },
  },
});
</script>
