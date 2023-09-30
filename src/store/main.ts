import { defineStore } from 'pinia';
import { NetInterface, Net } from '../Net';
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
  net?: NetInterface;
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

type Fun<TA extends any[] = any[], TR = any> = (...args: TA) => TR;
function once<T extends Fun>(fun: T): T {
  let invs = 0;
  return ((...args: Parameters<T>) => {
    if (invs < 1) {
      invs++;
      return fun(...args);
    }
  }) as T;
}

function restoreMarker(): string {
  return localStorage.getItem('marker') 
    ?? EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

function getState(): State {
  const marker = restoreMarker();
  return {
    net: undefined,
    marker,
    players: new Map([['', marker]]),
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
    gameId: (state: State) => state.net?.gameId,
    selfId: (state: State) => state.net?.selfId ?? '',
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
      this.net?.sync(this.dump);
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
      this.players.set(this.selfId, marker);
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
      this.removeMarker(this.selfId);
      this.dungeons.get(dungeon)!.markers.set(this.selfId, room);
      this.sync();
    },

    async createGame() {
      this.net = new Net(this);
      try {
        await this.net.connected;
        await this.net.create();
      } catch (err) {
        this.net.leave();
        this.net = undefined;
        throw err;
      }
      this.players.set(this.selfId, this.marker);
      this.players.delete('');
      for (const d of this.dungeons.values()) {
        const room = d.markers.get('');
        if (room) {
          d.markers.set(this.selfId, room);
          d.markers.delete('');
        }
      }
    },
    async joinGame(gameId: string): Promise<void> {
      this.net = new Net(this, gameId);
      try {
        await this.net.connected;
        await this.net.join(once((dump) => {
          this.restore(dump);
          this.players.set(this.selfId, this.marker);
          this.sync();
        }));
      } catch (err) {
        this.net.leave();
        this.net = undefined;
        throw err;
      }
    },
    leaveGame(): void {
      this.net?.leave();
      this.$reset();
    },
  },
});
