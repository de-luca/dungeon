<template>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 745 1040">
    <image width="745" height="1040" xlink:href="/tomb-of-annihilation.png"></image>

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
  TombOfAnnihilationRoom as Room,
} from '../../types';

@Component
export default class TombOfAnnihilation extends Dungeon<DungeonName.TombOfAnnihilation> {
  public config = {
    [Room.TrappedEntry]: { x: 64, y: 155, width: 615, height: 146 },
    [Room.VeilsOfFear]: { x: 64, y: 317, width: 300, height: 185 },
    [Room.SandfallCell]: { x: 64, y: 516, width: 300, height: 189 },
    [Room.Oubliette]: { x: 379, y: 317, width: 300, height: 388 },
    [Room.CradleOfTheDeathGod]: { x: 64, y: 720, width: 615, height: 182 },
  };
  public dungeon: DungeonName = DungeonName.TombOfAnnihilation;
}
</script>
