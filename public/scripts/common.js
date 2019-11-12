$(document).ready(function(){

	$(".vieworders").click(function(){
		layer.open({
		  type: 2,
		  title: '全部排期预览',
		  shadeClose: true,
		  shade: 0.8,
		  area: ['380px', '64%'],
		  content: 'calendar/index.php' //iframe的url
		}); 
	})

	//修改注册资料
	$(".submitBtnj").click(function(){

		var username = $("#username").val().trim();
		var password = $("#password").val().trim();
		var confirmpwd = $("#confirmpwd").val().trim();
		var pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
		var pattern2 = /^[a-zA-Z0-9_]{6,12}$/;

		if (username && !pattern.test(username)){
			$("#username").next().html('！');
		} else {
			$("#username").next().html('');
		}
		
		if (!pattern2.test(password)){
			$("#password").next().html('！');
		} else {
			$("#password").next().html('');
		}

		if (!confirmpwd || password != confirmpwd){
			$("#confirmpwd").next().html('！');
		} else {
			$("#confirmpwd").next().html('');
		}

		if (!$("#username").next().text() && !$("#password").next().text() && !$("#confirmpwd").next().text()){
			$.ajax({
				url:'ajax_reset.php',
				type:'post',
				data:{'pwd':password,'cpwd':confirmpwd,'uname':username},
				dataType:'text',
				beforeSend:function(){

				},
				success:function(data){
					if (data == 'success'){
						layer.msg('修改成功，请重新登录！');
						setTimeout(function(){
							location.href="login.php";
						},3000);
					} else {
						layer.msg(data);
					}	
				},
				error:function(XHR,status,error){

				}
			})
		}

	})
})