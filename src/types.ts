export type Marker = string;
export type Player = string;

export enum Dungeon {
    DungeonOfTheMadMage,
    LostMineOfPhandelver,
    TombOfAnnihilation,
    Undercity,
}

export enum DungeonOfTheMadMageRoom {
    YawningPortal,
    DungeonLevel,
    GoblinBazar,
    TwistedCaverns,
    LostLevel,
    RunestoneCaverns,
    MurialsGraveyard,
    DeepMines,
    MadWizardsLair,
}

export enum LostMineOfPhandelverRoom {
    CaveEntrance,
    GoblinLair,
    MineTunnels,
    Storeroom,
    DarkPool,
    FungiCavern,
    TempleOfDumathoin,
}

export enum TombOfAnnihilationRoom {
    TrappedEntry,
    VeilsOfFear,
    SandfallCell,
    Oubliette,
    CradleOfTheDeathGod,
}

export enum UndercityRoom {
    SecretEntrance,
    Forge,
    LostWell,
    Trap,
    Arena,
    Stash,
    Archive,
    Catacombs,
    ThroneOfTheDeadThree,
}

export type Rooms = 
    DungeonOfTheMadMageRoom |
    LostMineOfPhandelverRoom |
    TombOfAnnihilationRoom |
    UndercityRoom;

export interface DungeonRoom {
    [Dungeon.DungeonOfTheMadMage]: DungeonOfTheMadMageRoom;
    [Dungeon.LostMineOfPhandelver]: LostMineOfPhandelverRoom;
    [Dungeon.TombOfAnnihilation]: TombOfAnnihilationRoom;
    [Dungeon.Undercity]: UndercityRoom;
}

export interface StateDump {
    players: Array<[Player, Marker]>;
    dungeons: Array<[
        Dungeon,
        { active: boolean, markers: Array<[Player, Rooms]> },
    ]>;
}