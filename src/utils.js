/**
 * 执行 Hash Map 中子元素对象的 work 方法
 * 
 * @param hashMap 游戏对象的 hash map。如 Game.creeps、Game.spawns 等
 * @param showCpu [可选] 传入指定字符串来启动该 Map 的数量统计
 */
 export function doing(...hashMaps) {
    hashMaps.forEach((obj, index) => {
        let startCost = Game.cpu.getUsed()

        // 遍历执行 work
        Object.values(obj).forEach(item => {
            if (item.work) item.work()
        })

    })
}

/**
 * 根据身体配置生成完成的身体数组
 * cpu 消耗: 0.028 左右
 * 
 * @param bodySet 身体部件配置对象
 */
 export function calcBodyPart(bodySet) {
    // 把身体配置项拓展成如下形式的二维数组
    // [ [ TOUGH ], [ WORK, WORK ], [ MOVE, MOVE, MOVE ] ]
    const bodys = Object.keys(bodySet).map(type => Array(bodySet[type]).fill(type))
    // 把二维数组展平
    return [].concat(...bodys)
}

