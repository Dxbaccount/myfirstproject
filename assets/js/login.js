$(function () {
    // 去注册
    $('#link_reg').click(function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 去登录
    $('#link_login').on('click', () => {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从 layui 中获取 from 对象
    let form = layui.form
    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码为6到12位，且不能出现空格'],
        // 验证两次密码是否一致的规则
        repwd: function (value) {
            // 通过 value 形参，可以得到确认密码框中的值
            let pwdValue = $('#form_reg [name=password]').val()
            if (value !== pwdValue) {
                return '两次密码不一致'
            }
        }
    })

    let layer = layui.layer
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        let data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, (res) => {
            if (res.status !== 0) {
                console.log(res.message)
                return layer.msg(res.message)
            }
            layer.msg(res.message)
            console.log(res.message)
            $('#link_login').click()
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // 登录失败提示
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 登录成功提示
                layer.msg(res.message)
                // 登录成功后，将服务器响应回来的 token 保存在 localStorage 中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/day01/index.html'
            }
        })
    })
})

