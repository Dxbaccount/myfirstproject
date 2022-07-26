$(function () {
    let layer = layui.layer
    let form = layui.form


    // 调用这个函数，获取文章分类列表数据，并渲染到页面
    getArtcateList()

    // 给添加类别按钮绑定点击事件
    let indexAdd = null
    $('#btnAddCate').click(function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加类别',
            content: $('#dialog_add').html()
        }) 

    })

    /* 添加文章分类 */
    // 通过事件位委托的方式，给 add_form 表单绑定 submit  事件
    $('body').on('submit', '#add_form', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                // 重新获取文章分类列表数据，并渲染到页面
                getArtcateList()
                layer.msg(res.message)
                // 关闭对话框
                layer.close(indexAdd)
            }
        })
    })

    // 修改文章分类
    // 通过事件委托给 btn-edit 按钮，绑定点击事件
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '编辑文章类别',
            area: ['500px', '250px'],
            content: $('#dialog_edit').html()
        })

    
        let id = $(this).attr('data-id')
        // 根据 id 获取对应类别的数据
        $.ajax({
            mehtod: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('edit-form', res.data)
            }
        })
    })

})

// 获取文章分类列表
function getArtcateList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            let htmlStr = template('tpl_table', res)
            $('tbody').html(htmlStr)
        }
    })
}

