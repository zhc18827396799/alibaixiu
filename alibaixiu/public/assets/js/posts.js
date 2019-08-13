    // 获取到所有的分类 
    var c = $('#category').val();
    var s = $('#s').val();

    // 发送ajax将服务器给我们数据渲染到模板上面 
    function render(c = "all", s = "all", page = 1) {
        $.ajax({
            type: 'get',
            url: '/posts',
            data: {
                page: page || 1, //分页页码
                category: c, // 分类名称
                state: s // 状态 
            },
            success: function(res) {
                console.log(res);
                var html = template('pTpl', res)
                $('tbody').html(html);
                // 把当前页码赋值给window对象下面的下面属性叫currentPage
                window.currentPage = res.page
                var page = template('pageTpl', res);
                $('#page').html(page);
            }
        })
    }
    render();

    function formateDate(date) {
        // 将日期时间字符串转换成日期对象
        date = new Date(date);
        return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getDate().toString().padStart(2, 0)
    }
    // 分页
    function pageChange(page) {
        render(c, s, page);
    }
    // 取出所有的分类
    // 向服务器端发送请求 获取文章分类数据
    $.ajax({
        url: '/categories',
        type: 'get',
        success: function(response) {
            var html = template('categoryTpl', { data: response });
            $('#category').append(html);
        }
    })

    // 筛选
    $('#cSearch').on('click', function() {
        // 获取到分类id与状态 
        c = $('#category').val();
        s = $('#s').val();
        render(c, s);
    })

    $('tbody').on('click', '.del', function() {
        var id = $(this).attr('data-id');
        $.ajax({
            type: 'delete',
            url: '/posts/' + id,
            success: function(res) {
                // render(c,s,currentPage);
                // 如果tbody标签下面的有标签 这个时候我们就让它在当前页码 如果已经已经不大于1  我们应该它让回到前一页
                if ($('tbody').children().length > 1) {
                    // 如果当前页码已经是第一页了 我们就让它不跳转到前一页  
                    if (currentPage == 1) {
                        render(c, s, currentPage);
                    } else {
                        render(c, s, currentPage - 1);
                    }
                } else {
                    render(c, s, currentPage - 1);
                }
            }
        })
    })