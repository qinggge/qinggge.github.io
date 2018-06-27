!function () {
    var view = document.querySelector('section.message')

    var model = {
        // 获取数据
        fetch: function () {
            var query = new AV.Query('Message');
            return query.find() // Promise对象
        },
        // 保存数据
        save: function (name, content) {
            var Message = AV.Object.extend('Message')
            var message = new Message()
            return message.save({ // Promise对象
                'name': name,
                'content': content
            })
        },
        // 初始化
        init: function () {
            var APP_ID = '0EVWUF3vbKCArQfR7yLjI30e-gzGzoHsz'
            var APP_KEY = 't6XeBB95lOYrWSMvWT7Xv6XF'
            AV.init({ appId: APP_ID, appKey: APP_KEY })
        },
    }

    var controller = {
        view: null,
        model: null,
        messageList: null,
        init: function (view,model) {
            this.view = view
            this.model = model

            this.messageList = view.querySelector('#messageList')
            this.form = view.querySelector('#postMessageForm')
            this.model.init()
            this.loadMessages()
            this.bindEvents()
        },
        loadMessages: function () {
            this.model.fetch().then(
                (messages) => {
                    let array = messages.map((item) => item.attributes)
                    array.forEach((item) => {
                        let li = document.createElement('li')
                        li.innerText = `${item.name}：${item.content}`
                        this.messageList.appendChild(li)
                    })
                },
                function (error) {
                    alert('提交失败，请改天来留言')
                }
            )
        },
        bindEvents: function () {
            console.log(this)
            this.form.addEventListener('submit', function (e) {
                e.preventDefault()
                this.saveMessage()
            }.bind(controller))
        },
        saveMessage: function () {
            let myForm = this.form
            let content = myForm.querySelector('input[name=content]').value
            let name = myForm.querySelector('input[name=name]').value
            this.model.save(name,content).then(function (object) {
                let li = document.createElement('li')
                li.innerText = `${object.attributes.name}：${object.attributes.content}`
                let messageList = document.querySelector('#messageList')
                messageList.appendChild(li)
                myForm.querySelector('input[name=content]').value = ''
            })
        }
    }
    controller.init(view,model)

}.call()