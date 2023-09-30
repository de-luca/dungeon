<template>
  <modal :closeable="false" @close="close">
    <div class="box content">
      <h1 v-html="data.title"></h1>
      <p v-html="data.body"></p>
      <div class="field is-grouped">
        <div v-for="btn in data.btns" class="control">
          <button class="button" @click="(btn.action ?? close)()" v-html="btn.text">
          </button>
        </div>
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { useMain } from '../store/main';

interface ErrorData {
  title: string;
  body: string;
  btns: Array<{
    text: string;
    action?: () => any;
  }>;
}

@Component({ emits: ['close'] })
export default class ErrorModal extends Vue {
  @Prop({ required: true })
  private error: any;
  private state = useMain();

  public close() {
    this.$emit('close');
  }

  public async reOpen(): Promise<void> {
    await this.state.createGame();
    history.replaceState({}, '', `#/${this.state.gameId}`);
    this.close();
  }

  public reLocal(): void {
    this.state.leaveGame();
    history.replaceState({}, '', `#/`);
    this.close();
  }

  public get data(): ErrorData {
    switch (true) {
      case this.error === undefined:
        return {
          title: 'Could not connect to server',
          body: `
            An error occured when attempting to open the game.<br>
            The signaling server or your internet connection might be down.
          `,
          btns: [{ text: 'Dismiss', action: this.reLocal }],
        };
      case this.error === 'ROOM_DOES_NOT_EXISTS':
        return {
          title: 'Game does not exists',
          body: `
            The game you're attempting to join does not exists.<br>
            It either does not exists or has been closed.
          `,
          btns: [
            { text: 'Continue locally', action: this.reLocal },
            { text: 'Create new game', action: this.reOpen },
          ],
        };
    }

    return {
      title: 'Impossible to join game',
      body: `
        The game could not be loaded.<br>
        Please make sure the url is correct.
      `,
      btns: [{ text: 'Dismiss', action: this.reLocal }],
    };
  }
}
</script>
