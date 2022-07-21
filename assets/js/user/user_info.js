$(function () {
    let form = layui.form
    let layer = layui.layer
    // 定义用户信息的表单验证规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '用户昵称必须在 6 ~ 12 个字符之间！'
            }
        }
    })

    // 调用 initUserInfo 函数，获取用户基本信息填充到表单
    initUserInfo()

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单
    $('#btnReset').click((e) => {
        // 阻止表单的默认重置行为
        e.preventDefault()
        // 调用 initUserInfo 函数，获取用户基本信息填充到表单
        initUserInfo()

    })

    // 提交修改
    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发起 ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 调用父页面中的方法重新渲染用户头像和用户信息
                window.parent.getUserInfo()
            }


        })
    })

})