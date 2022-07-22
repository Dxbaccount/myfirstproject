$(function () {
    let form = layui.form
    // 调用 verify 定义表单验证规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须是 6 ~ 12 位，且不能出现空格！'],
        // 定义新密码与原密码是否相同的验证规则
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })

    // 提交修改密码
    $('.layui-form').submit(function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                $('.layui-form')[0].reset()
            }
        })
    })
})