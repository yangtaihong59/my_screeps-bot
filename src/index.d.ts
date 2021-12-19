// 所有的 creep 角色
type CreepRoleConstant = BaseRoleConstant | AdvancedRoleConstant | RemoteRoleConstant | WarRoleConstant

// 房间基础运营
type BaseRoleConstant = 
    'harvester' |
    'collector' |
    'miner' |
    'upgrader' |
    'filler' |
    'builder' |
    'repairer'

// 房间高级运营
type AdvancedRoleConstant = 
    'manager' |
    'processor'

// 远程单位
type RemoteRoleConstant = 
    'claimer' |
    'reserver' |
    'signer' |
    'remoteBuilder' |
    'remoteUpgrader' |
    'remoteHarvester' |
    'depositHarvester' |
    'pbAttacker' |
    'pbHealer' |
    'pbCarrier' |
    'moveTester' |
    'reiver'

// 战斗单位
type WarRoleConstant =
    'soldier' |
    'doctor' |
    'boostDoctor' |
    'dismantler' |
    'boostDismantler' |
    'apocalypse' |
    'defender'


interface Memory {

    // 所有 creep 的配置项，每次 creep 死亡或者新增时都会通过这个表来完成初始化
    creepConfigs: {
        [creepName: string]: {
            // creep 的角色名
            role: CreepRoleConstant,
            // creep 的具体配置项，每个角色的配置都不相同
            num: number,
            // 执行 creep 孵化的房间名
            spawnRoom: string,
            // creep 孵化时使用的身体部件
            canspawn: boolean
        }
    }
}