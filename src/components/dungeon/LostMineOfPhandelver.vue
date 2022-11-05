<template>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 745 1040">
    <image width="745" height="1040" xlink:href="/lost-mine-of-phandelver.png"></image>

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
  LostMineOfPhandelverRoom as Room,
} from '../../types';

@Component
export default class LostMineOfPhandelver extends Dungeon<DungeonName.LostMineOfPhandelver> {
  public config = {
    [Room.CaveEntrance]: { x: 65, y: 156, width: 617, height: 147 },
    [Room.GoblinLair]: { x: 65, y: 318, width: 303, height: 184 },
    [Room.MineTunnels]: { x: 383, y: 318, width: 299, height: 184 },
    [Room.Storeroom]: { x: 65, y: 518, width: 182, height: 228 },
    [Room.DarkPool]: { x: 263, y: 518, width: 222, height: 228 },
    [Room.FungiCavern]: { x: 500, y: 518, width: 182, height: 228 },
    [Room.TempleOfDumathoin]: { x: 65, y: 761, width: 616, height: 140 },
  };
  public dungeon: DungeonName = DungeonName.LostMineOfPhandelver;
}
</script>
