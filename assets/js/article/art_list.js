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
        //执行一个laypage实例
        laypage.render({
            elem: 'page_box', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum,  // 设置被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 切换页码时，触发 jump 回调函数
            // 触发 jump 回调的方式有两种
            // 1. 切换页码或每页显示的数据条数时触发
            // 2. 调用 laypage.render() 方法时触发
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 根据更改过后的查询参数，重新获取文章数据，并渲染到页面

                // 可以通过 first 的值， 判断是哪种方式触发的 jump 回调
                // 如果通过 1 触发，first 的值为 undifined
                // 如果通过 2 触发，first 的值为 true
                if (!first) {
                    getArtList()
                }
            }
        })
    }

    // 通过代理的形式，给删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        let len = $('.btn-delete').length
        // 获取要删除的文章 id
        let id = $(this).attr('data-id')
        // 询问是否确认删除
        layer.confirm('是否确认删除？', { icon: 3, title: '删除文章' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功！')
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    getArtList()
                }
            })

            layer.close(index)
        })
    })

})

