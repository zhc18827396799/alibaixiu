  // 先发送ajax请求将所有的分类取出来 通过模板引擎渲染到页面
  // 向服务器端发送请求 获取文章分类数据
  $.ajax({
          url: '/categories',
          type: 'get',
          success: function(res) {
              var html = template('categoryTpl', {
                  data: res
              })
              $('#category').html(html);
          }
      })
      //   上传图片
  $('#feature').on('change', function() {
      var fileData = this.files[0];
      // 图片是二进制数据 ajax它本身不支持二进制数据上传
      var formData = new FormData();
      formData.append('file', fileData);
      //发送ajax
      $.ajax({
          type: 'post',
          url: '/upload',
          data: formData,
          processData: false,
          contentType: false,
          success: function(res) {
              // 将数据保存到隐藏域 是为了将数据添加到集合中  隐藏域是一个表单标签 
              //  console.log(res);
              $('#thumbnail').val(res[0].file);
              // 当我们文件上传成功后 在客户端将其预览出来
              $('#prev').attr('src', res[0].file).show();
          }
      })
  });

  //添加文章功能
  $('#pAdd').on('click', function() {
      //   console.log($('#pForm').serialize());
      $.ajax({
          type: 'post',
          url: '/posts',
          data: $('#pForm').serialize(),
          success: function(res) {
              // 需要跳转到展示文章的列表页
              location.href = "/admin/posts.html";
              //   console.log(res);
          },
          error: function(err) {
              console.log(err);
          }
      })
  })