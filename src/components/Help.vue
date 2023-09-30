<template>
    <div class="wrapper">
        <button class="button" title="Help/About" @click="open = true">?</button>
    </div>

    <modal 
        v-if="open"
        v-slot="{ close }"
        :closeable="true"
        @close="open = false"
    >
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
            <div class="field">
                <div class="control">
                    <button class="button" @click="close">Dismiss</button>
                </div>
            </div>
        </div>
    </modal>
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