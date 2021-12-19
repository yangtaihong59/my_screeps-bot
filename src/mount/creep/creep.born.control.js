
export const creepborncontrol = function () {
    //清除死去creep的memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }  
    //**name2 为生成列表
    
    var Spawnid = 'Spawn1'
    for(var name in Memory.creepConfigs){
        var worker = _.filter(Game.creeps, (creep) => (creep.memory.configName == name))
        var spawningworker = 0
        for (var num in Memory.spawns[Spawnid].spawnList){
            var name2=Memory.spawns[Spawnid].spawnList[num]
            if(name==name2 ){spawningworker =spawningworker+1}
        }
        if (0){
            console.log(`[角色名] ${name} [现场单位数] ${worker.length} [计划数]${creepApi.get(name).num} [生成列表数]${spawningworker} `)
        }
        //if(Game.spawns[Spawnid].spawning) spawningworker =spawningworker+1;
        if((worker.length+spawningworker) < creepApi.get(name).num){
            Memory.creepConfigs[name].canspawn= true
            var listlength = Game.spawns[Spawnid].addTask(name,'push')
            console.log('[加入待生成列表]  '+name+'  [列表长度]  '+listlength)
        }
        else if((worker.length+spawningworker) > creepApi.get(name).num){
            if (Memory.creepConfigs[name].canspawn) console.log('more '+name);
            if (!Memory.creepConfigs[name].canspawn) Memory.creepConfigs[name].canspawn={};
            Memory.creepConfigs[name].canspawn= false
        }else if((worker.length+spawningworker) == creepApi.get(name).num){
            Memory.creepConfigs[name].canspawn= true
        }
    }
}


export const globalset = function () {
    global.creepApi = {
        /**
         * 新增 creep 配置项
         * @param configName 配置项名称
         * @param role 该 creep 的角色
         * @param args creep 的工作参数
         */
        add(configName, role, body, num, spawn, ...args) {
            if (!Memory.creepConfigs) Memory.creepConfigs = {}
            Memory.creepConfigs[configName] = { role, body, num, spawn, args }
            
            return `${configName} 配置项已更新：[角色] ${role} [身体组成] ${body} [个体数量] ${num} [spawn号]${spawn} [工作参数] ${args} `
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
    

export const creepApi = {
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
        