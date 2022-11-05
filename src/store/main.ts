import { defineStore } from 'pinia';
import { GameInterface, Game } from '../net/Game';
import { 
  Dungeon, 
  DungeonRoom, 
  Marker,
  Player,
  StateDump, 
} from '../types';

export interface DungeonState<T extends Dungeon> {
  active: boolean;
  markers: Map<Player, DungeonRoom[T]>;
}

export interface State {
  game?: GameInterface;
  marker: Marker;
  players: Map<Player, Marker>;
  dungeons: Map<Dungeon, DungeonState<Dungeon>>;
}

const EMOJIS = [
  '🦄', '🐧', '🦆', '🗿', '🫠',
  '🫥', '👁', '👄', '👠', '🐳',
  '🐉', '🍒', '🍑', '🍆', '🍺',
  '🏝', '🦠', '🪅', '🏳️‍🌈', '🏳️‍⚧️',
];

function restoreMarker(): string {
  return localStorage.getItem('marker') 
    ?? EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

function getState(): State {
  const marker = restoreMarker();
  return {
    game: undefined,
    marker,
    players: new Map([[Game.selfId, marker]]),
    dungeons: new Map(),
  };
}

function getDungeonState<T extends Dungeon>(): DungeonState<T> {
  return {
    active: true,
    markers: new Map(),
  };
}

const DUNGEON_IDS = Object.values(Dungeon).filter(i => typeof i === 'number');

export const useMain = defineStore('main', {
  state: getState,

  getters: {
    gameId: (state: State) => state.game?.gameId,
    available: (state: State): Array<Dungeon> => {
      const ids = [...state.dungeons.keys()];
      return DUNGEON_IDS.filter(id => !ids.includes(id as Dungeon)) as Array<Dungeon>;
    },
    dump: (state: State): StateDump => ({
      players: [...state.players.entries()],
      dungeons: [...state.dungeons.entries()].map((dungeon) => [
        dungeon[0],
        {
          active: dungeon[1].active,
          markers: [...dungeon[1].markers.entries()]
        }
      ]),
    }),
  },

  actions: {
    sync(): void {
      this.game?.sync(this.dump);
    },
    restore(dump: StateDump): void {
      this.players = new Map(dump.players);
      this.dungeons = new Map(
        dump.dungeons.map((dungeon) => ([
          dungeon[0],
          {
            active: dungeon[1].active,
            markers: new Map(dungeon[1].markers),
          },
        ])),
      );
    },

    setMarker(marker: string): void {
      this.marker = marker;
      this.players.set(Game.selfId, marker);
      localStorage.setItem('marker', this.marker);
      this.sync();
    },

    enableDungeon(dungeon: Dungeon): void {
      this.dungeons.set(dungeon, getDungeonState());
      this.sync();
    },
    disableDungeon(dungeon: Dungeon): void {
      this.dungeons.delete(dungeon);
      this.sync();
    },

    removeMarker(player: Player): void {
      for (const d of this.dungeons.values()) {
        d.markers.delete(player);
      }
    },

    putMarkerOnRoom<T extends Dungeon>(dungeon: T, room: DungeonRoom[T]): void {
      this.removeMarker(Game.selfId);
      this.dungeons.get(dungeon)!.markers.set(Game.selfId, room);
      this.sync();
    },

    createGame(): void {
      this.game = new Game(this);
    },
    joinGame(gameId: string): void {
      this.game = new Game(this, gameId);
    },
    leaveGame(): void {
      this.game?.leave();
      this.$reset();
    },
  },
});
