  // 找到id=login这个标签给其注册点击事件 
  $('#login').on('click', function() {
      // 获取输入框的内容
      var email = $('#email').val();
      var password = $('#password').val();
      // 需要对输入框里面的内容进行验证  建议使用正则表达式 
      // itheima@itcast.cn
      var emailReg = /\w+[@]\w+[.]\w+/
      if (!emailReg.test(email)) {
          $('.alert').fadeIn(1000).delay(2000).fadeOut(1000);
          $('#msg').text('邮箱地址不合法');
          return;
      }
      var pwdReg = /\w{4,18}/;
      if (!pwdReg.test(password)) {
          $('.alert').fadeIn(1000).delay(2000).fadeOut(1000);
          $('#msg').text('密码不合法');
          return;
      }
      // 发送ajax
      $.ajax({
          type: 'post',
          url: '/login',
          data: {
              email: email,
              password: password
          },
          success: function(res) {
              // console.log();
              location.href = 'index.html';
          },
          error: function() {
              $('.alert').fadeIn(1000).delay(2000).fadeOut(1000);
              $('#msg').text('邮箱地址或者密码输入错误');
          }
      })
  });