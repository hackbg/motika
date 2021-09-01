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
  emits: ["update:address", "update:alias"],
  props: { address: String },
  setup(_, { emit }) {
    const keys = ref<IKey[]>([]);

    onMounted(async () => (keys.value = await getKeys()));

    function handleChange(event: Event): void {
      const select = event.target as HTMLSelectElement;
      emit("update:address", select.value);
      emit("update:alias", select.options[select.selectedIndex].innerHTML);
    }

    return { keys, handleChange };
  },
});
</script>
