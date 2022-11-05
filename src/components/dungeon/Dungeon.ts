import { Vue } from "vue-facing-decorator";
import { Game } from "../../net/Game";
import { useMain } from "../../store/main";
import { Dungeon as DungeonName, DungeonRoom, Player } from "../../types";

export interface Conf {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type StateByRoom<T> = Map<T, Array<Player>>;

export abstract class Dungeon<T extends DungeonName> extends Vue {
    public abstract config: Record<DungeonRoom[T], Conf>;
    public abstract dungeon: DungeonName;

    private _state = useMain();


    public get players() {
        return this._state.players;
    }

    public get state() {
        return this._state.dungeons.get(this.dungeon)!;
    }

    public get byRoom(): StateByRoom<DungeonRoom[T]> {
        return [...this.state.markers.entries()]
            .reduce((acc, [player, room]) => {
                acc.has(room)
                    ? acc.get(room)!.push(player)
                    : acc.set(room, [player]);
                return acc;
            }, new Map());
    }

    public setRoom(room: DungeonRoom[T]): void {
        (this.byRoom.get(room) ?? []).includes(Game.selfId)
            ? this._state.removeMarker(Game.selfId)
            : this._state.putMarkerOnRoom(this.dungeon, room);
    }

    public isRoomVisited(room: DungeonRoom[T]): boolean {
        return (this.byRoom.get(room)?.length ?? 0) > 0;
    }

    public computeX(room: DungeonRoom[T], i: number, total: number): number {
        const conf = this.config[room];
        const shift = (total - 1) * (50 / 2);
        return (conf.x + (conf.width / 2)) + (i * 50) - shift;
    }
}