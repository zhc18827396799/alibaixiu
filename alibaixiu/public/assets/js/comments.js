var commentsArr = new Array();

function render(arr) {
    var html = template('commentsTpl', arr)
    $('#commentsBox').html(html);
}

// 向服务器端发送请求 获取评论列表数据
$.ajax({
    type: 'get',
    url: '/comments',
    success: function(res) {
        // console.log(res.display);
        window.commentsPage = res.page;
        commentsArr = res;
        render(commentsArr);
        var pageHTML = template('pageTpl', res);
        $('#pageBox').html(pageHTML)
    }
})

// 实现分页
function changePage(page) {
    $.ajax({
        type: 'get',
        url: '/comments',
        data: {
            page: page
        },
        success: function(res) {
            // console.log(res)
            var html = template('commentsTpl', res);
            $('#commentsBox').html(html);
            var pageHTML = template('pageTpl', res);
            $('#pageBox').html(pageHTML)
        }
    })
}

// 当审核按钮被点击的时候
$('#commentsBox').on('click', '.status', function() {
        // 获取当前评论的状态
        var status = $(this).attr('data-status');
        // 获取当前要修改的评论id
        var id = $(this).attr('data-id');
        $.ajax({
            type: 'put',
            url: '/comments/' + id,
            data: {
                state: status == 0 ? 1 : 0
            },
            success: function(res) {
                // console.log(commentsArr);
                // console.log(res);
                var obj = commentsArr.records.find(item => item._id = res._id);
                obj.state = res.state;
                render(commentsArr);
            }
        })
    })
    // 当删除按钮被点击时
$('#commentsBox').on('click', '.delete', function() {
    if (confirm('您确定要删除吗')) {
        // 获取管理员要删除的评论的id
        var id = $(this).attr('data-id');
        $.ajax({
            type: 'delete',
            url: '/comments/' + id,
            success: function(res) {
                var index = commentsArr.records.findIndex(item => item._id = res._id);
                commentsArr.records.splice(index, 1);
                render(commentsArr);
                if ($('#pageBox').children().length > 1) {
                    // 如果当前页码已经是第一页了 我们就让它不跳转到前一页
                    if (commentsPage == 1) {
                        changePage(commentsPage);
                    } else {
                        changePage(commentsPage - 1);
                    }
                } else {
                    changePage(commentsPage - 1);
                }
            }
        })
    }
})