<template>
    <div class="field has-addons" v-if="state.gameId">
        <p class="control">
            <button class="button" title="Leave the game" @click="leave">Leave</button>
        </p>
        <p class="control">
            <input type="text" title="Share that with other players" class="input" readonly :value="inviteUrl" />
        </p>
        <p class="control">
            <button class="button" title="Copy to clipboard" @click="copy">Copy</button>
        </p>
    </div>

    <div class="field" v-else>
        <p class="control">
            <button class="button" title="Open your game and share it with others" @click="create">Invite</button>
        </p>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { useMain } from '../store/main';

@Component
export default class Invite extends Vue {
    public state = useMain();

    public get inviteUrl(): string {
        return `${window.location.origin}/#/${this.state.gameId}`;
    }

    public create(): void {
        this.state.createGame();
        history.replaceState({}, '', `#/${this.state.gameId}`);
    }

    public leave(): void {
        this.state.leaveGame();
        history.replaceState({}, '', `#/`);
    }

    public async copy(): Promise<void> {
        try {
            await navigator.clipboard.writeText(this.inviteUrl);
        } catch (err) {
            console.error(err);
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
