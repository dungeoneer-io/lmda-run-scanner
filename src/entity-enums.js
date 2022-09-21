const COLLECTIONS = {
    SNAPSHOTS: 'snapshots',
    BLIZZARDENTITYEVENTS: 'BlizzEntityEvents',
    AFFIXES: 'MythicAffixes',
    DUNGEONS: 'MythicDungeons',
    PERIODS: 'MythicPeriods',
    RACES: 'PlayableRaces',
    CLASSES: 'PlayableClasses',
    SPECIALIZATIONS: 'PlayableSpecs',
    // PERIODFIXTURES: 'ZPH_PeriodFixtures'
    RUNS: 'Runs'
};

const BAPI_MYTHIC_RESOURCE_TYPES = {
    DUNGEON: 'dungeon',
    PERIOD: 'period'
};

const DATABASES = {
    DEFAULT: 'US'
};

const BEE_TYPES = {
    AFFIX: 'AFFIX',
    DUNGEON: 'DUNGEON',
    PERIOD: 'PERIOD',
    CLASS: 'CLASS',
    RACE: 'RACE',
    SPECIALIZATION: 'SPEC'
};

module.exports = {
    BAPI_MYTHIC_RESOURCE_TYPES,
    BEE_TYPES,
    COLLECTIONS,
    DATABASES
};
