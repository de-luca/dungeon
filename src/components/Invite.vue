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

    <ErrorModal v-if="error !== null" :error="error" @close="error = null"></ErrorModal>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { useMain } from '../store/main';

import ErrorModal from '../components/ErrorModal.vue';

@Component({
    components: { ErrorModal },
})
export default class Invite extends Vue {
    public state = useMain();
    public error: any = null;

    public get inviteUrl(): string {
        return `${window.location.origin}/#/${this.state.gameId}`;
    }

    public async create(): Promise<void> {
        try {
            await this.state.createGame();
            history.replaceState({}, '', `#/${this.state.gameId}`);
        } catch (err) {
            this.error = err;
        }
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
