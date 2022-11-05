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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { useMain } from '../store/main';
import { Dungeon } from '../types';

import MarkerPicker from '../components/MarkerPicker.vue';
import Invite from '../components/Invite.vue';
import Help from '../components/Help.vue';

import DungeonOfTheMadMage from '../components/dungeon/DungeonOfTheMadMage.vue';
import LostMineOfPhandelver from '../components/dungeon/LostMineOfPhandelver.vue';
import TombOfAnnihilation from '../components/dungeon/TombOfAnnihilation.vue';
import Undercity from '../components/dungeon/Undercity.vue';

@Component({
    components: { 
        MarkerPicker,
        Invite,
        Help,
        DungeonOfTheMadMage,
        LostMineOfPhandelver,
        TombOfAnnihilation,
        Undercity,
    },
})
export default class Main extends Vue {
    public state = useMain();
    public dungeons = {
        [Dungeon.DungeonOfTheMadMage]: {
            name: 'Dungeon of the Mad Mage',
            is: DungeonOfTheMadMage,
        },
        [Dungeon.LostMineOfPhandelver]: {
            name: 'Lost Mine of Phandelver',
            is: LostMineOfPhandelver,
        },
        [Dungeon.TombOfAnnihilation]: {
            name: 'Tomb of Annihilation',
            is: TombOfAnnihilation,
        },
        [Dungeon.Undercity]: {
            name: 'Undercity',
            is: Undercity,
        },
    };

    public toEnable: Dungeon | null = null;

    public created(): void {
        if ('gameId' in this.$route.params && this.$route.params.gameId !== '') {
            this.state.joinGame(this.$route.params.gameId as string);
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
