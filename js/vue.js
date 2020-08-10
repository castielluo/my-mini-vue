class Vue {
    constructor(options) {
        // 挂载$option,$data,$el
        this.$options = options || {}
        this.$data = options.data || {}
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

        // 将data中的数值代理到vue实例上来，使用Object.defineProperty
        this._proxyData(this.$data)
        // 使用observable对象 将this.$data的属性劫持
        new Observer(this.$data)
        // 使用compile对象处理指令和插值表达式
        new Compiler(this)
    }

    _proxyData (data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                get () {
                    // console.log(`get ${key}`)
                    return data[key]
                },
                set (newValue) {
                    // console.log(`set ${key}`)
                    if (newValue === data[key]) return
                    data[key] = newValue
                }
            })
        })
    }
}