import { ActionSender, joinRoom, Room, selfId } from 'trystero';
import { StateDump } from '../types';

import type { useMain } from '../store/main';

type Fun<TA extends any[] = any[], TR = any> = (...args: TA) => TR;
type Store = ReturnType<typeof useMain>;

enum EventType {
    INIT = 'INIT',
    SYNC = 'SYNC',
}

function once<T extends Fun>(fun: T): T {
    let invs = 0;
    return ((...args: Parameters<T>) => {
        if (invs < 1) {
            invs++;
            return fun(...args);
        }
    }) as T;
}

export interface GameInterface {
    gameId: string;
    sync(state: StateDump): void;
    leave(): void;
}

export class Game implements GameInterface {
    private static readonly gameIdLength = 20;
    private static readonly gameIdCharSet = '0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
    private static readonly appId = 'dev-dungeon';
    
    public static readonly selfId = selfId;

    public readonly gameId: string;
    private store: Store;
    private room: Room;

    private syncSender!: ActionSender<StateDump>;
    
    public constructor(store: Store, gameId?: string) {
        this.gameId = gameId ?? Game.genId();
        this.store = store;
        this.room = joinRoom({ appId: Game.appId }, this.gameId);

        this.register();
    }

    private static genId(): string {
        return new Array(this.gameIdLength)
            .fill('')
            .map(() => this.gameIdCharSet[Math.floor(Math.random() * this.gameIdCharSet.length)])
            .join('');
    }

    private register(): void {
        const [initSender, initReceiver] = this.room.makeAction<StateDump>(EventType.INIT);
        const [syncSender, syncReceiver] = this.room.makeAction<StateDump>(EventType.SYNC);
        
        this.syncSender = syncSender;

        this.room.onPeerJoin((peerId) => initSender(this.store.dump, [peerId]));
        this.room.onPeerLeave((peerId) => {
            console.log('PEER LEFT', peerId);
            this.store.players.delete(peerId);
            this.store.removeMarker(peerId);
        });

        syncReceiver((data) => this.store.restore(data));
        initReceiver(once((data) => {
            this.store.restore(data);
            this.store.players.set(Game.selfId, this.store.marker);
            this.store.sync();
        }));
    }

    public sync(state: StateDump): void {
        this.syncSender(state);
    }

    public leave(): void {
        this.room.leave();
    }
}