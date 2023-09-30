<template>
    <div class="wrapper">
        <button class="button" title="Change your marker" @click="showPicker = !showPicker" v-html="state.marker"></button>
    </div>

    <unicode-emoji-picker version="14.0" :class="{shown: showPicker}"></unicode-emoji-picker>
</template>

<script lang="ts">
import 'unicode-emoji-picker';
import { Component, Vue } from 'vue-facing-decorator';
import { useMain } from '../store/main';

@Component
export default class MarkerPicker extends Vue {
    public state = useMain();
    public showPicker = false;

    public mounted(): void {
        const emojiPicker = document.querySelector('unicode-emoji-picker')!;
        emojiPicker.addEventListener('emoji-pick', (event) => {
            this.state.setMarker(event.detail.emoji);
            this.showPicker = false;
        });
    }
}
</script>

<style lang="scss" scoped>
unicode-emoji-picker {
    --box-shadow: none;
    --fill-color: var(--primary);
    --text-color: var(--text);
    --border-radius: 4px;

    --filter-border-radius: var(--border-radius);
    --filter-fill-color-hover: var(--secondary);
    --filters-border-color: var(--border);
    --filter-active-marker-border-width: 2px;
    --filter-active-marker-border-color: var(--secondary);

    --content-scrollbar-thumb-fill-color: var(--secondary);
    --content-scrollbar-thumb-fill-color-hover: var(--tertiary);

    --title-bar-fill-color: var(--primary);
    --search-input-padding: 0.35em 0.35em 0.35em;
    --search-input-border-width: 0 0 0 0;
    --search-input-border-color: var(--secondary);
    --search-input-border-color-hover: var(--secondary);
    

    --emoji-border-color-hover: var(--secondary);
    --emoji-border-radius: var(--border-radius);

    --variations-backdrop-fill-color: rgba(var(--raw-primary), .9);
    --variations-fill-color: var(--fill-color);
    --variations-border-radius: var(--border-radius);
    --emoji-variation-marker-border-width: 2px;
    --emoji-variation-marker-border-color: var(--text);
    --emoji-variation-marker-border-color-hover: var(--text);

    position: absolute;
    top: 3rem;
    right: 1rem;
    z-index: 5;
    display: none;
    &.shown {
        display: block;
    }
}
</style>
