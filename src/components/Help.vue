<template>
    <div class="wrapper">
        <button class="button" title="Help/About" @click="open = true">?</button>
    </div>

    <div class="modal" :class="{ open }">
        <div class="modal-background" @click="open = false"></div>
        <div class="modal-content">
            <div class="box content">
                <h1>Help</h1>
                <p>
                    Select a dungeon and click <span class="tag">Add</span> to show the dungeon card.<br>
                    You can remove the dungeon card by clicking <span class="tag">Remove</span> beneath it.
                </p>
                <p>
                    You can set your marker by clicking <span class="tag">{{ state.marker }}</span> on the top right.<br>
                    Click on any room to place your marker in that room. 
                    (You can only have one marker placed at a time).<br>
                    Click again on the room you are in to remove your marker.
                </p>
                <p>
                    Click on <span class="tag">Invite</span> to open your game. 
                    This allows you to share the game with other players.<br>
                    Then <span class="tag">Copy</span> the URL and share it with them.
                    They will be able to see your marker and place theirs.<br>
                    To leave a game, click <span class="tag">Leave</span>.
                </p>
                <h1>About</h1>
                <p>
                    This tool helps track dungeons when playing MTG through spelltable.<br>
                    <em>Mostly when one player introduces the initiative and now everybody is dungeon crawling.</em>
                </p>
                <p>
                    It uses <a href="https://github.com/dmotz/trystero" target="_blank">Trystero</a> to connect with your game buddies.
                </p>
                <div class="field">
                    <div class="control">
                        <button class="button" @click="open = false">Dismiss</button>
                    </div>
                </div>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="open = false"></button>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { useMain } from '../store/main';

@Component
export default class help extends Vue {
    public open = false;
    public state = useMain();
}

</script>

<style lang="scss" scoped>
.modal {
    &.open {
        display: block;
    }

    .modal-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .field {
        display: flex;
        justify-content: end;
    }
}
</style>