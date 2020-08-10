class Watcher {
    constructor (vm, key, cb) {
        this.vm = vm
        this.key = key
        
        // 回调函数负责更新视图
        this.cb = cb

        // 把watcher对象记录到Dep类的静态属性target里
        Dep.target = this
        // 记录旧值 同时触发get 调用dep的addSub
        this.oldValue = vm[key]
        // 触发完后可以清空
        Dep.target = null
    }

    update () {
        let newValue = this.vm[this.key]
        if (newValue === this.oldValue) return
        this.cb(newValue)
    }
}
