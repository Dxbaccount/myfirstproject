$(function () {
    let form = layui.form
    let layer = layui.layer

    // 调用渲染文章类别下拉框选项的方法
    renderArtCate()

    // 调用 initEditor() 初始化富文本编辑器
    initEditor()


    // 定义渲染文章类别的方法
    function renderArtCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return
                }
                // 调用模板引擎渲染文章分类选项
                let artCateHtmlStr = template('tpl_artCate', res)
                $('[name=cate_id]').html(artCateHtmlStr)
                form.render()
            }
        })
    }

    let $image = $('#image')

    // 裁剪区域的配置选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 初始化裁剪区域
    $image.cropper(options)

    // 给选择封面按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('.choose-file').click()
    })

    // 监听文件选择框的 change 事件
    $('.choose-file').on('change', function (e) {
        // 获取已选择的文件列表数组
        let files = e.target.files
        // 判断用户是否选择了问价 
        if (files.length === 0) {
            return
        }
        // 根据选择的文件,创建对应的 url 地址
        let imgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image.
        cropper('destroy')   // 销毁旧的裁剪区域
        .attr('src', imgURL)  // 重新设置图片路径
        .cropper(options)   // 重新初始化裁剪区域
    })


    // 定义文章的发布状态
    let art_state = '已发布'

    // 给存为草稿按钮绑定点击事件
    $('#btnSave2').click(function () {
        art_state = '草稿'
    })

    // 监听发布表单的提交事件
    $('#form_pub').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // console.log($(this).serialize())
        // 基于 form 表单快速创建一个 FormData 对象
        let fd = new FormData($(this)[0])
        // 将文章的发布状态存到 fd 中
        fd.append('state', art_state)
        
        // 将裁剪过后的图片,输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)

                // 发起 ajax 数据请求
                pubArt(fd)
            })
    })

    // 定义发表文章的方法
    function pubArt(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 发布文章成功后，跳转到文章列表页面
                window.parent.$('#article_list').click()
                location.href = '/article/art_list.html'
            }
        })
    }

})