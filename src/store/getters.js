const getters = {
    area: state => state.index.area,
    total: state => state.index.total,
    origanization: state => state.index.origanization,
    service: state => state.index.service,
    age: state => state.index.age,
    policy: state => state.index.policy,
    map: state => state.index.map,
    org: state => state.index.org,
    msgpush: state => state.index.msgpush,

    screen_multiple: state => state.app.screen_multiple,
    area_code: state => state.app.area_code,

    serviceListState: state => state.second.serviceListState,
    policyInfo: state => state.second.policy,
    ageRange: state => state.second.ageRange,
    servePoepleList: state => state.second.servePoepleList,
    serveApplyPoepleList: state => state.second.serveApplyPoepleList,
    serveApplyList: state => state.second.serveApplyList,
    serveCompleteList: state => state.second.serveCompleteList,

    terminal: state => state.third.terminal,
    day: state => state.third.day,

}

export default getters