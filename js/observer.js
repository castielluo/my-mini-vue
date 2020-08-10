class Observer {
    constructor (data) {
        this.data = data
        this.walk(data)
    }
    walk (data) {
        if (!data || typeof data !== 'object') return
        
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }
    defineReactive (data, key, val) {
        let self = this 
        this.walk(val)
        // 创建Dep发布者实例 进行依赖收集及消息通知
        let dep = new Dep()
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get () {
                // console.log(`get ${key}`)
                if(Dep.target) {
                    dep.addSub(Dep.target)
                }
                // return data[key] 这里如果写data[key]会死递归
                return val
            },
            set (newValue) {
                // console.log(`set ${key}`)
                if (newValue === val) return 
                val = newValue
                // 重新设置属性时 如果是一个对象 递归设置成响应式
                self.walk(newValue)
                // 消息通知
                dep.notify()
            }
        })
    }
}