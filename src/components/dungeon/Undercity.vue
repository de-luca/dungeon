<template>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 745 1040">
    <image width="745" height="1040" xlink:href="/undercity.png"></image>
    
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
  UndercityRoom as Room,
} from '../../types';

@Component
export default class Undercity extends Dungeon<DungeonName.Undercity> {
  public config = {
    [Room.SecretEntrance]: { x: 65, y: 210, width: 620, height: 105 },
    [Room.Forge]: { x: 65, y: 330, width: 303, height: 102 },
    [Room.LostWell]: { x: 383, y: 330, width: 300, height: 102 },
    [Room.Trap]: { x: 65, y: 445, width: 223, height: 145 },
    [Room.Arena]: { x: 300, y: 445, width: 145, height: 145 },
    [Room.Stash]: { x: 462, y: 445, width: 220, height: 145 },
    [Room.Archive]: { x: 65, y: 605, width: 303, height: 140 },
    [Room.Catacombs]: { x: 383, y: 605, width: 300, height: 140 },
    [Room.ThroneOfTheDeadThree]: { x: 65, y: 763, width: 620, height: 180 },
  };
  public dungeon: DungeonName = DungeonName.Undercity;
}
</script>
