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
import { getKeys } from "@/utils/secretcli";

export default defineComponent({
  emits: ["change"],
  data() {
    return {
      keys: [] as string[],
    };
  },
  mounted() {
    getKeys().then((result) => {
      this.keys = result.map((k) => k.name);
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
