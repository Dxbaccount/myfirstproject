$(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    // 定义格式化时间的过滤器
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    // 补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    } 

    // 定义查询参数对象
    let q = {
        pagenum: 1,  // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数，默认显示两条
        cate_id: '', // 文章分类的 Id
        state: ''    // 文章的发布状态
    }

    getArtList()

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
                console.log(res)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    getArtCate()
    // 获取文章分类数据
    function getArtCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return
                }
                let artCateHtmlStr = template('tpl_artCate', res)
                $('[name=cate_id]').html(artCateHtmlStr)
                form.render()
            }
        })
    }

    // 给筛选表单绑定 submit 事件
    $('#form_select').on('submit', function (e) {
        e.preventDefault()
        // 获取表单选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 重新为查询参数赋值
        q.cate_id = cate_id
        q.state = state
        // 根据筛选条件，重新渲染数据
        getArtList()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页结构
        laypage.render({
            elem: 'page_box', // 分页容器的 id
            count: total,     // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum   // 设置默认选中的分页
        })
    }

})


