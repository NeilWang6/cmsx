/**
 * 全站通用加入进货单组件
 * updated by ginano@20120603
 * data-purchase='' 承载所需要的数据和配置
 * 必填项为offerId，其余可以按需配置
 * <a href="#" data-purchase='{"offerId":"1455442","onSuccess":"callback","onShow":"showback"}'>加入进货单</a>
 */
;(function($,SYS){			
		var lunaDomain='http://order.1688.com',	//dev envoriment
			//lunaDomain='http://luna-test.china.alibaba.com:37100',			
			getOfferInfoUrl, addPurchaseUrl, viewPurchaseUrl,
			switchURL=function(){
				if(FE.test['style.luna.url']){
					lunaDomain=FE.test['style.luna.url'];
				}
				getOfferInfoUrl=lunaDomain+'/order/purchase/ajax/get_offer_info.jsx';
				addPurchaseUrl=lunaDomain+'/order/purchase/ajax/add_to_purchase_list_new.jsx';		
				viewPurchaseUrl=lunaDomain+'/order/purchase/purchaseList.htm';
			},
			htmlTemplate={
				normalDialog:'<div class="sys-purchaselist">\
					    		<div class="d-head">\
							 		<h2>批量选择</h2>\
									<div class="close"></div>\
							 	</div>\
								<div class="d-body">\
									<div class="d-content">\
									</div>\
									<div class="d-foot fd-clr">\
									</div>\
								</div>\
							</div>',
				normalButton:'<a href="#" class="purchase-button purchase-button-y confirm"><em>确&nbsp;&nbsp;定</em></a>\
						<a href="#" class="purchase-button purchase-button-g close"><em>取&nbsp;&nbsp;消</em></a>',
				initialContent:'<div class="add-purchase-info add-ok"><h3>货品信息加载中...</h3><div class="sub-info">货品信息加载中，正在初始化。。。</div><div><a href="#" class="purchase-button" title="我知道了"><em>我知道了</em></a></div></div>'
			},		
			hasOwn=Object.prototype.hasOwnProperty,
			/**
			 * 
			 * @param {String/Int/Float} pv
			 */
			intValid=function(pv){
				var pv=pv+'';
				if(pv.replace(/\s/g,'')==''){
					return true;
				}				
				return /^[0-9]+$/.test(pv);
			},
			/**
			 * 转换字符串为函数，多用于html配置读取，然后转换为函数
			 * 典型的应用场景
			 * evalFunction(config,'onSuccess',o);
			 * add by ginano@20120603
			 * @param {Object} object 需要对其进行转移的对象eg:window
			 * @param {String} funcName 转移具体属性函数名，myfunctionname
			 * @param {Object} args 如果传入该参数表明需要立即就执行的
			 */
			evalFunction=function(object,funcName,args){
				var argStr='arguments[0][0]',
					argArray,
					_i,_len;
					if('object'===typeof object && 'string'===typeof object[funcName] && object[funcName]!==''){
						try {					
							if('undefined' !==typeof args){
								argArray=Array.prototype.slice.call(arguments,2);
								for(_i=1,_len=argArray.length;_i<_len;_i++){
									argStr+=',arguments[0]['+_i+']';
								}
								object[funcName]= Function(object[funcName]+'('+argStr+')');
								object[funcName](argArray);
							}else{
								//默认4个参数
								object[funcName]= Function(object[funcName]+'(arguments[0],arguments[1],arguments[2],arguments[4])');
							}
							//=Function(_config.open);
						}catch(e){
							delete object[funcName];
						}
					}else if('object'===typeof object && 'function'===typeof object[funcName] && 'undefined' !==typeof args){
						try{
							argArray=Array.prototype.slice.call(arguments,2);
							object[funcName](argArray);
						}catch(e){
							delete object[funcName];
						}
					}else{
						return ;
					}
			},
			copyArray=function(pArray){
				var _len,_r=[];
				pArray=pArray||[];				
				_len=pArray.length;
				while(_len){
					--_len;
					_r.unshift(pArray[_len]);
				}
				return _r;
			},
			/**
			 * 浅判断而已
			 * @param {Array} pArray1
			 * @param {Array} pArray2
			 */
			equalArray=function(pArray1,pArray2){
				var _i,_len;
				pArray1=pArray1||[];
				pArray2=pArray2||[];
				_len=pArray1.length;
				if(_len!==pArray2.length){
					return false;
				}
				for(var _i=0;_i<_len;_i++){
					if(pArray1[_i]!==pArray2[_i]){
						return false;
					}
				}
				return true;
			},
			nowOffer={}, //存储当前的Offer对象
			//存储所有的Offer列表
			OFFERLIST=[],
			/**
			 * 新建一个offer对象应当用Offer('ddd'),而不是new
			 * @param {String} pOfferId
			 */
			Offer=function(pConfig){
				var i=0,
					len=OFFERLIST.length,
					temp;
				for(;i<len;i++){
					temp=OFFERLIST[i];
					if(temp.offerId==pConfig.offerId){
						//update by ginano for the reconfig
						temp.config=$.extend({},pConfig);
						return temp;
					}
				}
				temp=new _Offer(pConfig);
				OFFERLIST.push(temp);
				return temp;
			},
			/**
			 * OFFER 对象
			 * @param {String} pOfferId
			 */
			_Offer=function(pConfig){			
				this.offerId=pConfig.offerId;
				//修改配置不需要缓存到节点之上,为了防止一个offer可能有多个调用组件
				this.config=$.extend({},pConfig);
				this.sku={};			
			},
			/**
			 * 涉及逻辑控制的控制器
			 */
			Controller={			
				/**
				 * 每次使用时需要初始化			 
				 * @param {Object} Model
				 */
				init:function(Model){
					this.view=Dialog;
					this.model=Model;
					return this;
				},
				plusAmount:function(pInputObj){
					var val=pInputObj.val();
					if(intValid(val)) {
						pInputObj.val(val-0+1);
						this.editAmount(pInputObj);
					}else{
						pInputObj.val(0);				
						this.view.showMsg(pInputObj,['formaterror']);
					}
				},
				minusAmount:function(pInputObj){
					var val=pInputObj.val();
					if(intValid(val)&&val) {
						pInputObj.val(val-1);
						this.editAmount(pInputObj);
					}else{
						pInputObj.val(0);				
						this.view.showMsg(pInputObj,['less0']);
					}
				},
				/**
				 * 编辑数量
				 * @param {Object} pInputObj
				 */
				editAmount:function(pInputObj,pIsBatch){				
					var $input=pInputObj||{},
						_view=this.view,
						_model=this.model,
						val,_specinfo,_old,msg,
						_config=_model.getConfig();
					if($input.length<1){
						return;
					}
					pIsBatch=pIsBatch||false;
					val=$input.val();
					_specinfo=_view.getSpecPath($input);
					_old=_model.getSpecInfo(_specinfo);
					msg=[];
					//console.log('start edit val:'+val);
						//_max=nowOffer.getSpecMax(_specinfo);
					if(intValid(val)){	
						//console.log('pass');									
						if(val<0){
							//订购数量必须是大于1的数字								
							$input.val(0);
							msg.push('less0');
							_view.showMsg($input,msg,pIsBatch);	
							//console.log('less than 0');							
							return;
						}
						if(!_model.checkMaxAmount(_specinfo,val)){
							//超过最大可售数量
							val=_old.remainAmount;
							msg.push('此货品最大可购买量为'+val+_model.config.unit);
							//console.log('maxed');	
						}
						//修改数量的时候不校验最小起批量
	//					if(!_model.checkMinAmount(_specinfo,val)){
	//						//不满足最小起批量
	//						//val=_old.num;
	//						msg.push('此货品最小起订量为'+_config.minAmount+_model.config.unit);
	//					}
						//$input.val(val);
						//此时涉及到了数量的变更则需要重新更新价格和总价,此时_old已经更新了
						_model.setNum(_specinfo,val);
						//console.log('set val:'+val);	
						//console.log('-----------------end--------');
						_view.updateLiInfo($input,val,_old.totalMoney);
						_view.updateTotalInfo(_model.getConfig());					
						_view.showMsg($input,msg,pIsBatch);
						//修改完后再校验一把
						this.checkAmount();					
					}else{
						//console.log('not pass');
						$input.val(_old.num);
					}
				},
				/**
				 * 校验数量
				 * @param {Bool} pIsShow 是否展示错误
				 */
				checkAmount:function(pIsShow){
					var _model=this.model,
						_view=this.view,
						_num=_model.getAmount(),
						_config=_model.getConfig();
					//校验总数量是否超过了100
					if(_config.selectedAmount>100){
						_view.showTotalError('您购买的产品种类为'+_config.selectedAmount+'种，已超过最多100种的上限，请减少订购种类。');
						return false;
					}
					//校验总重量
					if(_num>0){
						//强制校验最小值时如果不支持混批需要校验最小值，
						if(pIsShow&&!_model.checkMinAmount(undefined,_num)){
							_view.showTotalError('此货品最小起订量为'+_config.minAmount+_config.unit);
							return false;
						}
						_view.showTotalError('');
						return true;
					}
					
					if(pIsShow){
						_view.showTotalError('noselected');					
					}
					return false;
				},
				/**
				 * 添加到进货单
				 */
				addToPurchase:function(){
					var _view=this.view,
						_model=this.model,
						_modelConfig=_model.getConfig(),
						_config={
							success:function(o){
								//只有设置了展示的时候才展示此消息
								if (_modelConfig.isShowSuccess!==false) {
									if (o.success === 'true' || o.success === true) {

										//更改为只有设置了展示成功界面时才展示，默认展示的
										_view.showAddPurchaseMsg('success', o, _modelConfig);
									} else {
										if (o.code === 'PURCHASE_OVER_FLOW_ERROR') {
											_view.showAddPurchaseMsg('morethan', o);
										} else {
											_view.showAddPurchaseMsg('failure', o);
										}
									}
									_view.resetPosition(_modelConfig);
									_view.hide();
									_view.show(_modelConfig.dialogConfig);
								}else{
									_view.hide();
								}
								//结果返回时则交由此处理
								evalFunction(_model.config,'onSuccess',o);								
							},
							error:function(o){
								if (_modelConfig.isShowSuccess!==false) {
									_view.showAddPurchaseMsg('othererror', o);
								}else{
									_view.hide();
								}
							},
							beforeSubmit:function(){
								_view.showAddPurchaseMsg('begin');
								_view.resetPosition(_modelConfig);
							}
						};
					if(this.checkAmount(true)){

						//todo					
						if(_modelConfig.isSku){
							_config.params = {
								'specData': _model.specArrayToString(_model.getAllSpecInfo()),
								'type':'offer',
								'cargoIdentity':_model.offerId,
								'returnType':'url',
                                'needTotalPrice':false,//是否需要展示总价格
                                'promotionSwitch' : _model.config.promotionSwitch || false,//大促开关 
								't':$.now() 
							};
							_view.addToPurchase(_config);
						}else{
							_config.params={
								'type':'offer',
								'cargoIdentity':_model.offerId,
								'quantity':_model.getAmount(),
                                'needTotalPrice':false,//是否需要展示总价格
                                'promotionSwitch' : _model.config.promotionSwitch || false,//大促开关 
								'returnType':'json'
							};
							_view.addNormalToPurchase(_config);
						}
						
					}else{
						return false;
					}
					
				},
				/**
				 * 开放一个接口出来
				 * @param {String} pNum
				 * @param {String} pIndex
				 */
				setNum:function(pNum,pIndex){
					var pIndex=pIndex||[];
					this.model.setNum(pIndex,pNum);
					return this;
				},
				/**
				 * 进行默认设置操作Pd要求的
				 * @param {Object} pConfig
				 */
				setDefaultConfig:function(pConfig){
					if(!pConfig){
						return;
					}
					//默认普通offer直接加入，所以进行isAutoAdd设置
					if(!pConfig.isSku&&pConfig.isAutoAdd!==false){
						pConfig.isAutoAdd=true;
					}
				},
				//获取offer信息
				getOfferInfo:function(){
					var _self=this,
						_view=_self.view,
						_model=_self.model,
						_config={
							'offerId':_model.offerId,
							'success':function(o){
								var __config;
								_model.setConfig(o);
								__config=_model.getConfig();
								//初始化ui并调整位置
								_view.initialUI();									
								
								//新增默认配置
								_self.setDefaultConfig(__config);
								//展示之前的回调
								evalFunction(__config,'onShow',__config);
								//如果直接加入进货单
								if(__config.isAutoAdd && o.success && (o.msg===undefined||o.msg==='')){
									//只有成功了才执行									
									_self.addToPurchase();									
								}else{
									//初始化UI
									_view.init(_model);	
									_view.resetPosition(__config);								
									_view.show(__config.dialogConfig);
								}														
							},
							'beforeSend':function(){
								_view.hide();
							},
							'error':function(o){
								//服务器不可用
							}
						};
					_view.getOfferInfo(_config);
				},
				/**
				 * 打点
				 * @param {String} sysTracelog
				 */
				doAliclick:function(sysTracelog){
					var _str='',
						_cstr=this.model.getConfig().tracelogStr;
					if(_cstr){
						_str='_'+_cstr;
					}
					this.view.doAliclick(sysTracelog+_str);
				}
			},
			/**
			 * 视图dom操作
			 */
			Dialog={
				node:{},			
				isInit:false,	//是否初始化过
				isShowed:false,	//目前是展示的么
				getTheDom:function(){
					return this.node.length?this.node:this.node=$(htmlTemplate.normalDialog).appendTo($('body'));
				},
				//初始化应当完成生成基本的html结构。
				/**
				 * 初始化应当完成生成基本的html结构。
				 * @param {Object} offerObj
				 */
				init:function(offerObj){
					var _self=this,
						_dom=_self.getTheDom(),
						_title,
						_content,
						_foot,
						_config=offerObj.config,
						_sku=offerObj.sku;
					
					_foot=htmlTemplate.normalButton;
					_title='请选订购数量';
					//根据信息填写列表信息					
					if(_config.isSku){
						//skuoffer下单
						_content=_self.generateList(_config,_sku);
						if(_config.priceType==='range'){
							_dom.addClass('sys-purchaselist-small');
						}					
					}else if(_config.msg){
						//大批offer
						_content=_self.generateError(_config.msg);
						_foot='';
						_title='系统消息';
						_dom.addClass('sys-purchaselist-error');
					}else{
						//默认为普通offer
						_content=_self.generateNormal(_config);
						_dom.addClass('sys-purchaselist-min');
					}
					_self.setTitle(_title);
					_self.setContent(_content);	
					_self.setFoot(_foot);
					_self.checkHeight();
					return _self;			
				},
				/**
				 * 初始化UI界面，只执行一次
				 */
				initialUI:function(){
					var _self=this,
						_dom=_self.getTheDom();
					
					if(!_self.isInit){										
						_dom.delegate('.close','click',function(e){
							e.preventDefault();
							_self.hide();
						})

                        /*大促抽奖*/
                        .delegate('a.btn-lottery','click',function ( e ){
                            e.preventDefault();
                            if (FE.operation && FE.operation.promotion1118){
                                FE.operation.promotion1118.module.lottery();
                                _self.hide();
                            } else {
                                $.getScript('http://static.c.aliimg.com/js/app/operation/dacu/13-1118/module/purchaselist/lottery.js', function(){
                                    $.loadCSS('http://style.c.aliimg.com/sys/css/dpl/dpl-merge.css',function(){
                                        FE.operation.promotion1118.module.lottery();
                                        _self.hide();
                                    });
                                });
                            }
                                
                          })

                            //选中某项
                            .delegate('li.sku-item-notsel','click',function(){
                                //只针对没有选中的条目拥有
                                var $issame=_dom.find('input.select-same'),
                                    $inputs=$(this).find('input.amount-input'),
                                    _temp;
                                _self.selectLi($(this),true);
                                if($issame.prop('checked')){
                                    _temp=_self.getFirstValue();
                                    if(_temp.amount>0){
                                        $inputs.each(function(){
                                            $(this).val(_temp.amount);
                                            //Controller.editAmount($(this),true);
                                        });
                                    }
                                }
                                $inputs.each(function(){
                                    //$(this).val(_temp.amount);
                                    Controller.editAmount($(this),true);
                                });
                            })
                            //选择一个
                            .delegate('input.select-one','change',function(){						
                                var $this=$(this),
                                    issel=$this.prop('checked'),
                                    $issame=_dom.find('input.select-same'),
                                    $li=$this.closest('li.sku-item'),
                                    $inputs=$li.find('input.amount-input'),
                                    _temp;
                                    
                                _self.selectLi($li,issel);						
                                if(issel&&$issame.prop('checked')){
                                    _temp=_self.getFirstValue();
                                    if(_temp.amount>0){
                                        $inputs.each(function(){
                                            $(this).val(_temp.amount);
                                            //Controller.editAmount($(this),true);
                                        });
                                    }
                                }
                                $inputs.each(function(){
                                    //$(this).val(_temp.amount);
                                    Controller.editAmount($(this),true);
                                });
                            })
                            //选择某一个的click事件阻止
                            .delegate('input.select-one','click',function(e){
                                e.stopPropagation();
                                //return false;
                            })
                            //全选
                            .delegate('input.select-all','change',function(e){
                                var $this=$(this),
                                    $dom=_dom,
                                    issel=$this.prop('checked'),
                                    $issame=$dom.find('input.select-same'),
                                    $lis,
                                    $inputs=$dom.find('input.amount-input'),
                                    _temp;
                                if(issel){
                                    $lis=$dom.find('li.sku-item-notsel');
                                }else{
                                    $lis=$dom.find('li.sku-item-selected');
                                }
                                $lis.each(function(){
                                    _self.selectLi($(this),issel);
                                });
                                _temp=_self.getFirstValue();
                                if(issel&&$issame.prop('checked')){							
								if(_temp.amount>0){
									_temp.els.each(function(){
										$(this).val(_temp.amount);
										//Controller.editAmount($(this),true);
									});	
								}
							}
							$inputs.each(function(){							
								Controller.editAmount($(this),true);
							});
							//return false;
						})
						//数量修改
						.delegate('input.amount-input','keyup',function(){						
							Controller.editAmount($(this));						
						})
						//加减操作
						.delegate('a.minus,a.plus','click',function(e){
							e.preventDefault();	
							var $this=$(this),
								$input=$this.closest('div').find('input');					
							if($this.hasClass('minus')){
								Controller.minusAmount($input);
							}else{
								Controller.plusAmount($input);
							}							
						})
						
						//相同数量
						.delegate('input.select-same','change',function(){						
							var $this=$(this),
								_temp=_self.getFirstValue();
							if(_temp.amount>0&&$this.prop('checked')){															
								_temp.els.each(function(){
									$(this).val(_temp.amount);
									Controller.editAmount($(this),true);
								});	
							}else{
								$this.prop('checked',false);
							}
						})
						//确认加入进货单
						.delegate('a.confirm','click',function(e){
							e.preventDefault();
							Controller.addToPurchase();
							Controller.doAliclick('sys_purchaselist_confirm');
						})
						//查看进货单
						.delegate('a.view-purchase','click',function(e){
							e.preventDefault();
							FE.util.goTo($(this).attr('href'),'_blank');
							_self.hide();
						});
						_self.isInit=true;
					}
					_dom.removeClass().addClass('sys-purchaselist');
					_self.setTitle('系统消息');
					_self.setContent(htmlTemplate.initialContent);	
					_self.setFoot('');
					return _self;
				},
				/**
				 * 更新价格和总价、数量
				 * @param {Object} pConfig
				 */
				updateTotalInfo:function(pConfig){
					var $bar=this.node.find('div.stat-info'),
						_typeCal=$bar.find('em.total-type'),
						_moneyCal=$bar.find('em.total-money'),
						_amountCal=$bar.find('em.total-amount'),
						_priceList=$bar.find('div.price-range-list'),
						_priceLine;
					//更新种类
					if(_typeCal.length){
						_typeCal.html(pConfig.selectedAmount);
					}
					//更新总价
					if(_moneyCal.length){
						_moneyCal.html(pConfig.totalMoney.toFixed(2));
					}
					//更新数量
					if(_amountCal.length){
						_amountCal.html(pConfig.num);
					}
					//更新价格
					if(_priceList.length){
						_priceLine=_priceList.find('dl');
						_priceLine.removeClass('price-selected');
						_priceLine.eq(pConfig.priceIndex).addClass('price-selected');
						//.html(pConfig.totalMoney);
					}
				},
				/**
				 * 更新数量和总价
				 * @param {Object} pInputObj
				 * @param {Object} pVal用于输入框显示的
				 * @param {String||Int} pMoney 用于金额的
				 */
				updateLiInfo:function(pInputObj,pVal,pMoney){
					var $this=pInputObj||{},
						$li,$subPrice;
					if($this.length){
						$li=$this.closest('li.sku-detail-item');
						$subPrice=$li.find('div.col7');
						$this.val(pVal);
						
						if($subPrice.length){
							$subPrice.html(pMoney.toFixed(2));
						}
						
					}
				},
				
				/**
				 * 获取第一个正确的数量和返回对象
				 */
				getFirstValue:function(){
					var $dom=this.node,
						$lis=$dom.find('li.sku-item-selected'),
						$inputs=$lis.find('input.amount-input'),							
						_temp={
							amount:0,	//第一个可用数量
							els:$inputs	//所有的input元素							
						};
						for (var _i = 0, _len = $inputs.length; _i < _len; _i++) {
							_temp.amount = $inputs.eq(_i).val() || 0;
							if (intValid(_temp.amount) && _temp.amount > 0) {
								break;
							}
						}					
						return _temp;							
				},
				/**
				 * 根据输入jqueyr对象获取对应的spec信息
				 * @param {Object} htmlObj
				 * @return [['黄色','M'],['白色','M']]
				 */
				getSpecPath:function(htmlObj){
					return htmlObj.closest('li.sku-detail-item').data('index')||0;
				},
				/**
				 * 统计信息的展示
				 * @param {String} pMsg
				 */
				showTotalError:function(pMsg){
					pMsg=pMsg||'';
					var ErrorMsg={
						'noselected':'订购数量必须为大于0的整数',
						'default':'未知错误'
					},
					$tips=this.node.find('span.total-error');
					if(pMsg){
						$tips.html(ErrorMsg[pMsg]||pMsg).show();
					}else{
						$tips.hide();
					}				
				},
				/**
				 * 展示数量相关消息
				 * @param {Object} pInputObj $('input')
				 * @param {Object} pMsg ['errorCode']
				 */
				showMsg:function(pInputObj,pMsg,isBatch){
					pInputObj=pInputObj||{};
					pMsg=pMsg||[];
					isBatch=isBatch||false;
					var msg,tips,pdiv,timer,
						ErrorMsg={
							'less0':'订购数量必须为大于0的整数',		//小于0
							'maxerror':'最大值校验不通过',	//最大值校验不通过
							'mineroor':'最小值校验不通过',	//最小值校验不通过
							'default':'其他错误'	//其他错误
						};
					if(pInputObj.length&&pMsg.length){
						//目前只显示最后一个吧
						msg=pMsg[pMsg.length-1];
						if(isBatch){
							pdiv=pInputObj.closest('li').find('div.col5');
						}else{
							pdiv=pInputObj.closest('div');
						}
						//pInputObj.focus();
						tips=pdiv.find('span.msg-tips');
						if(tips.length<1){
							tips=$('<span class="msg-tips"></span>').appendTo(pdiv);
						}					
						tips.html(ErrorMsg[msg]||msg);
						pdiv.addClass('showtips');
						timer=tips.data('timer')||null;
						if(timer){
							clearTimeout(timer);
						}
						timer=setTimeout(function(){
							pdiv.removeClass('showtips');
						},1500);
						tips.data('timer',timer);
					}else{
						return;
					}				
				},
				/**
				 * 判断列表的高度是否大于了展示滚动条的高度
				 */
				checkHeight:function(){
					var $node=this.node,
						$items=$node.find('li.sku-detail-item'),
						$content=$node.find('div.d-content');
					$content.removeClass('sku-list-limit');
					if($items.length>10){
						$content.addClass('sku-list-limit');
					}
					return this;
				},
				/**
				 * 选中与否
				 * @param {jQuery Object} pLi
				 * @param {Bool} isSelected		
				 */
				selectLi:function(pLi,isSelected){	
					var _self=this,
						cln='sku-item-selected',
						cln2='sku-item-notsel',
						$cones,
						$iamount;
					isSelected=isSelected||false;			
					if(pLi&&pLi.length){
						$cones=pLi.find('input[type=checkbox]');
						$iamount=pLi.find('input[type=text]');
						if(isSelected){
							pLi.addClass(cln).removeClass(cln2);
						}else{
							pLi.addClass(cln2).removeClass(cln);
						}							
						$cones.prop('checked',isSelected);
						$iamount.prop('disabled',!isSelected);
						if(isSelected){
							$iamount.eq(0).focus();
						}
						if(!isSelected){
							$iamount.val('');
						}
						_self.isAllSelect();
					}else{
						return;
					}
				},
				/**
				 * 判断是否所有的都选中了
				 */
				isAllSelect:function(){
					var _self=this,
						$dom=_self.node,
						$cone=$dom.find('input.select-one'),
						$call=$dom.find('input.select-all'),
						$thesame=$dom.find('input.select-same')
						isAlltrue=true,
						isAllfalse=true;
					
					for(var _i=0,_len=$cone.length;_i<_len;_i++){
						if($cone.eq(_i).prop('checked')){
							isAllfalse=false;
						}else{
							isAlltrue=false;
						}
					}
					
					$call.prop('checked',isAlltrue);
					if(isAllfalse){
						$thesame.prop('checked',false);
					}
					return isAlltrue;
				},
				/**
				 * 展示错误信息
				 * @param {String} pErrorMSG
				 */
				generateError:function(pErrorMSG){
					var $html=[];												
					$html.push('<div class="add-purchase-info add-warn">');
					$html.push('<h3>'+(pErrorMSG||'系统错误，请稍后重试。')+'</h3>');							
					$html.push('<div class="text-right"><a href="#" class="purchase-button  close" title="知道了"><em>知道了</em></a></div>');		
					$html.push('</div>');							
							
					return $html.join('');
				},
				/**
				 * 根据传入的offer配置生成普通offer的html标签
				 * @param {Object} pConfig
				 */
				generateNormal:function(pConfig){
					pConfig=pConfig||{};
					var _html=[];
					_html.push('<div class="normal-offer">');
					if(pConfig.isMixed){
						_html.push('<div class="mixed-condition">该货品支持：<span class="icon-mixed"></span></div>');
					}
					_html.push('<div class="input-line">我要订购：<span class="input-span">\
									<input class="amount-input" type="input" value="'+pConfig.minAmount+'"/>\
									<a class="arrow plus arrow-plus " title="加一" href=""></a>\
									<a class="arrow minus arrow-minus "  title="减一" href=""></a>\
								</span>'+pConfig.unit+'<span class="gray">（可售数量：'+pConfig.remainAmount+pConfig.unit+'）</span></div>');
					_html.push('<div class="stat-info"><span class="total-error"></span></div>');
					_html.push('</div>');
					return _html.join('');
				},
				/**
				 * 根据传入的offer信息生成不同的html标签
				 * @param {Object} pConfig
				 * @param {Object} pInfo
				 */
				generateList:function(pConfig,pInfo){
					pConfig=pConfig||{};
					pInfo=pInfo||[];				
					
					var _html=[],
						_isSpecPrice=pConfig.priceType === 'spec',
						_is2=pConfig.specInfo[1]||false,
						isunit='',
						_priceinfo,					
						_fun=function(_obj){
							var _p,_temp,_i=0,_len,_isfirst,_path=[''],_temppath;								
							
							for(_len=_obj.length;_i<_len;_i++){
								_temp=_obj[_i];
								_isfirst='';															
								_temppath=_temp.path.slice(0, -1);
//								//如果为同一父节点,并且可以借此判断是否为第一个节点
//								if(_is2&&equalArray(_path,_temppath)){									
//									if(_i===_len-1){
//										_islast=true;
//									}else{
//										if(!equalArray(_path,_obj[_i+1].path.slice(0,-1))){
//											_islast=true;
//										}
//									}									
//								}else{
								//如果是一维的需要每次渲染，或者二维中的第一个
								if(!_is2||!equalArray(_path,_temppath)){
									//第一个节点
									_path=_temppath;
									_isfirst=' first-item ';
									_html.push('<li class="sku-item sku-item-notsel  fd-clr">');
									_html.push('<div class="col1"><input type="checkbox" class="select-one"/></div>');
									_html.push('<div class="col2">'+_temp.path[0]+'</div>');
									//是否是二维的
									if(_is2){
										if(_isSpecPrice){
											_html.push('<div class="col34567">');
										}else{
											_html.push('<div class="col356">');
										}
									}else{
										if(_isSpecPrice){
											_html.push('<div class="col4567">');
										}else{
											_html.push('<div class="col56">');
										}
									}																		
									_html.push('<ul class="sku-detial-list">');										
								}
								
								_html.push('<li class="sku-detail-item '+_isfirst+' fd-clr" data-index="'+_i+'">');
								if(_is2){
									_html.push('<div class="col3">' + _temp.path[1] + '</div>');	
								}
								if(_isSpecPrice){
									_html.push('<div class="col4">'+_temp['price'].toFixed(2)+'</div>');
								}
								_html.push('<div class="col5">'+_temp['remainAmount']+'</div>');
								_html.push('<div class="col6">');
								_html.push('<a class="minus" title="减一" href="#">-</a>');
								_html.push('<input type="text" class="amount-input " disabled="true"/>');
								_html.push('<a class="plus" title="加一" href="#">+</a>');
								_html.push('</div>');
								if (_isSpecPrice) {
									_html.push('<div class="col7">0.00</div>');
								}
								_html.push('</li>');
								
								//如果是一维节点始终是最后一个节点进行闭合，对于二维的则需要判断索引为最后一个，或者是下一个的路径与现再的路径不一致
								if(!_is2||(_i===_len-1)||!equalArray(_path,_obj[_i+1].path.slice(0,-1))){
									_html.push('</ul></div></li>');
								}								
							}							
						};
					
					//title part	
					_html.push('<div class="col-title fd-clr">\
							<div class="col1"><input type="checkbox" class="select-all"/></div>\
							<div class="col2">'+pConfig.specInfo[0]+'</div>');
					if(pConfig.sellUnit&&pConfig.scale){
						isunit='<div class="col6-tips"><span class="col6-tips-span">本商品按'+pConfig.sellUnit+'批发，'+pConfig.scale+pConfig.unit+'等于1'+pConfig.sellUnit+'</span></div>';
					}
					
					if (_is2) {
						if(_isSpecPrice){
							_html.push('<div class="col34567 fd-clr">');
								_html.push('<div class="col3">' + _is2 + '</div>');
								_html.push('<div class="col4">单价（元）</div>');
								_html.push('<div class="col5">可售数量（<em class="unit">'+pConfig.unit+'</em>）</div>\
											<div class="col6">'+isunit+'\
												<div class="col6-line">订购数量（<em class="unit">'+pConfig.unit+'</em>）</div>\
												<div class="col6-line"><input type="checkbox" class="select-same" id="select-same-checkbox"/><label for="select-same-checkbox">全部相同</label></div>\
											</div>');
								_html.push('<div class="col7">小计（元）</div>');
							_html.push('</div>')
						}else{
							_html.push('<div class="col356 fd-clr">');
								_html.push('<div class="col3">' + _is2 + '</div>');
								_html.push('<div class="col5">可售数量（<em class="unit">'+pConfig.unit+'</em>）</div>\
											<div class="col6">'+isunit+'\
												<div class="col6-line">订购数量（<em class="unit">'+pConfig.unit+'</em>）</div>\
												<div class="col6-line"><input type="checkbox" class="select-same" id="select-same-checkbox"/><label for="select-same-checkbox">全部相同</label></div>\
											</div>');
							_html.push('</div>')
						}				
						
						
					}else{
						if(_isSpecPrice){
							_html.push('<div class="col4567 fd-clr">');
								_html.push('<div class="col4">单价（元）</div>');
								_html.push('<div class="col5">可售数量（<em class="unit">'+pConfig.unit+'</em>）</div>\
											<div class="col6">'+isunit+'\
												<div class="col6-line">订购数量（<em class="unit">'+pConfig.unit+'</em>）</div>\
												<div class="col6-line"><input type="checkbox" class="select-same" id="select-same-checkbox"/><label for="select-same-checkbox">全部相同</label></div>\
											</div>');
								_html.push('<div class="col7">小计（元）</div>');
							_html.push('</div>')
						}else{
							_html.push('<div class="col56  fd-clr">');
								_html.push('<div class="col5">可售数量（<em class="unit">'+pConfig.unit+'</em>）</div>\
											<div class="col6">'+isunit+'\
												<div class="col6-line">订购数量（<em class="unit">'+pConfig.unit+'</em>）</div>\
												<div class="col6-line"><input type="checkbox" class="select-same" id="select-same-checkbox"/><label for="select-same-checkbox">全部相同</label></div>\
											</div>');
							_html.push('</div>')
						}	
					}
					//list part part
					_html.push('</div><ul class="sku-list">');	
					
					_fun(pInfo);
					_html.push('</ul>\
						<div class="stat-info">');
					if(pConfig.isMixed){
						_html.push('<div class="mixed-condition">该货品支持：<span class="icon-mixed"></span></div>');
					}		
					if(_isSpecPrice){
						_html.push('<div><span class="span-type-stat">该产品共计购买：<em class="total-type">0</em>种</span><span  class="span-money-stat">合计：<em class="money total-money">0.00</em>元</span></div>');
					}else{					
						_html.push('<div class="price-range">\
							合计：<span class="orange"><em class="total-amount">0</em>'+pConfig.unit+'*</span>\
							<div class="price-range-list">');
						for(var _i=0,_len=pConfig.priceRange.length;_i<_len;_i++){
							_priceinfo=pConfig.priceRange[_i];
							//如果有上限
							if(_i==0){
								_html.push('<dl class="fd-clr first-item price-selected"><dt>');
							}else{
								_html.push('<dl class="fd-clr"><dt>');
							}
							
							if(_priceinfo.qty_end){
								_html.push(_priceinfo.qty_begin+'-'+_priceinfo.qty_end+'&nbsp;'+pConfig.unit+':');
							}else{
								_html.push('≧'+_priceinfo.qty_begin+'&nbsp;'+pConfig.unit+':');
							}
							_html.push('</dt><dd>'+_priceinfo.price+'&nbsp;元/'+pConfig.unit+'</dd></dl>');
						}		
						_html.push('</div>\
							<span class="orange">=<em class="total-money">0.00</em>元</span>\
							</div>');	
					}
					_html.push('<div class="total-error-line"><span class="total-error"></span></div></div>');
										
					return _html.join('');
					
				},
				show:function(pdConfig){
					var _self=this,
						_config=$.extend({
							center:true,
							shim:true							
						},pdConfig);
					//没办法要保证dialog的function参数正确
					
					evalFunction(_config,'open');
					evalFunction(_config,'close');
					evalFunction(_config,'beforeClose');	
					$.use('ui-dialog', function(){
						//当没有展示的时候展示
						if (!_self.isShowed) {
							_self.isShowed = true;
							_self.getTheDom().dialog(_config);							
						}
					});
					return _self;
				},
				hide:function(){					
					if (this.isShowed && this.getTheDom().dialog) {
						this.getTheDom().dialog('close');
						this.isShowed = false;
					}
					return this;
				},
				setTitle:function(pTitle){
					var _dom=this.getTheDom();
					$('div.d-head h2',_dom).html(pTitle||'');
					return this;
				},
				setContent:function(pContent){
					var _dom=this.getTheDom();
					$('div.d-content',_dom).html(pContent||'');
					return this;
				},
				setFoot:function(pFoot){
					var _dom=this.getTheDom();
					if(pFoot){
						$('div.d-foot',_dom).html(pFoot).removeClass('no-content');
					}else{
						$('div.d-foot',_dom).html('').addClass('no-content');
					}
					
					return this;
				},
				/**
				 * 根据配置重新设定dialog的位置
				 * @param {Object} pConfig
				 */
				resetPosition:function(pConfig){
					var _dom,pstr,pos1,size1,size2,scollT;
					if(!pConfig.position){
						return;
					}
					_dom=this.getTheDom();
					pstr=pConfig.position; 
					pos1=pConfig.elementPos;
					size1=pConfig.elementSize;
					size2={
						width:_dom.width(),
						height:_dom.height()
					};
					scollT=jQuery(window).scrollTop();
					pConfig.dialogConfig=pConfig.dialogConfig||{};
					pConfig.dialogConfig.center=false;
					//按照先组件后对话框的顺序，例如left-left#bottom-bottom表示组件的左边和对话的左边，组件的下边和对话框的下边对齐
					
					switch(pstr){
						case 'center':	//居中
							pConfig.dialogConfig.css={
								'left':pos1.left+size1.width/2-size2.width/2,
								'top':pos1.top+size1.height/2-size2.height/2-scollT
							};
							break;
						case 'left-left#top-bottom':	//组件左边和对话框左边对齐，组件上边和对话框下边对齐
							pConfig.dialogConfig.css={
								'left':pos1.left,
								'top':pos1.top-size2.height-scollT
							};
							break;
						case 'left-left#bottom-top':	//组件左边和对话框左边对齐，组件下边和对话框上边对齐
							pConfig.dialogConfig.css={
								'left':pos1.left,
								'top':pos1.top+size1.height-scollT
							};
							break;
						case 'left-right#bottom-top':	//组件左边和对话框右边对齐，组件下边和对话框上边对齐
							pConfig.dialogConfig.css={
								'left':pos1.left-size2.width,
								'top':pos1.top+size1.height-scollT
							};
							break;
						case 'left-right#top-top':	//组件左边和对话框右边对齐，组件上边和对话框上边对齐
							pConfig.dialogConfig.css={
								'left':pos1.left-size2.width,
								'top':pos1.top-scollT
							};
							break;
						case 'left-right#bottom-bottom':	//组件左边和对话框右边对齐，组件下边和对话框下边对齐
							pConfig.dialogConfig.css={
								'left':pos1.left-size2.width,
								'top':pos1.top+size1.height-size2.height-scollT
							};
							break;
						case 'left-right#top-bottom':	//组件左边和对话框右边对齐，组件上边和对话框下边对齐
							pConfig.dialogConfig.css={
								'left':pos1.left-size2.width,
								'top':pos1.top-size2.height-scollT
							};
							break;
						case 'right-left#bottom-top':	//组件左边和对话框左边对齐，组件上边和对话框下边对齐
							pConfig.dialogConfig.css={
								'left':pos1.left+size1.width,
								'top':pos1.top+size1.height-scollT
							};
							break;
						case 'right-left#top-top':	//组件左边和对话框左边对齐，组件上边和对话框下边对齐
							pConfig.dialogConfig.css={
								'left':pos1.left+size1.width,
								'top':pos1.top-scollT
							};
							break;
						case 'right-left#bottom-bottom':	//组件左边和对话框左边对齐，组件上边和对话框下边对齐
							pConfig.dialogConfig.css={
								'left':pos1.left+size1.width,
								'top':pos1.top+size1.height-size2.height-scollT
							};
							break;
						case 'right-left#top-bottom':	//组件左边和对话框左边对齐，组件上边和对话框下边对齐
							pConfig.dialogConfig.css={
								'left':pos1.left+size1.width,
								'top':pos1.top-size2.height-scollT
							};
							break;
						case 'right-right#bottom-top':	//组件左边和对话框左边对齐，组件上边和对话框下边对齐
							pConfig.dialogConfig.css={
								'left':pos1.left+size1.width-size2.width,
								'top':pos1.top+size1.height-scollT
							};
							break;
						case 'right-right#top-bottom':	//组件左边和对话框左边对齐，组件上边和对话框下边对齐
							pConfig.dialogConfig.css={
								'left':pos1.left+size1.width-size2.width,
								'top':pos1.top-size2.height-scollT
							};
							break;
						default:
							pConfig.dialogConfig.center=true;
							break;
					};
					
					return this;
				},
				/**
				 * 增加普通offer到进货单
				 * @param {Object} pConfig
				 */
				addNormalToPurchase:function(pConfig){
					pConfig=pConfig||{
						params:{},
						beforeSubmit:null,
						success:null,
						error:null
					};

					$.ajax({
						url:addPurchaseUrl,
						dataType:'jsonp',
						data:pConfig.params,
						beforeSend:function(){
							if('function'===typeof pConfig.beforeSubmit){
								pConfig.beforeSubmit();	 
							}
						},
						success:function(o){
							if('function'===typeof pConfig.success){
								pConfig.success(o);	 
							}
						},
						error:function(o){
							if('function'===typeof pConfig.error){
								pConfig.error(o);	 
							}
						}
					});
				},
				/**
				 * 增加到进货单
				 * @param {Object} pConfig
				 * {
				 *		params:{},
				 *		beforeSubmit:function(){},
				 *		success:function(o){},
				 *		error:function(o){}
				 *	};
				 */
				addToPurchase:function(pConfig){
					var $dom=this.node,
						$proxy=$('div.batch-add-sku',$dom),				 
		            	$form ,
						$iframe,
	//					fileStatus = [],
	//					fileId,
	//					fileName,
	//	                params = {
	//	                    'type': 'offer',
	//	                    'cargoIdentity': this.offerId,
	//	                    'specData': JSON.stringify(this.skuBatchSpecData),
	//	                    'returnType': 'url',
	//	                    '_csrf_token': this._csrf_token,
	//	                    't': $.now()
	//	                },
		                that = this;
					pConfig=pConfig||{
						params:{},
						beforeSubmit:null,
						success:null,
						error:null
					};
					if($proxy.length<1){
						$proxy = $('<div>', {
		                    'class': 'batch-add-sku'
		                }).appendTo($dom).html('<form action="' + addPurchaseUrl + '" method="post" target="proxyforpurchase"></form><iframe width="0" height="0" frameborder="0" name="proxyforpurchase" src="about:blank"></iframe>');
						
						//绑定事件
						$('iframe', $proxy).bind('load', function(e){
							var _o;
			                try {
			                    if (this.contentWindow.location.href === 'about:blank' || this.contentWindow.location.host !== location.host) {
			                        return;
			                    } else {
			                        _o = $.unparam(this.contentWindow.location.href);
			                        if('function'===typeof pConfig.success){
										pConfig.success(_o);	 
									}
			                    }
			
			                } catch (ev) {
			                    if('function'===typeof pConfig.error){
									pConfig.error(ev);	 
								}
			                }
							//销毁该iframe防止多次加载
							$proxy.remove();
			            });
					}				
					$form = $('form', $proxy);
					$iframe = $('iframe', $proxy);					
		            
					for (var p in pConfig.params) {
		                if (hasOwn.call(pConfig.params, p)) {
		                    var input = $('<input>',{
		                        'type': 'hidden',
		                        'name': p,
		                        'value': pConfig.params[p]
		                    });
		
		                    $form.append(input);
		                }
		            }
					if('function'===typeof pConfig.beforeSubmit){
						pConfig.beforeSubmit();	 
					}
					          
		            $form.submit();
				},
				/**
				 * 展示加入进货单之后的信息
				 * @param {String} pAction success/failure/othererror
				 * @param {Object} pResult {}
				 */
				showAddPurchaseMsg:function(pAction,pResult,pConfig){
					var _self=this,
						$html=[],
						$iknow='<div class="fd-clr"><a href="#" class="purchase-button fd-right close" title="知道了"><em>知道了</em></a></div>',
						$button='<div><a href="'+viewPurchaseUrl+'" class="purchase-button purchase-button-o view-purchase" title="查看进货单"><em>查看进货单</em></a><a href="#" class="purchase-button close" title="继续购物"><em>继续购物</em></a></div>';
					pAction=pAction||'default';
					pResult=pResult||{};

					switch(pAction){
						case 'success':
							_self.setTitle('添加成功');
                            if(pConfig && pConfig.promotionSwitch){
                                $html.push('<div class="d-promotion-wrap">');
                            }
							$html.push('<div class="add-purchase-info add-ok">');
							$html.push('<h3>货品已添加成功！</h3>');
							$html.push('<div  class="sub-info">当前进货单共<strong class="orange">'+pResult.quantity+'</strong>种货品</div>');
                            $html.push(_self.checkLogin());
                            //$html.push($button);		
 							$html.push('</div>');											
                            if(pConfig && pConfig.promotionSwitch){
                                $html.push(_self.promotion1118());
                                $html.push('</div>');											
                            }
							break;
						case 'morethan':
							_self.setTitle('添加失败');
							$html.push('<div class="add-purchase-info add-error">');
							$html.push('<h3>您的进货单货品数量已达上限！</h3>');
							$html.push('<div  class="sub-info">您进货单中的产品种类为'+pResult.quantity+'种，最多可再购买'+(100-pResult.quantity)+'种。</div>');
							$html.push($button);		
							$html.push('</div>');				
							break;
						case 'failure':
							_self.setTitle('添加失败');
							$html.push('<div class="add-purchase-info add-warn">');
							$html.push('<h3>'+pResult.msg+'</h3>');
							switch(pResult.code){
								case 'PURCHASE_OVER_FLOW_ERROR':
									$html.push('<div class="sub-info">您进货单中的产品种类为100种，已达到上限。</div>');
									$html.push($button);
									break;
								
								default:
									$html.push($iknow);	
									break;
							}
							//$html.push('<div>进货单共'+pResult.quantity+'种货品<span class="total-cal">合计：<em class="money">'+pResult.total+'</em>元</span></div>');
								
							$html.push('</div>');	
							break;
						case 'begin':
							_self.setTitle('添加中...');
							$html.push('<div class="loading"><img src="http://img.china.alibaba.com/cms/upload/2012/120/733/337021_1070828466.gif"/>货品提交中，请稍后...</div>');
							
							break;						
						case 'othererror':						
						case 'default':
							_self.setTitle('添加失败');
							$html.push('<div class="add-purchase-info add-warn">');
							$html.push('<h3>抱歉，服务器暂时不可用，请稍后再试</h3>');
							//$html.push('<div>进货单共'+pResult.quantity+'种货品<span class="total-cal">合计：<em class="money">'+pResult.total+'</em>元</span></div>');
							$html.push($iknow);		
							$html.push('</div>');	
							break;
					}
					
					_self.setContent($html.join(''));	
					_self.setFoot('');
					return _self;
					
				},
				/**
				 * 根据登陆情况输出相应的代码
				 */
				checkLogin:function(){
					var _result='',
						_loginurl=(FE.test['style.loginchina.url']||'https://login.1688.com')+'/member/signin.htm?Done='+encodeURIComponent(window.location.href),
						_button='<div>\
									<a href="'+viewPurchaseUrl+'" class="purchase-button purchase-button-o view-purchase" title="查看进货单"><em>查看进货单</em></a>\
									<a href="#" class="purchase-button close" title="继续购物"><em>继续购物</em></a>\
								</div>',
						isLogin=FE.util.IsLogin();
					if(!isLogin){
						_result='<div class="login-tips-info">您还未登录，货品只能保存6个小时，\
								<a class="login" href="'+_loginurl+'" target="_self" title="点击登录">登录</a>后永久保存</div>';
						_result+='<div>\
									<a href="'+_loginurl+'" class="purchase-button purchase-button-o login" title="登录"><em>登录</em></a>\
									<a href="'+viewPurchaseUrl+'" class="purchase-button view-purchase" title="去进货单结算"><em>去结算</em></a>\
									<a class="close" href="#" target="_self" title="继续购物">继续购物</a>\
								</div>';
					}else{
						_result=_button;
					}
					return _result;
				},
                /**
                 * 大促展示抽奖html
                 */
                promotion1118 : function (){
                    var html = '<div class="lottery-wrap">\
                                <a class="btn-lottery" href="#">开始抽奖</a>\
                                <p class="lottery-desc">（红包、物流券等你拿！）</p>\
                                <p class="lottery-warning">抽红包需绑定支付宝</p>\
                            </div>';

                    return html;
                },
				/**
				 * @param {Object} pConfig {offerId,callback}
				 */
				getOfferInfo:function(pConfig){
					var _config=pConfig||{"offerId":'','success':null};
					
					$.ajax({
						url:getOfferInfoUrl,
						dataType:'jsonp',
						data:{'offer_id':_config.offerId},
						success:function(o){
							if('function'===typeof pConfig.success){
								pConfig.success(o);
							}
						},
						beforeSend:pConfig.beforeSend,
						error:function(o){
							if('function'===typeof pConfig.error){
								pConfig.error(o);
							}
						}
					});
				},
				/**
				 * tracelog打点
				 * @param {String} pStr
				 */
				doAliclick:function(pStr){
					aliclick(null,'?tracelog='+pStr);
				}
			};
		_Offer.prototype={
			/**
			 * 获取信息
			 * @param {Function} callback
			 */
			setConfig:function(o){
				var _self=this;
				$.extend(_self.config,{
					'msg':o.msg||'',
					'unit':o.unit||'',
					'isSku':o.is_sku_offer||false,
					'priceType':o.sku_price_type||'spec',
					'priceRange':o.price_info||[],
					'priceIndex':0,	//当前价格的索引
					'isMixed':o.is_mix_sale||false,					
					'remainAmount':o.remain_qty||0,
					'minAmount':o.least_qty||1,
					'specInfo':o.spec_names||[],
					'sellUnit':o.sell_unit||null,//销售单位
					'scale':o.scale||null,//销售单位数量
					'price':0.00,	//如果是普通offer则为其单价，否则无意义
					'num':0,		//如果是普通offer则是其数量，若为sku则为总数量
					'totalMoney':0.0,	//如果是普通offer则为其合计，若为sku则为合计金额
					'isChecked':false,
					'selectedAmount':0	//选中的商品种类，改变数量的时候需要更新
				});
				if(!_self.config.isSku&&!_self.config.msg){
					_self.setNum([],_self.config.minAmount);
				}
				_self._setSpecInfo(o.sku_info||{});				
			},
			/**
			 * 获取部分属性
			 */
			getConfig:function(){
				return this.config;
			},
			/**
			 * 遍历所有的对象，执行函数
			 * @param {Array} pArray
			 * @param {Function} callback
			 */
			_eachObj:function(pArray,callback){
				var _self=this,
					_len=pArray.length,
					_i=0;
				for(;_i<_len;_i++){
					if(callback&&'function'===typeof callback){
						callback.call(_self,pArray[_i],_i);
					}
				}		
			},
			/**获取价格，一定是在设置了价格之后
			 * 而价格的变化只有数量的变化
			 * @param {Int} pIndex 索引	 
			 */
			getPrice:function(pIndex){
				var _config=this.config,
					_temp=_config;
				if(_config.isSku&&pIndex!==undefined){
					_temp= this._getSpecInfo(pIndex);				
				}
				return _temp.price;
			},
			/**
			 * 获取总价
			 * @param {Int} pIndex 索引
			 */
			getTotalMoney:function(pIndex){			
				var _config=this.config,
					_temp=_config;
				
				//如果是sku并且限定了要某一个的金额
				if(_config.isSku&&pIndex!==undefined){
					_temp=this._getSpecInfo(pIndex);
				}
				return _temp.totalMoney;
			},
			/**
			 * 设置价格和总价
			 * @param {Int} pIndex 索引	 
			 */
			_setPrice:function(pIndex){
				var _config = this.config,				
					_getPrice = function(num){
						var _num = num || 0, 
							_priceRange = _config.priceRange ||[{'qty_begin': 1,'price': 0.01}], 
							_result = {'price':0,'index':0},
							_tempprice;
						//还有一种情况就是num小于最小起批量或者最小一个区间的数量时，所以需要设置一个默认的值
						_result.price = _priceRange[0].price;
						_result.index=0;
						
						for (var i = 0, len = _priceRange.length; i < len; i++) {
							_tempprice = _priceRange[i];
							if (num >= (_tempprice.qty_begin || 1)) {
								_result.price = _tempprice.price || 0.01;
								_result.index=i;
							}
						}
						
						return _result;
					},
					_priceinfo,
					_num;
						
				//区分明细offer
				if(_config.isSku){				
					//按报价方式
					switch(_config.priceType){
						case 'range':						
							_num=this.getAmount();
							_priceinfo=_getPrice(_num);
							this._eachObj(this.sku,function(item){
								item['price']=_priceinfo.price;
							});
							_config.price=_priceinfo.price;
							_config.priceIndex=_priceinfo.index;						
							break;
						default:
							break;
					}
					return;					
				}else{ //普通offer只需要修改自己的就可以了
					_priceinfo=_getPrice(_config.num);
					_config.price=_priceinfo.price;
					_config.priceIndex=_priceinfo.index;
					
				}
			},
			/**
			 * 更新所有的金额
			 */
			_updateMoney:function(){
				var _config=this.config,				
					_all=0;
				if(_config.isSku){				
					this._eachObj(this.sku,function(item){
						item['totalMoney']=item['num']*item['price'];
						_all+=item['totalMoney'];
					});
					//_updateSpecMoney(_sku);
					_config.totalMoney=_all;				
				}else{
					_config.totalMoney=_config.num*_config.price;
				}
			},
			/***
			 * 获取所有种类
			 */
			getSelectedAmount:function(){
				return this.config.selectedAmount;
			},
			/**
			 * 更新种类数量
			 * @param {String} pAction
			 */
			_setSelectedAmount:function(pAction){
				switch(pAction){
					case 'minus':
						this.config.selectedAmount-=1;
						break;
					case 'plus':
						this.config.selectedAmount+=1;
						break;
					default:
						break;
				}			
			},
			/**
			 * 设置数量
			 * @param {Int} pIndex 索引
			 * @param {Int} pNum
			 */
			setNum:function(pIndex,pNum){
				var _config=this.config,
					_oldnum=_config.num,
					_diff=0,
					temp;
				pNum=pNum||0;
				if(_config.isSku&&pIndex!==undefined){
					temp=this._getSpecInfo(pIndex);
					_config.num=_config.num-temp.num+pNum*1;				
					temp.num=pNum;
				}else{
					_config.num=pNum;
				}
				//更新价格和总价
				this._setPrice(pIndex);
				this._updateMoney();
				//当总数量变小，并且最新设置为0则是减少一个，当总数量增加的数量和设置的值相等则是加一个
				_diff=_config.num-_oldnum;
				if(_diff<0&&pNum==0){
					this._setSelectedAmount('minus');
				}else if(_diff>0&&_diff==pNum){
					this._setSelectedAmount('plus');
				}
			},
			/**
			 * 检测最小起批量
			 * @param {Int} pIndex 索引
			 * @param {Object} pNum
			 */
			checkMinAmount:function(pIndex,pNum){
				var _config=this.config,
					_num;				
				//如果支持混批直接返回true
				if(_config.isMixed){
					return true;
				}
				if(_config.isSku){
					_num=this.getAmount();
					if(pIndex!==undefined&&pNum!==undefined){
						_num=_num-this._getSpecInfo(pIndex).num+pNum;
					}
					return _num>=_config.minAmount;
				}else{
					return pNum>=_config.minAmount;
				}
			},
			/**
			 * 最大可售数量
			 * @param {Int} pIndex 索引
			 * @param {Object} pNum
			 */
			checkMaxAmount:function(pIndex,pNum){
				var _config=this.config,
					_spec;
				pIndex=pIndex||0;
				pNum=pNum||0;
				//如果是SKU
				if(_config.isSku){
					_spec=this._getSpecInfo(pIndex);
					return pNum<=(_spec.remainAmount||0);				
				}else{//普通offer
					return pNum<=_config.remainAmount;
				}
			},
			/**
			 * 获取重量
			 * @param {Int} pIndex 索引
			 */
			getSpecAmount:function(pIndex){				
				if(pIndex!==undefined){
					return this._getSpecInfo(pIndex).num;					
				}else{
					return this.getAmount();
				}
			},
			/**
			 * 获取总量
			 */
			getAmount:function(){
				return this.config.num;			
			},
			/**
			 * 设置选中与否，其实这个不一定使用，因为具体指示在视图层的控制而已
			 * @param {Bool} pIschecked
			 * @param {Int} pIndex 索引
			 */
			setChecked:function(pIschecked,pIndex){
				var _config=this.config,
					_temp;
				pIschecked=pIschecked||false;
				pIndex=pIndex||0;
				if(_config.isSku){
					_temp=this._getSpecInfo(pIndex);				
				}else{
					_temp=_config;	
				}
				_temp.isChecked=pIschecked;			
			},
			/***
			 * 添加到进货单
			 * @param {Array} pList
			 * eg:[{pIndex,pNum}]
			 */
			addPurchase:function(pList){
				
			},
			/**
			 * 设置初始化sku信息，为了防止以后的变更，统一对后端数据进行重新处理封装
			 * @param {Object} pSku
			 */
			_setSpecInfo:function(pSku){
				var _config=this.config,
					_result=[],					
					copyObject=function(pArray,pPath){
						var	_temp,
							_tempitem,
							_tempchildren,
							_len,
							_path;
						pArray=pArray||[];
						pPath=pPath||[];
						_len=pArray.length						
						while(_len){
							--_len;
							_temp=pArray[_len];
							_tempchildren=_temp.children;
							_path=copyArray(pPath);
							_path.push(_temp.name);
							if(_tempchildren&&_tempchildren.length){								
								copyObject(_tempchildren,_path);
							}else{
								_tempitem = {
									'path':_path,
									'name':_temp['name'],
									'specId': _temp['spec_id'] || '',
									'remainAmount':_temp['remain_qty']||0,
									'price':_temp['price']||0.01,
									'num':0,
									'isChecked':false,
									'totalMoney':0.00
								};
								_result.unshift(_tempitem);
							}
						}						
					};
				_config.specInfo=pSku.spec_names||[];
				copyObject(pSku.skus);
				this.sku=_result;
			},
			/**
			 * 获取所有数量信息为提交数据
			 */
			getAllSpecInfo:function(){
				var _sku=this.sku,
					result=[];
				this._eachObj(_sku,function(item,index){
					if(item.num>0){
						result.push({
							'specId':item.specId,
							'amount':item.num
						});
					}
				});
				return result;
			},
			/**
			 * 将spec信息字符串化
			 * @param {Array} pSpec
			 */
			specArrayToString:function(pSpec){					
				var result=[];
				pSpec=pSpec||[];
				if(window.JSON){
					return JSON.stringify(pSpec);
				}
				
				result.push('[');
				for(var i=0,len=pSpec.length;i<len;i++){
					result.push('{"specId":"'+pSpec[i].specId+'","amount":'+pSpec[i].amount+'}');
				}
				result.push(']');
				return result.join('');
			},
			/**
			 * 获取specinfo
			 * @param {Int} pIndex 索引
			 */
			getSpecInfo:function(pIndex){
				var _config=this.config;								
				if(_config.isSku){
					return this._getSpecInfo(pIndex);
				}else{
					return this.getConfig()
				}	
				
			},
			_getSpecInfo:function(pIndex){
				var _sku=this.sku;
				return _sku[pIndex]||_sku;
			}
		};
	switchURL();
	SYS.purchaselist={
		'Offer':Offer,
		'Controller':Controller,
		'View':Dialog,
		'Util':{
			'evalFunction':evalFunction
		}
	};		
})(jQuery, FE.sys);
                        /*大促抽奖*/
