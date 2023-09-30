<template>
  <div class="modal">
    <div
      class="modal-background"
      title="Close"
      @click="props.closeable && emit('close')"
    ></div>
    <div class="modal-content">
      <slot :close="() => emit('close')"></slot>
    </div>
    <button
      v-if="props.closeable"
      class="modal-close is-large"
      aria-label="close"
      title="Close"
      @click="emit('close')"
    ></button>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['close']);
const props = defineProps({ closeable: Boolean });
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
}

.modal-content {
  max-width: 70vw;
  width: initial;
  overflow: visible;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

:slotted(.field) {
  display: flex;
  justify-content: end;
}
</style>
