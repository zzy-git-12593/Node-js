
$(document).ready(function(){

	//实例化UE对象
	var ue = UE.getEditor('myeditor');

	//封装AJAX
	var getDataByAjax = function(url,type,datatype,data,fn){

		$.ajax({

			url:url,
			type:type,
			data:data,
			dataType:datatype,
			beforeSend:function(){

			},
			success:function(data){
				fn(data);
			},
			error:function(XHR,status,e){
				console.log(e);
			}
		})
	}

	//处理后端返回的数据
	var dealResult = function(data){

		if (data == 'success'){
			alert('消息已经发送');
		} else {
			alert(data);
		}
		
		$(document).scrollTop(0);
		
		// setTimeout(function(){
		// 	location.reload();
		// },1000);
		
	}

	//消息提示
	var messageShow = function(msg,obj='',tag='',direction=''){

		var dom = '';

		if (msg){

			if (tag){
				dom = '<'+tag+'>'+msg+'</'+tag+'>';
			} else {
				dom = msg;
			}

			if (direction && obj){

				obj.direction(dom);

			} else {
				alert(dom);
			}

		}
		
	}

	/*表单日期*/
	$("#joinDate,#joinDate1,#joinDate2").click(function(){
	    WdatePicker({
	        highLineWeekDay:true //周末高亮
	        ,readOnly:true      //只读，只可用控件input中 修改内容
	        ,dateFmt:'yyyy-MM-dd'
	    });
	});
	
	/*点击预约成功*/
	$("input[type='radio']:first").click(function(){
		$(".selectDate").show();
	})
	$("input[type='radio']:gt(0)").click(function(){
		$(".selectDate").hide();
		$("#joinDate").val('');
	})

	//表单验证
	$("#viewform").submit(function(){

		var radio = $("input[type='radio']:checked").val();
		var body = ue.getContent();
		var date = $("#joinDate").val();
		var pgdcode = $("#pgdcode").text();
		var email = $("#email_address").text();

		if (!radio || radio == 'undefined'){
			alert('请选择操作标题!');
			return false;
		}

		if (radio == 'success' && !date) {
			alert('请选择预约日期!');
			return false;
		}

		// AJAX
		var sendData = {'sname':radio,'datestr':date,'content':body,'code':pgdcode,'email':email};
		getDataByAjax('ajax_add_reply.php','post','text',sendData,dealResult);

		return false;
	});

	//使用ajax自动更新对话记录信息
	setInterval(function(){

		var pgdcode = $("#pgdcode").text();
		$(".message-body").load('fetchListData.php',{'pgd':pgdcode,'page':1});

	},3000);

})
