import {
    ActionReceiver,
    ActionReceiverSetter,
    ActionSender,
    Bridge,
} from '@planecha.se/bridge';
import { StateDump } from './types';
import type { useMain } from './store/main';

type Store = ReturnType<typeof useMain>;

enum EventType {
    INIT = 'INIT',
    SYNC = 'SYNC',
}

type GameData = undefined;

export interface NetInterface {
    gameId?: string;
    selfId?: string;
    connected: Promise<void>;

    getRoomInfo(): ReturnType<Bridge<GameData>['getInfo']>;
    create(): Promise<void>;
    join(handler: ActionReceiver<StateDump>): Promise<void>;

    sync(state: StateDump): void;
    leave(): void;
}

export class Net implements NetInterface {
    private store: Store;
    private bridge: Bridge<GameData>;

    private ready: boolean;
    private _gameId?: string;
    private _selfId?: string;

    public readonly sync: ActionSender<StateDump>;
    private _initReceiver: ActionReceiverSetter<StateDump>;
    
    public constructor(store: Store, gameId?: string) {
        this.ready = !gameId;
        this._gameId = gameId;

        this.store = store;
        this.bridge = Bridge.withBeacon(import.meta.env.VITE_BEACON_URL);

        const [initSender, initReceiver] = this.bridge.makeAction<StateDump>(EventType.INIT);
        const [syncSender, syncReceiver] = this.bridge.makeAction<StateDump>(EventType.SYNC);

        this._initReceiver = initReceiver;
        this.sync = syncSender;

        this.bridge.onPeerJoin((peerId) => this.ready && initSender(this.store.dump, peerId));
        this.bridge.onPeerLeave((peerId) => {
            this.store.players.delete(peerId);
            this.store.removeMarker(peerId);
        });
        
        syncReceiver((data) => this.store.restore(data));
    }

    public get connected() {
        return this.bridge.ready;
    }

    public get gameId() {
        return this._gameId;
    }

    public get selfId() {
        return this._selfId;
    }

    public async create(): Promise<void> {
        const data = await this.bridge.create(undefined);
        this._gameId = data.room;
        this._selfId = data.you;
    }

    public getRoomInfo() {
        return this.bridge.getInfo(this.gameId!);
    }

    public async join(handler: ActionReceiver<StateDump>): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            const timeout = setTimeout(() => {
                this.bridge.leave();
                reject(new Error('Could not retrieve game state.'));
            }, 5000);

            const join = this.bridge.join(this._gameId!);
            this._initReceiver(async (data, peer) => {
                await join;
                handler(data, peer);
                clearTimeout(timeout);
                this.ready = true;
                resolve();
            });
            try {
                const data = await join;
                this._selfId = data.you;
            } catch (err) {
                reject(err);
            }
        });
    }

    public leave(): void {
        this.bridge.leave();
    }
}