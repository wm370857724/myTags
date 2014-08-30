(function($) {
	$.fn.myTags = function(options){
		var setting = $.extend({
			hide : true,
			colorful : true,
			keywordStringLength : 0,	//关键词长度，0为不限制
			keywordLength : 9,			//关键词个数，默认为9个
			callIn : null				//要传入执行的函数
		},options);

		var isColorful = (setting.colorful) ? 'tagsColorful ' : 'tagsNoColor ';
		var tagsList = ($(this).val() != '') ? $(this).val().toString().split(',') : [];
		var oldTagsList = $(this).data('oldValue').toString().split(',');
		var tagsToSpan = '';
		var oldTagsToSpan = '';
		var chosenTagsNullAlert = ($(this).attr('placeholder')) ? $(this).attr('placeholder') : '请填写标签';
		
		$('<div class="tagsEditWrap"></div>').insertBefore(this);
		$('.tagsEditWrap').append(function(){
			return '<div class="'+ isColorful +'tagsChosen"></div><div class="'+ isColorful +'tagsAddArea"><div class="tagsAddInput"><input type="text" id="tagsAddInput" /><b class="tagsAddBtn">+</b></div><label></label></div>';
		});

		if(setting.hide){
			$(this).hide();
		}

		var alertShake = function(){
			$('.tagsAddArea label').animate({left:'4px'},20);
			$('.tagsAddArea label').animate({left:'-4px'},40);
			$('.tagsAddArea label').animate({left:'4px'},40);
			$('.tagsAddArea label').animate({left:'-4px'},40);
			$('.tagsAddArea label').animate({left:'0px'},40);
		}

		var myInput = {
			spanArray : function(){
				var spanArrays = new Array;
				$('.tagsChosen span').each(function(){
                    spanArrays.push($(this).text());
                });
				return spanArrays;
			},
			isExist : function(value, array){
				return $.inArray(value, array);
			},
			input : {
				arrayOfInput : function(){
					var inputValueArray = ($('.myTags').val() != '') ? $('.myTags').val().toString().split(',') : [];
					return inputValueArray;
				},
				oldArrayOfInput : function(){
					var inputOldValueArray = ($('.myTags').data('oldValue') != '') ? $('.myTags').data('oldValue').toString().split(',') : [];
					return inputOldValueArray;
				},
				addToInput : function(val){
					var inputArray = myInput.input.arrayOfInput();
					if(myInput.isExist(val, inputArray) < 0){
						inputArray.push(val);
					}
					$('.myTags').val(inputArray.toString());
					$('.myTags').attr('value',inputArray.toString());
				},
				removeFromInput : function(val){
					var inputArray = myInput.input.arrayOfInput();
					var index = $.inArray(val, inputArray);
					inputArray.splice(index, 1);
					$('.myTags').val(inputArray.toString());
					$('.myTags').attr('value',inputArray.toString());
				}
			},
			addTags : function(e, o){
				if(myInput.isExist(e, myInput.spanArray()) < 0 || o == 'old'){
					if(e != ''){
						if($('.tagsChosen span').length < setting.keywordLength){
							if($('#tagsAddInput').val().length > (setting.keywordStringLength) && setting.keywordStringLength != 0){
								$('.tagsAddArea label').text('最多输入' + setting.keywordStringLength + '个字');
								alertShake();
							}else{
								$('.tagsChosen em').remove();
								$('<span>'+ e +'</span>').appendTo($('.tagsChosen')).click(function(){
									myInput.removeTags($(this));
								});
								myInput.input.addToInput(e);
								$('#tagsAddInput').val('');
								$('.myTags').focus();
								$('#tagsAddInput').focus();
								if(setting.callIn != null && o != 'old'){setting.callIn();}
							}
						}else{
							$('.tagsAddArea label').text('最多添加'+ setting.keywordLength +'个关键词');
							alertShake();
						}
					}else{
						$('.tagsAddInput input').attr('placeholder','请填写关键词');
					}
				}else{
					$('.tagsChosen span').each(function(){
                    	if($(this).text() == e){
							$(this).animate({left:'4px'},25);
							$(this).animate({left:'-6px'},25);
							$(this).animate({left:'2px'},25);
							$(this).animate({left:'-3px'},25);
							$(this).animate({left:'0px'},25);
						}
                    });
				}
			},
			removeTags : function(e){
				myInput.input.removeFromInput(e.text());
				e.remove();
				if($('.myTags').val() == ''){$('.tagsChosen').append('<em>'+chosenTagsNullAlert+'</em>');}
				if(setting.callIn != null){setting.callIn();}
			}
		}


		for(var i=0; i < tagsList.length; i++){
			tagsToSpan += '<span>'+ tagsList[i] +'</span>';
		}
		if($(this).data('oldValue') != ''){
			for(var i=0; i < oldTagsList.length; i++){
				myInput.addTags(oldTagsList[i],'old');
			}
		}else{
			$('.tagsChosen').append('<em>'+chosenTagsNullAlert+'</em>');
		}
		$(tagsToSpan).insertBefore('.tagsAddInput');
		$('.myTags').val('');
		$('.myTags').attr('value','');

		$('.tagsAddArea span').click(function(){
			myInput.addTags(this.textContent || this.innerText);
		});

		$('.tagsAddBtn').click(function(){
			inputValue = $.trim($(this).siblings('input').val());
			myInput.addTags(inputValue);
		});

		$('#tagsAddInput').bind('keydown',function(event){
			if(event.keyCode == '13'){
				inputValue = $.trim($(this).val());
				myInput.addTags(inputValue);
				return false;	//阻止回车键冒泡，比如回车触发form的submit事件
			}
		});

		$('#tagsAddInput').bind('keyup',function(event){
			if(event.keyCode != '13'){
				var text = $('#tagsAddInput').val();
				var len = $('#tagsAddInput').val().length;
				if(len > (setting.keywordStringLength) && setting.keywordStringLength > 0){
					$('.tagsAddArea label').text('最多输入' + setting.keywordStringLength + '个字');
					$('#tagsAddInput').val($('#tagsAddInput').val().substr(0,setting.keywordStringLength));
					alertShake();
				}else{
					$('.tagsAddArea label').text('');
				}
			}else{return false;}
		});

		$('.myTags').val(myInput.input.oldArrayOfInput().toString());
		$('.myTags').attr('value',myInput.input.oldArrayOfInput().toString());

	}
})(jQuery);