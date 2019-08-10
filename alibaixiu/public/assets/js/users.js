var userArr = new Array();
$.ajax({
    type: 'get',
    url: '/users',
    success: function(res) {
        userArr = res;
        render(userArr);
    }
});

function render(arr) {
    var html = template('usersTpl', { list: arr });
    $('tbody').html(html);
}


// 添加用户功能 
$('button').on('click', function() {
    $.ajax({
        type: 'post',
        url: '/users',
        data: $('#userForm').serialize(),
        success: function(res) {
            userArr.push(res);
            render(userArr);
            $('#userForm > h2').text('添加用户');
            $('#userAdd').show();
            $('#userEdit').hide();
            $('#preview').attr('src', '../assets/img/default.png');
            $('#email').val('');
            $('#nickName').val('');
            $('#password').val('');
            $('#wjh').prop('checked', false);
            $('#jh').prop('checked', false);
            $('#admin').prop('checked', false);
            $("#normal").prop('checked', false);
        }
    });
});
// 当用户选择文件的时候
$('#avatar').on('change', function() {
    // console.log(this.files[0])
    var formData = new FormData();
    formData.append('avatar', this.files[0]);
    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        // 告诉$.ajax方法不要解析请求参数
        processData: false,
        // 告诉$.ajax方法不要设置请求参数的类型
        contentType: false,
        success: function(response) {
            // console.log(response)
            // 实现头像预览功能
            $('#preview').attr('src', response[0].avatar);
            // 将图片的地址添加到表单里面的隐藏域
            $('#hiddenAvatar').val(response[0].avatar)
        }
    })
})
var userId;
// 编辑用户功能 
$('tbody').on('click', '.edit', function() {
    userId = $(this).parent().attr('data-id');
    $('#userForm > h2').text('修改用户');

    // 先获取 当前被点击这个元素的祖先 叫tr 
    var trObj = $(this).parents('tr');
    // 获取图片的地址
    var imgSrc = trObj.children(1).children('img').attr('src');
    // 将图片的地址写入到隐藏域 
    $('#hiddenAvatar').val(imgSrc);
    // 如果imgSrc有值 我们
    if (imgSrc) {
        $('#preview').attr('src', imgSrc);
    } else {
        $('#preview').attr('src', '../assets/img/default.png');
    }
    // 将对应的内容写入到左边的输入框里面
    $('#email').val(trObj.children().eq(2).text());
    $('#nickName').val(trObj.children().eq(3).text());
    var status = trObj.children().eq(4).text();
    if (status == '激活') {
        $('#jh').prop('checked', true);
    } else {
        $('#wjh').prop('checked', true);
    }
    var role = trObj.children().eq(5).text();
    if (role == '超级管理员') {
        $('#admin').prop('checked', true);
    } else {
        $('#normal').prop('checked', true);
    }
    // 当我们点击编辑按钮时 将添加按钮隐藏 同时将修改按钮 显示出来 
    $('#userAdd').hide();
    $('#userEdit').show();
})

$('#userEdit').on('click', function() {
        //console.log($('#userForm').serialize());
        // 我们需要发送ajax给服务器时 需要传递Id 
        $.ajax({
            type: 'put',
            url: '/users/' + userId,
            data: $('#userForm').serialize(),
            success: function(res) {
                // 我们只是将数据库里面的数据给修改 但是我们将userArr这个数组里面的元素给修改
                // 我们要从userArr这个数组中 将要修改这个数组元素找出来 
                var index = userArr.findIndex(item => item._id == userId);
                // 根据这个index找到数组的这个元素 将它的数据更新 
                userArr[index] = res;
                // 调用render方法 重新渲染页面 
                render(userArr);
                $('#userForm > h2').text('添加用户');
                $('#userAdd').show();
                $('#userEdit').hide();
                $('#preview').attr('src', '../assets/img/default.png');
                $('#email').val('');
                $('#nickName').val('');
                $('#password').val('');
                $('#wjh').prop('checked', false);
                $('#jh').prop('checked', false);
                $('#admin').prop('checked', false);
                $("#normal").prop('checked', false);
            }
        })
    })
    //删除功能
$('tbody').on('click', '.del', function() {
        if (confirm('确定要删除吗')) {
            var id = $(this).parent().attr('data-id');
            $.ajax({
                type: 'delete',
                url: '/users/' + id,
                success: function(res) {
                    var index = userArr.findIndex(item => item._id == id);
                    userArr.splice(index, 1);
                    render(userArr);
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
                var id = v.parentNode.parentNode.children[6].getAttribute('data-id');
                ids.push(id);
            })
            // 发送ajax
        $.ajax({
            type: 'delete',
            url: '/users/' + ids.join('-'),
            success: function(res) {
                // res是这一个数组 数组里面放的被删除的元素 元素是一个对象 
                res.forEach(e => {
                    var index = userArr.findIndex(item => item._id == e._id);
                    // 调用splice()
                    userArr.splice(index, 1);
                    render(userArr);
                })
            }
        })
    }
})