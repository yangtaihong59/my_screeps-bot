
export const globalset = function () {
global.creepApi = {
    /**
     * 新增 creep 配置项
     * @param configName 配置项名称
     * @param role 该 creep 的角色
     * @param args creep 的工作参数
     */
    add(configName, role, num, spawnRoom, ...args) {
        if (!Memory.creepConfigs) Memory.creepConfigs = {}
        Memory.creepConfigs[configName] = { role, num, spawnRoom, ...args }
        return `${configName} 配置项已更新：[角色] ${role}  [个体数量] ${num} [spawn号]${spawnRoom} [工作参数] ${args} `
    },
    /**
     * 移除指定 creep 配置项
     * @param configName 要移除的配置项名称
     */
    remove(configName) {
        delete Memory.creepConfigs[configName]
        return `${configName} 配置项已移除`
    },
    /**
     * 获取 creep 配置项
     * @param configName 要获取的配置项名称
     * @returns 对应的配置项，若不存在则返回 undefined
     */
    get(configName) {
        if (!Memory.creepConfigs) return undefined
        return Memory.creepConfigs[configName]
    }
}
}
