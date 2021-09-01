<template>
  <div>
    <div class="title">SecretCLI Config</div>
    <div class="items">
      <div class="item">
        <div class="name">Chain Id:</div>
        <div class="value">{{ config.chainId }}</div>
      </div>
      <div class="item">
        <div class="name">Indent:</div>
        <div class="value">{{ config.indent }}</div>
      </div>
      <div class="item">
        <div class="name">Keyring Backend:</div>
        <div class="value">{{ config.keyringBackend }}</div>
      </div>
      <div class="item">
        <div class="name">Node:</div>
        <div class="value">{{ config.node }}</div>
      </div>
      <div class="item">
        <div class="name">Output:</div>
        <div class="value">{{ config.output }}</div>
      </div>
      <div class="item">
        <div class="name">Trust node:</div>
        <div class="value">{{ config.trustNode }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { getConfig } from "@/utils/secretcli";
import { Config } from "@/types";

export default defineComponent({
  setup() {
    const config = ref<Config>({});
    onMounted(async () => (config.value = await getConfig()));
    return { config };
  },
});
</script>

<style scoped lang="scss">
.title {
  color: #888;
  font-size: 18px;
  font-weight: initial;
  letter-spacing: 0.25px;
  margin-top: 10px;
}
.items {
  margin-top: 8px;
}
.item {
  display: flex;
  margin-bottom: 6px;
}
.item .name {
  color: #6a6a6a;
  margin-right: 6px;
}
.item .value {
  color: #35495e;
  font-weight: bold;
}
</style>
