<template>
  <select class="key-select" @change="handleChange">
    <option value="" selected disabled>Choose key</option>
    <option v-for="key in keys" :value="key.address" :key="key.address">
      {{ key.name }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getKeys } from "@/utils/secretcli";
import { IKey } from "@/types";

export default defineComponent({
  emits: ["change"],
  data: () => ({
    keys: [] as IKey[],
  }),
  mounted() {
    getKeys().then((result) => {
      this.keys = result;
    });
  },
  methods: {
    handleChange(event: Event): void {
      const select = event.target as HTMLSelectElement;
      this.$emit("change", select.value);
    },
  },
});
</script>
