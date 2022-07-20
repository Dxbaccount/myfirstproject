// 每次调用 $.get() $.post $.ajax()，发起 ajax 请求的时候，
// 都会先调用 ajaxPrefilter() 这个函数，
// 通过这个函数可以拿到为 ajax 提供的配置对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url

    // 统一为有权限的接口设置请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    
})