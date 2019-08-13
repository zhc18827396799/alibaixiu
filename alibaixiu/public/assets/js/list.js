// 获取地址栏中的categoryId参数
var categoryId = getUrlParams('categoryId');

// 根据分类id获取文章列表
$.ajax({
    type: 'get',
    url: '/posts/category/' + categoryId,
    success: function(res) {
        console.log(res)
        var html = template('listTpl', { data: res });
        $('#listBox').html(html);
    }
});