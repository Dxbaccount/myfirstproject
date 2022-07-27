$(function () {
    let layer = layui.layer

    getArtList()
})

// 定义查询参数对象
let q = {
    pagenum: 1,  // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数，默认显示两条
    cate_id: '', // 文章分类的 Id
    state: ''    // 文章的发布状态
}

// 获取文章列表数据
function getArtList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            // 使用模板引擎渲染表格数据
            let htmlStr = template('tpl_table', res)
            $('tbody').html(htmlStr)
        }
    })
}