<template>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 745 1040">
    <image width="745" height="1040" xlink:href="/dungeon-of-the-mad-mage.png"></image>
    
    <g v-for="(conf, room) in config">
      <rect class="room" :class="{ visited: isRoomVisited(room) }" :x="conf.x" :y="conf.y" :width="conf.width"
        :height="conf.height" @click="setRoom(room)" />
      <template v-for="player, i in byRoom.get(room)">
        <text class="marker" :x="computeX(room, i, byRoom.get(room)?.length ?? 1)" :y="conf.y + (conf.height / 2)">
          {{ players.get(player) }}
        </text>
      </template>
    </g>
  </svg>
</template>

<script lang="ts">
import { Component } from "vue-facing-decorator";
import { Dungeon } from './Dungeon';
import {
  Dungeon as DungeonName,
  DungeonOfTheMadMageRoom as Room,
} from '../../types';

@Component
export default class DungeonOfTheMadMage extends Dungeon<DungeonName.DungeonOfTheMadMage> {
  public config = {
    [Room.YawningPortal]: { x: 64, y: 155, width: 615, height: 65 },
    [Room.DungeonLevel]: { x: 64, y: 236, width: 615, height: 65 },
    [Room.GoblinBazar]: { x: 64, y: 316, width: 300, height: 146 },
    [Room.TwistedCaverns]: { x: 378, y: 316, width: 302, height: 146 },
    [Room.LostLevel]: { x: 65, y: 477, width: 615, height: 66 },
    [Room.RunestoneCaverns]: { x: 66, y: 559, width: 298, height: 145 },
    [Room.MurialsGraveyard]: { x: 379, y: 559, width: 301, height: 145 },
    [Room.DeepMines]: { x: 67, y: 720, width: 615, height: 66 },
    [Room.MadWizardsLair]: { x: 67, y: 800, width: 614, height: 100 },
  };
  public dungeon = DungeonName.DungeonOfTheMadMage;
}
</script>
