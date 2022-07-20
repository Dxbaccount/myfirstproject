$(function () {
    // 调用 gerUserInfo 获取用户基本信息
    getUserInfo()

    let layer = layui.layer

    // 点击按钮实现退出功能
    $('#btnLogout').click(function () {
        // 提示用户是否确认退出
        layer.confirm('是否确认退出?', { icon: 3, title: '退出' }, function (index) {
            // 1. 清空本地存储中的 token
            localStorage.removeItem('token')
            // 2. 跳转到登录页面
            location.href = '/login.html'

            // 关闭 confirm 询问框
            layer.close(index);
        })
    })
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
        },
        // 无论请求成功或失败都会执行这个函数
       /*  complete: function (res) {
            // 在这个函数中，可以通过 res.responseJSON 得到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 1. 强制清空 token 
                localStorage.removeItem('token')
                // 2. 强制跳转到登录页
                location.href = '/login.html'
            }
        } */
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