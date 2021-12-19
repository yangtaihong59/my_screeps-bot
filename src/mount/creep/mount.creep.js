
export const mountCreep = function () {
// 将拓展签入 Creep 原型
    _.assign(Creep.prototype, creepExtension)
}

/**
 * 引入 creep 配置项
 * 其键为角色名（role），其值为对应角色的逻辑生成函数
 */
 const roles = {
    //升级者
    upgrader : sourceId => ({
        // 采集能量矿
        source: creep => {
            return creep.harvestEnergy(sourceId)
        },
        // 升级控制器
        target: creep => {
            return creep.upgrade()
        }
    }),
    //能量采集者
    harvester : sourceId => ({
        // 采集能量矿
        source: creep => {
            return creep.harvestEnergy(sourceId)
        },
        // 升级控制器
        target: creep => {
            if(creep.fillSpawnEngry() == 'ERR_NO_TARGET'){
                if(creep.buildStructure() == 'ERR_NO_TARGET'){
                    return creep.upgrade()
                }else{
                    return creep.buildStructure()
                }
                
            }else{
                return creep.fillSpawnEngry()
            }
        }
    }),
    builder :  sourceId => ({
        // 采集能量矿
        source: creep => {
            return creep.harvestEnergy(sourceId)
        },
        // 升级控制器
        target: creep => {
            if(creep.buildStructure() == 'ERR_NO_TARGET'){
                if(creep.repairStructure() == 'ERR_NO_TARGET'){
                    return creep.upgrade()
                }else{
                    return creep.repairStructure()
                }
            }else{
                return creep.buildStructure()
            }
        }
    }),
    transfer :  sourceId => ({
        source: creep => {
        },
        target: creep => {
        }
    }),
    miner :  targetId => ({
        prepare: creep => {
            let target//: StructureContainer | Source | ConstructionSite
            // 如果有缓存的话就获取缓存
            if (creep.memory.targetId) target = Game.getObjectById<StructureContainer | Source>(creep.memory.sourceId)
            const source = Game.getObjectById<Source>(data.sourceId)

            // 没有缓存或者缓存失效了就重新获取
            if (!target) {
                // 先尝试获取 container
                const containers = source.pos.findInRange<StructureContainer>(FIND_STRUCTURES, 1, {
                    filter: s => s.structureType === STRUCTURE_CONTAINER
                })

                // 找到了就把 container 当做目标
                if (containers.length > 0) target = containers[0]
            }

            // 还没找到就找 container 的工地
            if (!target) {
                const constructionSite = source.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {
                    filter: s => s.structureType === STRUCTURE_CONTAINER
                })

                if (constructionSite.length > 0) target = constructionSite[0]
            }

            // 如果还是没找到的话就用 source 当作目标
            if (!target) target = source
            creep.memory.targetId = target.id

            // 设置移动范围并进行移动（source 走到附近、container 和工地就走到它上面）
            const range = target instanceof Source ? 1 : 0
            creep.goTo(target.pos, range)

            // 抵达位置了就准备完成
            if (creep.pos.inRangeTo(target.pos, range)) return true
            return false
        },
        source: creep => {
        },
        target: creep => {
        }
    }),
 }

// 自定义的 Creep 的拓展
const creepExtension = {
    //工作
    work(){
        // ------------------------ 第一步：获取 creep 执行逻辑 ------------------------

        // 获取对应配置项
        const creepConfig = creepApi.get(this.memory.configName)
        // 检查 creep 内存中的配置是否存在
        if (!creepConfig) {
            console.log(`creep ${this.name} 携带了一个无效的配置项 ${this.memory.configName}`)
            this.say('找不到配置！')
            return 
        }
        const creepLogic = roles[creepConfig.role](...creepConfig.args)

        // ------------------------ 第二步：执行 creep 准备阶段 ------------------------

        // 没准备的时候就执行准备阶段
        if (!this.memory.ready) {
            // 有准备阶段配置则执行
            if (creepLogic.prepare && creepLogic.isReady) {
                creepLogic.prepare(this)
                this.memory.ready = creepLogic.isReady(this)
            }
            // 没有就直接准备完成
            else this.memory.ready = true
            return
        }

        // ------------------------ 第三步：执行 creep 工作阶段 ------------------------

        let stateChange = true
        // 执行对应阶段
        // 阶段执行结果返回 true 就说明需要更换 working 状态
        if (this.memory.working) {
            if (creepLogic.target) stateChange = creepLogic.target(this)
            // this.say('working')
            //this.say(`${this.memory.configName}`)
        }
        else {
            if (creepLogic.source) stateChange = creepLogic.source(this)
            //this.say('source')
        }

        // 状态变化了就切换工作阶段
        if (stateChange) this.memory.working = !this.memory.working

        // ------------------------ 健康自检 -------------------------------------------

        // 如果 creep 还没有发送重生信息的话，执行健康检查，保证只发送一次生成任务
        // 健康检查不通过则向 spawnList 发送自己的生成任务
        if (!this.memory.hasSendRebirth) {
            const health = this.isHealthy()
            if (!health) {
                // 向指定 spawn 推送生成任务
                if(Memory.creepConfigs[this.memory.configName].canspawn){
                var listlength = Game.spawns.Spawn1.addTask(this.memory.configName,'push')
                console.log('[creep报告加入待生成列表]  '+this.memory.configName+'  [列表长度]  '+listlength)
                // ...
                this.memory.hasSendRebirth = true
                }else{
                    this.say('后继无人')
                }
            }
        }
        else{
            this.say('借朕的班')
        }
    },
    // creep 监控状态检查
    isHealthy(){
        if (this.ticksToLive <= 80) return false
        else return true
    },
    // 建造
    buildStructure(){
        const targets = this.room.find(FIND_CONSTRUCTION_SITES)
        // 找到就去建造
        if (targets.length > 0) {
            if(this.build(targets[0]) == ERR_NOT_IN_RANGE) {
                this.moveTo(targets[0])
            }
        }
        else{
            return 'ERR_NO_TARGET'
        }
        // 自己身上的能量没有了，返回 true（切换至 source 阶段）
        return this.store[RESOURCE_ENERGY] <= 0
    },
    // energy采集
    harvestEnergy(sourceId){
        const source = Game.getObjectById(sourceId)
        if (this.harvest(source) == ERR_NOT_IN_RANGE) this.moveTo(source)

        // 自己身上的能量装满了，返回 true
        return this.store.getFreeCapacity() <= 0
    },
    // 升级
    upgrade(){
        const controller = this.room.controller
        if (this.upgradeController(controller) == ERR_NOT_IN_RANGE) this.moveTo(controller)

        // 自己身上的能量没有了，返回 true（切换至 source 阶段）
        return this.store[RESOURCE_ENERGY] <= 0
    },
    repairStructure(){
        var target = this.room.find(FIND_STRUCTURES,{
            filter:(structure)=>{
                return structure.hits < structure.hitsMax*0.9;
            }
        });
        if( target.length >0){
            if(this.repair(target[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                this.moveTo(target[0],{visualizePathStyle:{stroke: '#ffffff'}});
            }
        }else{
            return 'ERR_NO_TARGET'
        }
        // 自己身上的能量没有了，返回 true（切换至 source 阶段）
        return this.store[RESOURCE_ENERGY] <= 0
    },
    // creep讲话
    sayHello(){
        this.say(`我的名字是${this.name}`)
    },
    // 自定义敌人检测
    checkEnemy() { 
        // 代码实现...
    },
    // 填充所有 spawn 和 extension
    fillSpawnEngry() { 
        var targets = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 200 ) ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION||
                        structure.structureType == STRUCTURE_STORAGE) && 
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if(targets) 
        {
            if(this.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                this.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            return 'ERR_NO_TARGET'
        }
        // 自己身上的能量没有了，返回 true（切换至 source 阶段）
        return this.store[RESOURCE_ENERGY] <= 0
    },
    // 填充所有 tower
    fillTower() {
        var target = this.pos.findClosestByPath(FIND_STRUCTURES,{
            filter:(structure) => {
                return (structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 200 ) ;
            }
        });
        if(target){
            if(this.transfer(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                this.moveTo(target,{visualizePathStyle:{stroke: '#ffffff'}});
            }
        }else{
            return 'ERR_NO_TARGET'
        }
        // 自己身上的能量没有了，返回 true（切换至 source 阶段）
        return this.store[RESOURCE_ENERGY] <= 0
    },
    // 从container取出能量
    getEngryFrom(target) {
        let result
        // 是建筑就用 withdraw
        if (target instanceof Structure) result = this.withdraw(target)
        // 不是的话就用 harvest
        else {
            result = this.harvest(target)
        }

        if (result === ERR_NOT_IN_RANGE) this.goTo(target.pos)

        return result
    },
    // 其他更多自定义拓展
}

