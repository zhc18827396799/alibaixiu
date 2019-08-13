var cArr = new Array();
// 展示分类
$.ajax({
        type: 'get',
        url: '/categories',
        success: function(res) {
            cArr = res;
            render(cArr);
        }
    })
    // 添加分类功能
$('#cAdd').on('click', function() {
    $.ajax({
        type: 'post',
        url: '/categories',
        data: $('#cForm').serialize(),
        success: function(res) {
            cArr.push(res);
            render(cArr);
        }
    })
})

function render(arr) {
    var str = template('cTpl', {
        list: arr
    })
    $('tbody').html(str);
}

var cId;
//修改
$('tbody').on('click', '.edit', function() {

    cId = $(this).parent().attr('data-id');
    $('#cForm>h2').text('修改分类');
    var title = $(this).parents('tr').children().eq(1).text();
    var className = $(this).parents('tr').children().eq(2).text();
    $('#title').val(title);
    $('#className').val(className);
    $("#cAdd").hide();
    $('#cEdit').show();
})

$('#cEdit').on('click', function() {
        $.ajax({
            type: 'put',
            url: '/categories/' + cId,
            data: $('#cForm').serialize(),
            success: function(res) {
                var index = cArr.findIndex(item => item._id = cId);
                // 根据这个index找到数组的这个元素 将它的数据更新 
                cArr[index] = res;
                render(cArr);
                $('#title').val('');
                $('#className').val('');
                $('#cAdd').show();
                $('#cEdit').hide();

            }
        })
    })
    //删除
$('tbody').on('click', '.del', function() {
    if (confirm('确定要删除吗')) {
        var id = $(this).parent().attr('data-id');
        $.ajax({
            type: 'delete',
            url: '/categories/' + id,
            success: function(res) {
                var index = cArr.findIndex(item => item._id == id);
                cArr.splice(index, 1);
                render(cArr);
            }
        })
    }
})

//全选按钮
$('thead input').on('change', function() {
        var status = $(this).prop('checked');
        $('tbody input').prop('checked', status);
        //如果全选按钮被选中  显示批量删除按钮
        if (status) {
            $('.btn-sm').show();
        } else {
            $('.btn-sm').hide();
        }
    })
    //下面的按钮
$('tbody').on('change', 'input', function() {
    if ($('tbody input').length == $('tbody input:checked').length) {
        $('thead input').prop('checked', true);
    } else {
        $('thead input').prop('checked', false);
    }
    // 如果被选中的按钮大于1  显示批量删除按钮
    if ($('tbody input:checked').length > 1) {
        $('.btn-sm').show();
    } else {
        $('.btn-sm').hide();
    }
})
$('.btn-sm').on('click', function() {
    if (confirm('真的要删除吗?')) {
        var ids = [];
        // 想要获取被选中的元素的id属性值 
        var checkUser = $('tbody input:checked');
        checkUser.each(function(k, v) {
            var id = v.parentNode.parentNode.children[3].getAttribute('data-id');
            ids.push(id);
        })
        console.log(ids);
        // 发送ajax
        $.ajax({
            type: 'delete',
            url: '/categories/' + ids.join('-'),
            success: function(res) {
                // res是这一个数组 数组里面放的被删除的元素 元素是一个对象 
                res.forEach(e => {
                    var index = cArr.findIndex(item => item._id == e._id);
                    // 调用splice()
                    cArr.splice(index, 1);
                    render(cArr);
                })
            }
        })
    }
})