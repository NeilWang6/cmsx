/**
 * @package FE.app.elf.tag.addtask
 * @author: shanshan.hongss
 * @Date: 2012-08-24
 */

;(function($, E){
	var dialogMemberSetting;
    var domain = location.protocol + '//' + location.host,
        readyFun = [
        //��������ѡ��
        function(){
            var mate = {'p':'.info-common', 's':'.info-spot'},
                allEls = $('.info-common').add('.info-spot'),
                configSelect = $('#info-config');
                mateShowInfo(configSelect.val(), mate, allEls);
                configSelect.change(function(e){
	                var el = $(this);
	                mateShowInfo(el.val(), mate, allEls);
            	});
			
			/**
			$('.member-dialog .btn-cancel, .member-dialog .close').click(function(){
				//�رյĻ�����reset����Ȼ�󿽱���ȥ
				$('#member-dialog .js-member-dialog-form').reset();

				var memberData = $('#js-member-dialog-section .member-dialog-data');
				$('#member-dialog-data-father').append(memberData);
				
				dialogMemberSetting.dialog('close');
			});
			
			$('.member-dialog .js-save').click(function(){
				//����Ļ���form���ݿ�����ȥ
				var memberData = $('#js-member-dialog-section .member-dialog-data');
				$('#member-dialog-data-father').append(memberData);
				
				//���Ҹ���һ�����������´λ�ԭ��
				memberData.clone()
				
				dialogMemberSetting.dialog('close');
			});
			
			$('.js-set-member-dialog-data').click(function(e){
				//���ݿ����������form���棬Ȼ��ԭ���Ĵ������
				var memberData = $('#member-dialog-data-child');
				$('#member-dialog .js-member-dialog-section').append(memberData);
				
                $.use('ui-dialog', function(){
					dialogMemberSetting = $('.member-dialog').dialog({
						center: true,
						fixed:false
					});
				});
            });
			*/
        },
        //��ȡ��Ŀ����
        function(){
            var categoryId = 0,
                category1 = $('#category-first'),
                category2 = $('#category-second'),
                profession = $('#profession');
            
            requetCategoryId(categoryId, function(data){
                var html = '', pfHtml = '';
                for (var i=0, l=data.length; i<l; i++){
                    html += '<option value="'+data[i].id+'-1">'+data[i].categoryName+'</option>';
                    pfHtml += '<option value="'+data[i].id+'">'+data[i].categoryName+'</option>';
                }
                category1.html(html);
                profession.html('<option value="">��ѡ��������ҵ</option>'+pfHtml);
                
                //ѡ�����е���ҵ
                profession.val(profession.data('val'));
            });
            
            category1.change(function(e){
                var el = $(this),
                    val = el.val().split('-')[0];
               
                requetCategoryId(val, function(data){
                    var html = '';
                    for (var i=0, l=data.length; i<l; i++){
                        html += '<option value="'+data[i].id+'-2-'+val+'">'+data[i].categoryName+'</option>';
                    }
                    category2.html(html);
                });
            });
           
            //modify by wxj 2012.11.20
            categoryDefault();
            
            //Ĭ����Ŀѡ������
            new E.MultiplePca({
                chooseBtns: {'1':{'btn':'#btn-cate-1st', 'select':'#category-first'}, 
                             '2':{'btn':'#btn-cate-2nd', 'select':'#category-second'}},
                resultSel: '#category-result',
                delBtn: '#btn-cate-del',
                afterDel: function(el){
                	    		index=0,
                	    		options = $('option', $("#category-result")),
                	   	 		suppyIndex=0,
                	   	 		categoryId=0,
                	    		orderIndex=0;
				                 	 for (var i=0, l=options.length; i<l; i++){
							                if ('2-1'===options[i].value){
							                     index++;
							                }
							                if ('2'===options[i].value.split('-')[2]){
							                     index++;
							                }
							                if ('4-1'===options[i].value){
							                     suppyIndex++;
							                }
							                if ('4'===options[i].value.split('-')[2]){
							                     suppyIndex++;
							                     orderIndex++;
							                     categoryId = options[i].value.split('-')[0];
							                }
				            			 }
				            			 if(index === 0){
				            			 	 $("#productArea").hide();
				            			 	 $("#origin_area").val('');
				            			 }
				            			 if(suppyIndex === 0){
				            			 	 $("#supplyType").hide();
				            			 	 $("#offer_supply_type").val('');
				            			 }
				            			 if(orderIndex === 0){
					            			 	 $('.order_div').each(function(index) {
						            			 	 	if(index===0){
						            			 	 			 $(this).find('.small').val('');
						            			 	 			 $(this).find('.orderSelect').val('less');
						            			 	 			 $(this).find('.unit').empty();
						            			 	 	}else{
						            			 	 		   $(this).remove();
						            			 	 	}
						            			 	 	$('#hid_order').val('');
					            			 	 	});
				            			 	    $("#orderNum").hide();
				            			 }
				            			 if(orderIndex === 1  && el.val().indexOf('-2-4')>0){
					            			 	getUnitByCategoryId(categoryId, function(data){
										              var html = '';
										                for (var i=0, l=data.length; i<l; i++){
										                    html += '<option value="'+data[i]+'">'+data[i]+'</option>';
										                }				
									                  $('.unitSelect').each(function(index) {
									                  	$(this).empty();
									                  	$(this).append(html);
									                  });
									            });
									             $("#orderNum").show();	
				            			 }
                },
                afterAdd: function(val,el){
                	var indexs=0,
                	    options = $('option', $("#category-result")),
                	    categoryId =0;
                	    
		                	if(!el.html()){
		                		return;
		                  }
		                  //���ڵ���ʾ
                		  if ('2-1'===el.val() || '2'===el.val().split('-')[2]){
			                     $("#productArea").show();			                     
 			                }
 			                //��С������ʾ
 			                if ('4-1'===el.val() || '4'===el.val().split('-')[2] ){
			                     $("#supplyType").show();	
			                     for (var i=0, l=options.length; i<l; i++){
							                if ('4'===options[i].value.split('-')[2]){
							                	  categoryId = options[i].value.split('-')[0];
							                    indexs++;
							                }
            			 				 }
             			 				 //��Ӷ�����Ŀ��֯Ƥ�� Ϊһ��ʱ��ʾ��С���� �������϶�ȥ��
	            			 				 if(indexs===1){
	            			 				 	  getUnitByCategoryId(categoryId, function(data){
									              var html = '';
									                for (var i=0, l=data.length; i<l; i++){
									                    html += '<option value="'+data[i]+'">'+data[i]+'</option>';
									                }				
								                  $('.unitSelect').each(function(index) {
								                  	$(this).empty();
								                  	$(this).append(html);
								                  });
								                });
								                 $("#orderNum").show();	
	            			 				 }else{
	            			 				 	 $('.order_div').each(function(index) {
						            			 	 	if(index===0){
						            			 	 			 $(this).find('.small').val('');
						            			 	 			 $(this).find('.orderSelect').val('less');
						            			 	 			 $(this).find('.unit').empty();
						            			 	 	}else{
						            			 	 		   $(this).remove();
						            			 	 	}
						            			 	 	$('#hid_order').val('');
						            			 	 	$("#orderNum").hide();	
			            			 	 			});
            			 				   }
 			                }
                }
            });
            //��С������������
            $('#orderNum').delegate('a','click',function(event){
               event.preventDefault();
            	 var order_htm= '<div class="order_div">'+ $(this).closest('.order_div').html(),
                   order_size = $('.order_div').size(),
                   flag = $(this).data('flag');
                  if(flag === 'remove'){
                  		$(this).closest('.order_div').remove();
                  		return;
                  }
                
                 if(order_htm.indexOf('data-flag="remove"')>0){
                  		 order_htm +='  </div>';
                  	}else{
                  		 order_htm +='  <a href="#" data-flag="remove">�Ƴ�</a> </div>';
                  	}
                  $(this).closest('.order_div').after(order_htm);
    								 
            });
        },
        //end by

        //��ȡ��Ӫ��ҵ
        function(){
            var categoryId = 0,
                category1 = $('#industry-first'),
                category2 = $('#industry-second');
            
            requetCategoryId(categoryId, function(data){
                var html = '', pfHtml = '';
                for (var i=0, l=data.length; i<l; i++){
                    html += '<option value="'+data[i].id+'-1">'+data[i].categoryName+'</option>';
                    pfHtml += '<option value="'+data[i].id+'">'+data[i].categoryName+'</option>';
                }
                category1.html(html);
            });
            
            category1.change(function(e){
                var el = $(this),
                    val = el.val().split('-')[0];
                
                requetCategoryId(val, function(data){
                    var html = '';
                    for (var i=0, l=data.length; i<l; i++){
                        html += '<option value="'+data[i].id+'-2">'+data[i].categoryName+'</option>';
                    }
                    category2.html(html);
                });
            });
            
            var cate1st = $('#industry1-value'),
                cate2nd = $('#industry2-value');
            
            new E.MultiplePca({
                chooseBtns: {'1':{'btn':'#btn-industry-1st', 'select':'#industry-first'}, 
                             '2':{'btn':'#btn-industry-2nd', 'select':'#industry-second'}},
                resultSel: '#industry-result',
                delBtn: '#btn-industry-del'
            });
        },
        //�Ƿ����ͨ
        function(){
            $('#js-is-tp').change(function(){
                var el=$(this);
                var tpTypeLabel=$('#js-tp-type');
                var tpType=$('#js-tp-type select');
                if('Y' === el.val()){
                    tpTypeLabel.show();
                }else{
                    tpTypeLabel.hide();
                    tpType.val('');
                }
            });

        },
				
				

        //��ȡʡ�ݡ���������
        function(){
            $.ajax({
                url: domain + '/tools/get_city_by_province.json',
                dataType: 'jsonp',
                success: function(o){
                    var province = o.province,
                        city = o.city,
                        county = o.county,
                        provinceEl = $('#province'),
                        cityEl = $('#city'),
                        countyEl = $('#county'),
                        provinceHtml = '',
                        isExist = countyEl.length;
                    for (var i=0, l=province.length; i<l; i++){
                        provinceHtml += '<option value="'+province[i].id+'">'+province[i].name+'</option>';
                    }
                    provinceEl.html(provinceHtml);
            
                    provinceEl.change(function(e){
                        var val = $(this).val(),
                            cityHtml = '';
                        for (var i=0, l=city.length; i<l; i++){
                            if (val==city[i].parentId){
                                cityHtml += '<option value="'+city[i].id+'">'+city[i].name+'</option>';
                            }
                        }
                        cityEl.html(cityHtml);
                    });
                    
                    if(isExist>0){
	                    //��������¼�
	                     cityEl.change(function(e){
	                        var val = $(this).val(),
	                            countyHtml = '';
	                        for (var i=0, l=county.length; i<l; i++){
	                            if (val==county[i].parentId){
	                                countyHtml += '<option value="'+county[i].id+'">'+county[i].name+'</option>';
	                            }
	                        }
	                        countyEl.html(countyHtml);
	                    });
                    }
                    
                    //��ʼ���޸�ʱ����ѡ����
                    var cityVals = $('#city-value').val().split(','),
                        flag = 0,
                        valHtml = '';
                        
                    for (var j=0, len=cityVals.length; j<len; j++){
                    	  flag = 0;
                        for (var i=0, l=province.length; i<l; i++){
                            if (cityVals[j]==province[i].id){
                                valHtml += '<option value="'+province[i].id+'">'+province[i].name+'</option>';
                                flag =1;
                                break;
                            }
                        }
                        if(flag==1){
                        	continue;
                        }
                        for (var i=0, l=city.length; i<l; i++){
                            if (cityVals[j]==city[i].id){
                                valHtml += '<option value="'+city[i].id+'">'+city[i].name+'</option>';
                                 flag =1;
                                 break;
                            }
                        }
                        if(flag==1){
                        	continue;
                        }
                        for (var i=0, l=county.length; i<l; i++){
                            if (cityVals[j]==county[i].id){
                                valHtml += '<option value="'+county[i].id+'">'+county[i].name+'</option>';
                                 break;
                            }
                        }
                    }
                    $('#city-result').html(valHtml);
                    if(isExist>0){
						            new E.MultiplePca({
						                chooseBtns: {'1':{'btn':'#btn-province', 'select':'#province'},
						                						'2':{'btn':'#btn-city', 'select':'#city'},
						                						'3':{'btn':'#btn-county', 'select':'#county'}},
						                resultSel: '#city-result',
						                delBtn: '#btn-city-del'
						            });
					          }else{
					          	 new E.MultiplePca({
				                chooseBtns: {'1':{'btn':'#btn-city', 'select':'#city'}},
				                resultSel: '#city-result',
				                delBtn: '#btn-city-del'
				            	 });
					          }
				        }
                
            });
             
        },
        //ע��ʱ��ؼ�
        function(){
            var timeEl = $('#online-time');
            $.use('ui-datepicker, util-date', function(){
                timeEl.datepicker({
                    closable: true,
                    triggerType: 'focus',
                    maxDate: new Date(),
                    select: function(e, ui){
                        $(this).val(ui.date.format('yyyy-MM-dd'));
                    }
                });
                $('.datepicker').datepicker({
                    closable: true,
                    triggerType: 'focus',
                    maxDate: new Date(),
                    select: function(e, ui){
                        $(this).val(ui.date.format('yyyy-MM-dd'));
                    }
                });
            });
            
            $('#clear-gmt-trial').click(function(e){
                $('input[name=gmt_trial_beg]').val('');
                $('input[name=gmt_trial_end]').val('');
            });
            $('#del-time').click(function(e){
                timeEl.val('');
            });
        },
        //����֤
        function(){
            var validEls = $('.form-container .need-valid'),
                formValid;
            $.use('web-valid', function(){
                formValid = new FE.ui.Valid(validEls, {
                    onValid: function(res, o){
                        var tip = $(this).nextAll('.validator-tip'), msg;
                        if (tip.length>1){
                            for (var i=0, l=tip.length-1; i<l; i++){
                                tip.eq(i).remove();
                            }
                        }
                        if (res==='pass') {
                            tip.removeClass('validator-error');
                        } else {
							switch (res){
                                case 'required':
                                    msg = o.key+' ����Ϊ��';
                                    break;
                                case 'float' :
                                case 'int' :
                                    msg = '��������ȷ������';
                                    break;
								case 'max' :
									msg = o.key+'��󳤶Ȳ��ܴ���'+o.max;
                                    break;
                                case 'min' :
                                    msg = '���������0������';
                                    break;
                                case 'fun' :
                                    msg = o.msg;
                                    break;
                                default:
                                    msg = '����д��ȷ������';
                                    break;
                            }
                            tip.text(msg);
                            tip.addClass('validator-error');
                        }
                    }
                });
            });
            
            //ԭ���ظ�ѡ���¼�
            $("#productArea :radio").click(function(e){
            	 if($(this).val() === 'N'){
            	 	  $("#origin_area").val("");
            	 	  $("#origin_area").prop("disabled",true);
             	 }else{
             	 	  $("#origin_area").prop("disabled",false);
             	 }
            });
          
						
            //������ʽ��ѡ���¼�
            $('#supplyType :radio').click(function(e){
            	 if($(this).val() === 'N'){
            	 	  $('#offer_supply_type').val('');
            	 	  $('#offer_supply_type').prop('disabled',true);
             	 }else{
             	 	  $('#offer_supply_type').prop('disabled',false);
             	 }
            });
            
            
            
            var formEl = $('#form-add-task'),
                cityResultEl = $('#city-result'),
                industryResultEl = $('#industry-result'),
                categoryResultEl = $('#category-result');
		            formEl.submit(function(){
		                //���ϳ��е�ֵ
		                $('#city-value').val(getSelectVals(cityResultEl).join());
		                //������Ŀ��ֵ
		                var cateVals = getSelectVals(categoryResultEl),
		                    cate1stVal = [],
		                    cate2ndVal = [];
		                for (var i=0, l=cateVals.length; i<l; i++){
		                    var cate = cateVals[i].split('-');
		                    if (cate[1]==='1'){
		                        cate1stVal.push(cate[0]);
		                    } else if(cate[1]==='2'){
		                        cate2ndVal.push(cate[0]);
		                    }
		                }
		                $('#category1-value').val(cate1stVal.join());
		                $('#category2-value').val(cate2ndVal.join());
		
		                //���ԭ������֤
		                if($("#productArea :radio[name='product_area_radio']:checked").val() === 'Y' && $("#productArea").is(":hidden")==false){
		                	 if($("#origin_area").val() === ''){
				                	$("#productArea .validator-tip").text("��ѡ��ԭ����");
				                	$("#productArea .validator-tip").addClass('validator-error');
				                	return false;
		                	  }
		                }  
		                 //��ӹ�����ʽ��֤
		                if($("#supplyType :radio[name='supply_mode_radio']:checked").val() === 'Y' && $("#supplyType").is(":hidden")==false){
		                	 if($("#offer_supply_type").val() === ''){
				                	$("#supplyType .validator-tip").text("��ѡ�񹩻���ʽ");
				                	$("#supplyType .validator-tip").addClass('validator-error');
				                	return false;
		                	  }
		                }  
		
		                //������ҵ��ֵ
		                var industryVals = getSelectVals(industryResultEl),
		                    industry1stVal = [],
		                    industry2ndVal = [];
		                for (var i=0, l=industryVals.length; i<l; i++){
		                    var industry = industryVals[i].split('-');
		                    if (industry[1]==='1'){
		                        industry1stVal.push(industry[0]);
		                    } else if(industry[1]==='2'){
		                        industry2ndVal.push(industry[0]);
		                    }
		                }
		                $('#industry1-value').val(industry1stVal.join());
		                $('#industry2-value').val(industry2ndVal.join());
		
										//������С����ֵ
										var orderList = [];
										
										$('.order_div').each(function(){
											var order = new Object(),
											    order_num;
											    order_num = $(this).find('.start_order_num').val();
											    if(!order_num){
											    	return true;
											    }
											    order.compare = $(this).find('.orderSelect').val();
											    order.num = order_num;
											    order.unit = $(this).find('.unit').val();
											    orderList.push(order);
										});
										
										if(orderList.length>0){
											$('#hid_order').val(JSON.stringify(orderList));
										}
		                return formValid.valid();
		            });
            
		            $('#btn-reset').click(function(e){
		                cityResultEl.html('');
		                categoryResultEl.html('');
		            });
        }
    ];
   //��ȡ��С������λ
   function getUnitByCategoryId(categoryId, callback){
   
        $.ajax({
            url: domain + '/tools/getUnitByCategory.json',
            data: {'categoryId':categoryId},
            dataType: 'jsonp',
            success: function(o){
                var data = o.unitList;
                callback.call(this, data);
            }
        });
    }
    
    function mateShowInfo(val, mate, allEls){
        for (p in mate){
            if(p===val){
                allEls.hide();
                $(mate[p]).show();
            }
        }
    }
    
    
		//������Ŀ���Ĭ��ֵ����
		function categoryDefault(){
			var cate1st = $('#category1-value'),
          cate2nd = $('#category2-value'),
          hid_order ;
          //Ĭ��ѡ�б����ԭ����
           if($("#area-value").val().length > 0){
           	  $("#origin_area").val($("#area-value").val()) ;
           };
           if($('input:radio[name=product_area_radio]:checked').val()==='N'){
		                       	$("#origin_area").val('');
          	 	              $("#origin_area").prop('disabled',true);
		       }
		       //Ĭ��ѡ�б���Ĺ�Ӧ��ʽ 
           if($('#supply-value').val().length > 0){
           	  $('#offer_supply_type').val($('#supply-value').val()) ;
           };
           if($('input:radio[name=supply_mode_radio]:checked').val()==='N'){
		                       	$("#offer_supply_type").val('');
          	 	              $("#offer_supply_type").prop('disabled',true);
		       }
           //Ĭ����С������ʾ
           hid_order = $('#hid_order').val();
           //��pdȷ���ˣ�Ĭ�ϵ�һ���ı��˺����һ���
           $('.orderSelect').change(function() {
           	  var orderVal = $(this).val();
						  $('.order_div').each(function(){
						  	 $(this).find('.orderSelect').val(orderVal);
						  });
					 });
       
           if(hid_order){
           		var dataObj = eval(hid_order),
           				orderDD = $('#orderNum dd'),
           				cur_order,
           				order_html,
           				categoryId = 0;
           				 $("#category-result option").each(function(){
										   if($(this).val().indexOf('-2-4')>0){
										   	categoryId = $(this).val().split('-')[0] ;
										   }
										  }
									);
           		    getUnitByCategoryId(categoryId, function(data,item){
								  			var html = '';
						                for (var i=0, l=data.length; i<l; i++){
						                    html += '<option value="'+data[i]+'">'+data[i]+'</option>';
						                }		
						                $(dataObj).each(function(i,item){
							             		  if(!item.compare || !item.num || !item.unit){
							             		  	return true;
							             		  }
																if(i>0){
															  		 orderDD.append('<div class="order_div">'+order_html+'  <a href="#" data-flag="remove">�Ƴ�</a> </div>');
															  		 cur_order = $('.order_div').last();
															  		 cur_order.find('.orderSelect').val(item.compare);
															  		 cur_order.find('.start_order_num').val(item.num);
															  		 cur_order.find('.unit').val(item.unit);
															  }else{
															  	 $('.unit').append(html);
															  	 $('.orderSelect').val(item.compare);
																	 $('.start_order_num').val(item.num);
																	 $('.unit').val(item.unit);
																	 order_html = $('.order_div').html();
							  								}
													 })		
												  	 
							    });
           		
           }
		}
    
    function requetCategoryId(categoryId, callback){
        $.ajax({
            url: domain + '/tools/get_post_category_by_parent_id.json',
            data: {'categoryId':categoryId},
            dataType: 'jsonp',
            success: function(o){
                var data = o.categoryList;
                callback.call(this, data);
            }
        });
    }
    
    function getSelectVals(select){
        var options = $('option', select),
            vals = [];
		        options.each(function(i, el){
		            vals.push(el.value);
		        });
		        return vals;
    }
    
    E.validRoundVal = function(){
        var input2 = $(this),
            input1 = input2.prevAll('input'),
            val1 = input1.val(),
            val2 = input2.val();
        if ((!val2)||val2-val1>0){
            return true;
        }
        return '��������ȷ������ֵ';
    }
    
    $(function(){
        for (var i=0, l=readyFun.length; i<l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
})(jQuery, FE.elf);