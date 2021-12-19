import { bodyConfigs } from "../../setting";

const spawncreeps = function(worker,spawn,newName,creepConfig,taskName){
    if (creepConfig.role == worker && Game.spawns[spawn].spawnCreep(Game.spawns[spawn].getBodys(creepConfig.role),newName, { dryRun: true })==0){
        console.log('[开始生成] : [任务角色]  '+creepConfig.role+'  [身体组成]  '+Game.spawns[spawn].getBodys(creepConfig.role))
        return Game.spawns[spawn].spawnCreep(Game.spawns[spawn].getBodys(creepConfig.role), newName, { memory: { configName: taskName }}) == 0
    }
}
export const mountSpawn = function () {
    // 将拓展签入 Creep 原型
    _.assign(Spawn.prototype, spawnExtension)
}
    
// 自定义的 Creep 的拓展
const spawnExtension = {
    //工作
    work(){
        // 自己已经在生成了 / 内存里没有生成队列 / 生产队列为空 就啥都不干
        if (this.spawning || !this.memory.spawnList || this.memory.spawnList.length == 0) return 
        // 进行生成
        const spawnSuccess = this.mainSpawn(this.memory.spawnList[0])
        //console.log(spawnSuccess)
        // 生成成功后移除任务
        if (spawnSuccess) this.memory.spawnList.shift()
    },      
    //将生成任务推入队列
    addTask(taskName,direct){ 
        // 任务加入队列
        if(!this.memory.spawnList) this.memory.spawnList = []
        if(direct == 'push'){
            this.memory.spawnList.push(taskName)
            return this.memory.spawnList.length
        }
        else if(direct == 'unshift'){
            this.memory.spawnList.unshift(taskName)
            return this.memory.spawnList.length
        }else if(direct == 'pop'){
            this.memory.spawnList.pop(taskName)
            return this.memory.spawnList.length
        }
    },
    // creep 生成主要实现
    mainSpawn(taskName){
        const creepConfig = creepApi.get(taskName)
        var newName = creepConfig.role + Game.time;
        if(spawncreeps('harvester','Spawn1',newName,creepConfig,taskName)) return true;
        if(spawncreeps('upgrader','Spawn1',newName,creepConfig,taskName)) return true;
        if(spawncreeps('builder','Spawn1',newName,creepConfig,taskName)) return true;
        //if(spawncreeps(miner,'Spawn1',newName,creepConfig,taskName)) return true;
    },
    getBodys(bodyType){
        const bodyConfig = bodyConfigs[bodyType]

        const targetLevel = Object.keys(bodyConfig).reverse().find(level => {
            // 先通过等级粗略判断，再加上 dryRun 精确验证
            const availableEnergyCheck = (Number(level) <= this.room.energyAvailable)
            const dryCheck = (this.spawnCreep(bodyConfig[level], 'bodyTester', { dryRun: true }) == OK)

            return availableEnergyCheck && dryCheck
        })
        if (!targetLevel) return [ ]

        // 获取身体部件
        const bodys = bodyConfig[targetLevel]

        return bodys
    }
}
    
