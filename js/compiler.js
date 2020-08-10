class Compiler {
    constructor (vm) {
        this.el = vm.$el
        this.vm = vm
        this.compile(this.el)
    }
    compile (node) {
        let childNodes = node.childNodes
        Array.from(childNodes).forEach(node => {
            // 判断是否text节点
            if (node.nodeType === 3) {
                this.compileText(node)
            } else if (node.nodeType === 1) {
                // 判断是否是元素节点
                this.compileElement(node)
            }
            // 如果节点有子节点 递归
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }

    compileText (node) {
        // console.dir(node)
        let value = node.textContent
        // console.log(value)
        let reg = /\{\{(.+?)\}\}/
        // console.log(reg.test(value))
        if (reg.test(value)) {
            let key = RegExp.$1.trim()
            // console.log(key)
            node.textContent = value.replace(reg, this.vm[key])
            // 首次编译 注册一个watcher
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = value.replace(reg, newValue)
            }) 
        }
    }

    // 编译元素节点 处理指令
    compileElement(node) {
        let attributes = node.attributes
        Array.from(attributes).forEach(attr => {
            let name = attr.name
            // 判断是否是指令
            if (name.startsWith('v-')) {
                let attrName = name.substring(2)
                this.update(node, attrName, attr.value)
            }
        })
    }

    // 按需加载指令处理方法
    update(node, attrName, key) {
        let fn = this[`${attrName}Update`]
        fn && fn.call(this, node, key)
    }

    textUpdate (node, key) {
        node.textContent = this.vm[key]
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
        })
    }

    modelUpdate (node, key) {
        node.value = this.vm[key]
        // 双向绑定
        node.addEventListener('input', () => {
            console.log(123)
            this.vm[key] = node.value
        })
        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue
        })
    }
} 