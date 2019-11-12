$(document).ready(function(){

	/*获取窗体宽高*/
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();

	/*通过JS垂直居中*/
	var loginHeigtHalf = 170;

	var windowHeightHalf = Math.ceil(windowHeight/2);
	if (windowHeightHalf>loginHeigtHalf){
		var domLogin_y = windowHeightHalf-loginHeigtHalf;
		$(".wrap-body").css("padding-top",domLogin_y+"px");
	}

	/*验证是否记住登陆（本地存储）*/

	var localStorageData = JSON.parse(localStorage.getItem('linfos'));

	if (localStorageData){

		var uName = localStorageData.uname;
		var uPwd = localStorageData.upwd;

		$("#uname").val(uName);
		$("#upwd").val(uPwd);
		$("input[name='remember']").prop('checked',true);
	} 


	/*更多操作*/
	function doesAfterSuccess(u,p){

		/*记住密码 本地存储*/
		var ischecked = $("input[name='remember']").prop('checked');
		if (!ischecked){

			//删除本地存储
			localStorage.removeItem('linfos');

		} else {

			const info ={
				uname:u,
				upwd:p
			}

			//创建本地存储
			localStorage.setItem('linfos', JSON.stringify(info));
		}

		//跳转到主页
		location.href="main.php?fromUrl=login.php&exe=home";

	}

});