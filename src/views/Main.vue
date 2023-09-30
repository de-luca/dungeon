<template>
    <div class="nav">
        <invite></invite>
        <marker-picker></marker-picker>
        <help></help>
    </div>
    
    <div class="field has-addons">
        <div class="control">
            <div class="select">
                <select v-model="toEnable">
                    <option disabled selected :value="null">Select Dungeon</option>
                    <template v-for="id in state.available">
                        <option :value="id">{{ dungeons[id].name }}</option>
                    </template>
                </select>
            </div>
        </div>
        <div class="control">
            <button class="button" :disabled="toEnable === null" @click="enable">Add</button>
        </div>
    </div>
    
    <div class="dungeons">
        <template v-for="[id, dungeon] in state.dungeons">
            <div v-if="dungeon.active" class="dungeon-wrapper">
                <component class="dungeon" :is="dungeons[id].is" />
                <div class="field">
                    <div class="control">
                        <button class="button" @click="disable(id)">Remove</button>
                    </div>
                </div>
            </div>
        </template>
    </div>

    <ErrorModal v-if="error !== null" :error="error" @close="error = null"></ErrorModal>
</template>

<script lang="ts">
import { markRaw } from 'vue';
import { Component, Vue } from 'vue-facing-decorator';
import { useMain } from '../store/main';
import { Dungeon } from '../types';

import MarkerPicker from '../components/MarkerPicker.vue';
import Invite from '../components/Invite.vue';
import Help from '../components/Help.vue';
import ErrorModal from '../components/ErrorModal.vue';

import * as Dungeons from '../components/dungeon';

@Component({
    components: { 
        MarkerPicker,
        Invite,
        Help,
        ErrorModal,
    },
})
export default class Main extends Vue {
    public state = useMain();
    public dungeons = {
        [Dungeon.DungeonOfTheMadMage]: {
            name: 'Dungeon of the Mad Mage',
            is: markRaw(Dungeons.DungeonOfTheMadMage),
        },
        [Dungeon.LostMineOfPhandelver]: {
            name: 'Lost Mine of Phandelver',
            is: markRaw(Dungeons.LostMineOfPhandelver),
        },
        [Dungeon.TombOfAnnihilation]: {
            name: 'Tomb of Annihilation',
            is: markRaw(Dungeons.TombOfAnnihilation),
        },
        [Dungeon.Undercity]: {
            name: 'Undercity',
            is: markRaw(Dungeons.Undercity),
        },
    };

    public error: any = null;
    public toEnable: Dungeon | null = null;

    public async created(): Promise<void> {
        window.addEventListener('beforeunload', (ev: BeforeUnloadEvent) => {
            if (this.state.dungeons.size > 0 || this.state.gameId && this.state.players.size === 1) {
                ev.returnValue = 'You will lose your current dungeon tracking.';
                ev.preventDefault()
                return false;
            }
        });

        if (!('gameId' in this.$route.params) || this.$route.params.gameId === '') {
            return;
        }

        try {
            await this.state.joinGame(this.$route.params.gameId as string);
        } catch (err) {
            this.error = err;
        }
    }

    public enable(): void {
        this.state.enableDungeon(this.toEnable!);
        this.toEnable = null;
    }

    public disable(dungeon: Dungeon): void {
        this.state.disableDungeon(dungeon);
    }
}

</script>

<style lang="scss" scoped>
.nav {
    position: absolute;
    top: 1rem;
    left: 0;
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: end;
    gap: .5rem;
}
.dungeons {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    white-space: nowrap;
    gap: 1rem;
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
    overflow-x: auto;

    .dungeon-wrapper {
        &:first-child {
            margin-left: auto;
        }
        &:last-child {
            margin-right: auto;
        }

        display: flex;
        flex-direction: column;
        gap: 1rem;
        .dungeon {
            height: 700px;
        }
        .field {
            display: flex;
            flex-direction: row-reverse;
        }
    }
}
</style>
