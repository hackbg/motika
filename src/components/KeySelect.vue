<template>
  <select class="key-select" @change="handleChange">
    <option value="" selected disabled>Choose key</option>
    <option v-for="key in keys" :value="key" :key="key">
      {{ key }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getKeyAliases } from "@/utils/secretcli";

export default defineComponent({
  emits: ["change"],
  data() {
    const keys: Array<string> = [];
    return { keys };
  },
  mounted() {
    getKeyAliases().then((result) => {
      this.keys = result;
    });
  },
  methods: {
    handleChange(event: Event): void {
      this.$emit("change", (event.target as HTMLSelectElement).value);
    },
  },
});
</script>
