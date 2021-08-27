<template>
  <select class="key-select" @change="handleChange">
    <option value="" selected disabled>Choose key</option>
    <option v-for="key in keys" :value="key.address" :key="key.address">
      {{ key.name }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { getKeys } from "@/utils/secretcli";
import { IKey } from "@/types";

export default defineComponent({
  emits: ["change"],
  setup(_, { emit }) {
    const keys = ref<IKey[]>([]);

    onMounted(async () => {
      keys.value = await getKeys();
    });

    function handleChange(event: Event): void {
      const select = event.target as HTMLSelectElement;
      emit("change", select.value);
    }

    return { keys, handleChange };
  },
});
</script>
