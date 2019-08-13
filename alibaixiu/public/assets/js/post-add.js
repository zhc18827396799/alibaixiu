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
      // 定义一个函数 就是用于根据id获取其
      // 获取浏览器地址栏中的id参数
  function getUrlParams(name) {
      var paramsAry = location.search.substr(1).split('&');
      // 循环数据
      for (var i = 0; i < paramsAry.length; i++) {
          var tmp = paramsAry[i].split('=');
          if (tmp[0] == name) {
              return tmp[1];
          }
      }
      return -1;
  }
  var id = getUrlParams('id');

  // 修改功能 
  if (id != -1) {
      $.ajax({
          type: 'get',
          url: '/posts/' + id,
          success: function(res) {
              $('#pEdit').show();
              $('#pAdd').hide();
              // 将标题 内容 时间显示出来 
              $('#title').val(res.title);
              $('#content').val(res.content);
              // $('#created').attr('type', 'date');
              $('#created').val(res.createAt && res.createAt.substr(0, 16));
              // 获取#category下面所有的option
              var coption = $('#category> option');
              coption.each(function(index, item) {
                  // 我们需要将item这个对象转换为jQuery
                  //console.log($(item).attr("value"),res.category)
                  if ($(item).attr("value") == res.category) {
                      $(item).prop('selected', true);
                  }
              })

              var soption = $('#status > option');
              soption.each(function(index, item) {
                  // 我们需要将item这个对象转换为jQuery
                  //console.log($(item).attr("value"),res.category)
                  if ($(item).attr("value") == res.state) {
                      $(item).prop('selected', true);
                  }
              });
              // 将图片的地址设置到隐藏域
              $("#thumbnail").val(res.thumbnail);
              // 将图片显示出来 
              $("#prev").show().attr("src", res.thumbnail);
          }
      })
  }

  // 给修改按钮添加点击事件 
  $("#pEdit").on('click', function() {
      // 获取到表单里面的内容 
      var formData = $('#pForm').serialize();
      // 开始发送ajax
      $.ajax({
          type: 'put',
          url: '/posts/' + id,
          data: formData,
          success: function(res) {
              location.href = "/admin/posts.html";
          }
      })
  })