const facToIdMap = {
    NEUTRAL: 2,
    HORDE: 1,
    ALLIANCE: 0
};

const mapRunMember = (member) => ({
    nme: member.profile.name,
    rlm: member.profile.realm.id,
    fac: facToIdMap[member.faction.type],
    spc: member.specialization.id
});

const mapApiRunToRun = (map, p) => (lg) => ({
    _id: `${lg.keystone_level}-${map}-${lg.duration}-${lg.completed_timestamp / 1000}`,
    end: lg.completed_timestamp / 1000,
    map,
    lvl: lg.keystone_level,
    dur: lg.duration,
    who: lg.members.map(m => mapRunMember(m)),
    p
});

module.exports = {
    mapApiRunToRun
};
