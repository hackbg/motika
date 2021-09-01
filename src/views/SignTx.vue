<template>
  <div class="sign-tx">
    <div class="drop-zone" @drop.prevent="handleDrop" @dragover.prevent>
      <p v-if="state.unsignedTx.name">{{ state.unsignedTx.name }}</p>
      <p v-else>Drag multisig contract call tx file here...</p>
    </div>
    <form @submit.prevent="handleSubmit">
      <template v-if="state.unsignedTx.sender">
        <label for="sequence">Tx Sequence #</label>
        <input
          id="sequence"
          type="number"
          v-model="state.form.sequence"
          :disabled="state.loading"
          required
        />
        <br />
      </template>
      <span>
        Sign with account:
        <KeySelect
          v-model:address="state.form.signer.address"
          v-model:alias="state.form.signer.alias"
        />
      </span>
      <button type="submit" :disabled="state.loading">Sign</button>
    </form>
    <br />
    <div
      ref="dragRef"
      draggable="true"
      :class="{ hidden: !state.output.contents }"
    >
      {{ state.output.fileName }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch } from "vue";
import KeySelect from "@/components/KeySelect.vue";
import { queryAccount, signMultisigTx } from "@/utils/secretcli";
import { readFileAsText } from "@/utils/helpers";

export default defineComponent({
  components: { KeySelect },
  setup() {
    const state = reactive({
      unsignedTx: {
        name: "",
        path: "",
        sender: "",
      },
      form: {
        signer: {
          address: "",
          alias: "",
        },
        sequence: 0,
      },
      output: {
        fileName: "",
        contents: "",
      },
      loading: false,
    });
    const dragRef = ref<null | { ondragstart: (e: DragEvent) => void }>(null);

    watch(
      () => state.unsignedTx.sender,
      async (newValue) => {
        state.loading = true;
        try {
          const { sequence } = await queryAccount(newValue);
          state.form.sequence = sequence;
        } catch (error) {
          alert(error.message || "Error");
        }
        state.loading = false;
      }
    );

    async function handleDrop(event: DragEvent) {
      const item = event.dataTransfer?.items[0];
      if (item?.type === "application/json") {
        const file = item.getAsFile();
        if (file) setUnsignedTx(file);
      }
    }

    async function setUnsignedTx(file: File) {
      state.unsignedTx.name = file.name;
      state.unsignedTx.path = file.path;
      state.unsignedTx.sender = await getSender(file);
    }

    async function getSender(file: File) {
      try {
        const tx = JSON.parse(await readFileAsText(file));
        return tx.value.msg[0].value.sender;
      } catch (error) {
        throw Error("Unable to get sender from tx file");
      }
    }

    async function handleSubmit() {
      state.loading = true;
      try {
        state.output.contents = await getSignedTx();
        state.output.fileName = generateFilename();
        saveOutputToFile();
        enableFileDrag();
      } catch (error) {
        alert(error.message || "Error");
      }
      state.loading = false;
    }

    async function getSignedTx() {
      const { accountNumber } = await queryAccount(state.unsignedTx.sender);
      const result = await signMultisigTx(
        state.unsignedTx.sender,
        state.form.signer.alias,
        state.form.sequence,
        accountNumber,
        state.unsignedTx.path
      );
      return result;
    }

    function generateFilename(): string {
      return `signed-${state.form.signer.alias}-${state.unsignedTx.name}`;
    }

    function saveOutputToFile() {
      window.fs.writeFileSync(state.output.fileName, state.output.contents);
    }

    function enableFileDrag() {
      if (dragRef.value) {
        dragRef.value.ondragstart = (event: DragEvent) => {
          event.preventDefault();
          window.electron.startDrag(state.output.fileName);
        };
      }
    }

    return { state, dragRef, handleDrop, handleSubmit };
  },
});
</script>

<style lang="scss" scoped>
.sign-tx {
  .drop-zone {
    width: 80%;
    height: 100px;
    border: 2px solid blue;
    margin: 0 auto;
  }

  .hidden {
    visibility: hidden;
  }
}
</style>
