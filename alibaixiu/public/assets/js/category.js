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