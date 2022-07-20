$(function () {
    // 调用 gerUserInfo 获取用户基本信息
    getUserInfo()
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }

            // 调用 renderAvatar 渲染用户头像
            renderAvatar(res.data)
        }
    })
}

// 渲染用户头像
function  renderAvatar(user) {
    // 1. 获取用户的名称
    let name = user.nickname || user.username
    // 2. 设置欢迎文本
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    }else {
        // 3.2 渲染的文字头像
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}