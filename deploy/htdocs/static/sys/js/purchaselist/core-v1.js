/**
 * ȫվͨ�ü�����������
 * updated by ginano@20120603
 * data-purchase='' ��������Ҫ�����ݺ�����
 * ������ΪofferId��������԰�������
 * <a href="#" data-purchase='{"offerId":"1455442","onSuccess":"callback","onShow":"showback"}'>���������</a>
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
							 		<h2>����ѡ��</h2>\
									<div class="close"></div>\
							 	</div>\
								<div class="d-body">\
									<div class="d-content">\
									</div>\
									<div class="d-foot fd-clr">\
									</div>\
								</div>\
							</div>',
				normalButton:'<a href="#" class="purchase-button purchase-button-y confirm"><em>ȷ&nbsp;&nbsp;��</em></a>\
						<a href="#" class="purchase-button purchase-button-g close"><em>ȡ&nbsp;&nbsp;��</em></a>',
				initialContent:'<div class="add-purchase-info add-ok"><h3>��Ʒ��Ϣ������...</h3><div class="sub-info">��Ʒ��Ϣ�����У����ڳ�ʼ��������</div><div><a href="#" class="purchase-button" title="��֪����"><em>��֪����</em></a></div></div>'
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
			 * ת���ַ���Ϊ������������html���ö�ȡ��Ȼ��ת��Ϊ����
			 * ���͵�Ӧ�ó���
			 * evalFunction(config,'onSuccess',o);
			 * add by ginano@20120603
			 * @param {Object} object ��Ҫ�������ת�ƵĶ���eg:window
			 * @param {String} funcName ת�ƾ������Ժ�������myfunctionname
			 * @param {Object} args �������ò���������Ҫ������ִ�е�
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
								//Ĭ��4������
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
			 * ǳ�ж϶���
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
			nowOffer={}, //�洢��ǰ��Offer����
			//�洢���е�Offer�б�
			OFFERLIST=[],
			/**
			 * �½�һ��offer����Ӧ����Offer('ddd'),������new
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
			 * OFFER ����
			 * @param {String} pOfferId
			 */
			_Offer=function(pConfig){			
				this.offerId=pConfig.offerId;
				//�޸����ò���Ҫ���浽�ڵ�֮��,Ϊ�˷�ֹһ��offer�����ж���������
				this.config=$.extend({},pConfig);
				this.sku={};			
			},
			/**
			 * �漰�߼����ƵĿ�����
			 */
			Controller={			
				/**
				 * ÿ��ʹ��ʱ��Ҫ��ʼ��			 
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
				 * �༭����
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
							//�������������Ǵ���1������								
							$input.val(0);
							msg.push('less0');
							_view.showMsg($input,msg,pIsBatch);	
							//console.log('less than 0');							
							return;
						}
						if(!_model.checkMaxAmount(_specinfo,val)){
							//��������������
							val=_old.remainAmount;
							msg.push('�˻�Ʒ���ɹ�����Ϊ'+val+_model.config.unit);
							//console.log('maxed');	
						}
						//�޸�������ʱ��У����С������
	//					if(!_model.checkMinAmount(_specinfo,val)){
	//						//��������С������
	//						//val=_old.num;
	//						msg.push('�˻�Ʒ��С����Ϊ'+_config.minAmount+_model.config.unit);
	//					}
						//$input.val(val);
						//��ʱ�漰���������ı������Ҫ���¸��¼۸���ܼ�,��ʱ_old�Ѿ�������
						_model.setNum(_specinfo,val);
						//console.log('set val:'+val);	
						//console.log('-----------------end--------');
						_view.updateLiInfo($input,val,_old.totalMoney);
						_view.updateTotalInfo(_model.getConfig());					
						_view.showMsg($input,msg,pIsBatch);
						//�޸������У��һ��
						this.checkAmount();					
					}else{
						//console.log('not pass');
						$input.val(_old.num);
					}
				},
				/**
				 * У������
				 * @param {Bool} pIsShow �Ƿ�չʾ����
				 */
				checkAmount:function(pIsShow){
					var _model=this.model,
						_view=this.view,
						_num=_model.getAmount(),
						_config=_model.getConfig();
					//У���������Ƿ񳬹���100
					if(_config.selectedAmount>100){
						_view.showTotalError('������Ĳ�Ʒ����Ϊ'+_config.selectedAmount+'�֣��ѳ������100�ֵ����ޣ�����ٶ������ࡣ');
						return false;
					}
					//У��������
					if(_num>0){
						//ǿ��У����Сֵʱ�����֧�ֻ�����ҪУ����Сֵ��
						if(pIsShow&&!_model.checkMinAmount(undefined,_num)){
							_view.showTotalError('�˻�Ʒ��С����Ϊ'+_config.minAmount+_config.unit);
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
				 * ��ӵ�������
				 */
				addToPurchase:function(){
					var _view=this.view,
						_model=this.model,
						_modelConfig=_model.getConfig(),
						_config={
							success:function(o){
								//ֻ��������չʾ��ʱ���չʾ����Ϣ
								if (_modelConfig.isShowSuccess!==false) {
									if (o.success === 'true' || o.success === true) {

										//����Ϊֻ��������չʾ�ɹ�����ʱ��չʾ��Ĭ��չʾ��
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
								//�������ʱ���ɴ˴���
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
                                'needTotalPrice':false,//�Ƿ���Ҫչʾ�ܼ۸�
                                'promotionSwitch' : _model.config.promotionSwitch || false,//��ٿ��� 
								't':$.now() 
							};
							_view.addToPurchase(_config);
						}else{
							_config.params={
								'type':'offer',
								'cargoIdentity':_model.offerId,
								'quantity':_model.getAmount(),
                                'needTotalPrice':false,//�Ƿ���Ҫչʾ�ܼ۸�
                                'promotionSwitch' : _model.config.promotionSwitch || false,//��ٿ��� 
								'returnType':'json'
							};
							_view.addNormalToPurchase(_config);
						}
						
					}else{
						return false;
					}
					
				},
				/**
				 * ����һ���ӿڳ���
				 * @param {String} pNum
				 * @param {String} pIndex
				 */
				setNum:function(pNum,pIndex){
					var pIndex=pIndex||[];
					this.model.setNum(pIndex,pNum);
					return this;
				},
				/**
				 * ����Ĭ�����ò���PdҪ���
				 * @param {Object} pConfig
				 */
				setDefaultConfig:function(pConfig){
					if(!pConfig){
						return;
					}
					//Ĭ����ͨofferֱ�Ӽ��룬���Խ���isAutoAdd����
					if(!pConfig.isSku&&pConfig.isAutoAdd!==false){
						pConfig.isAutoAdd=true;
					}
				},
				//��ȡoffer��Ϣ
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
								//��ʼ��ui������λ��
								_view.initialUI();									
								
								//����Ĭ������
								_self.setDefaultConfig(__config);
								//չʾ֮ǰ�Ļص�
								evalFunction(__config,'onShow',__config);
								//���ֱ�Ӽ��������
								if(__config.isAutoAdd && o.success && (o.msg===undefined||o.msg==='')){
									//ֻ�гɹ��˲�ִ��									
									_self.addToPurchase();									
								}else{
									//��ʼ��UI
									_view.init(_model);	
									_view.resetPosition(__config);								
									_view.show(__config.dialogConfig);
								}														
							},
							'beforeSend':function(){
								_view.hide();
							},
							'error':function(o){
								//������������
							}
						};
					_view.getOfferInfo(_config);
				},
				/**
				 * ���
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
			 * ��ͼdom����
			 */
			Dialog={
				node:{},			
				isInit:false,	//�Ƿ��ʼ����
				isShowed:false,	//Ŀǰ��չʾ��ô
				getTheDom:function(){
					return this.node.length?this.node:this.node=$(htmlTemplate.normalDialog).appendTo($('body'));
				},
				//��ʼ��Ӧ��������ɻ�����html�ṹ��
				/**
				 * ��ʼ��Ӧ��������ɻ�����html�ṹ��
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
					_title='��ѡ��������';
					//������Ϣ��д�б���Ϣ					
					if(_config.isSku){
						//skuoffer�µ�
						_content=_self.generateList(_config,_sku);
						if(_config.priceType==='range'){
							_dom.addClass('sys-purchaselist-small');
						}					
					}else if(_config.msg){
						//����offer
						_content=_self.generateError(_config.msg);
						_foot='';
						_title='ϵͳ��Ϣ';
						_dom.addClass('sys-purchaselist-error');
					}else{
						//Ĭ��Ϊ��ͨoffer
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
				 * ��ʼ��UI���棬ִֻ��һ��
				 */
				initialUI:function(){
					var _self=this,
						_dom=_self.getTheDom();
					
					if(!_self.isInit){										
						_dom.delegate('.close','click',function(e){
							e.preventDefault();
							_self.hide();
						})

                        /*��ٳ齱*/
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

                            //ѡ��ĳ��
                            .delegate('li.sku-item-notsel','click',function(){
                                //ֻ���û��ѡ�е���Ŀӵ��
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
                            //ѡ��һ��
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
                            //ѡ��ĳһ����click�¼���ֹ
                            .delegate('input.select-one','click',function(e){
                                e.stopPropagation();
                                //return false;
                            })
                            //ȫѡ
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
						//�����޸�
						.delegate('input.amount-input','keyup',function(){						
							Controller.editAmount($(this));						
						})
						//�Ӽ�����
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
						
						//��ͬ����
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
						//ȷ�ϼ��������
						.delegate('a.confirm','click',function(e){
							e.preventDefault();
							Controller.addToPurchase();
							Controller.doAliclick('sys_purchaselist_confirm');
						})
						//�鿴������
						.delegate('a.view-purchase','click',function(e){
							e.preventDefault();
							FE.util.goTo($(this).attr('href'),'_blank');
							_self.hide();
						});
						_self.isInit=true;
					}
					_dom.removeClass().addClass('sys-purchaselist');
					_self.setTitle('ϵͳ��Ϣ');
					_self.setContent(htmlTemplate.initialContent);	
					_self.setFoot('');
					return _self;
				},
				/**
				 * ���¼۸���ܼۡ�����
				 * @param {Object} pConfig
				 */
				updateTotalInfo:function(pConfig){
					var $bar=this.node.find('div.stat-info'),
						_typeCal=$bar.find('em.total-type'),
						_moneyCal=$bar.find('em.total-money'),
						_amountCal=$bar.find('em.total-amount'),
						_priceList=$bar.find('div.price-range-list'),
						_priceLine;
					//��������
					if(_typeCal.length){
						_typeCal.html(pConfig.selectedAmount);
					}
					//�����ܼ�
					if(_moneyCal.length){
						_moneyCal.html(pConfig.totalMoney.toFixed(2));
					}
					//��������
					if(_amountCal.length){
						_amountCal.html(pConfig.num);
					}
					//���¼۸�
					if(_priceList.length){
						_priceLine=_priceList.find('dl');
						_priceLine.removeClass('price-selected');
						_priceLine.eq(pConfig.priceIndex).addClass('price-selected');
						//.html(pConfig.totalMoney);
					}
				},
				/**
				 * �����������ܼ�
				 * @param {Object} pInputObj
				 * @param {Object} pVal�����������ʾ��
				 * @param {String||Int} pMoney ���ڽ���
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
				 * ��ȡ��һ����ȷ�������ͷ��ض���
				 */
				getFirstValue:function(){
					var $dom=this.node,
						$lis=$dom.find('li.sku-item-selected'),
						$inputs=$lis.find('input.amount-input'),							
						_temp={
							amount:0,	//��һ����������
							els:$inputs	//���е�inputԪ��							
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
				 * ��������jqueyr�����ȡ��Ӧ��spec��Ϣ
				 * @param {Object} htmlObj
				 * @return [['��ɫ','M'],['��ɫ','M']]
				 */
				getSpecPath:function(htmlObj){
					return htmlObj.closest('li.sku-detail-item').data('index')||0;
				},
				/**
				 * ͳ����Ϣ��չʾ
				 * @param {String} pMsg
				 */
				showTotalError:function(pMsg){
					pMsg=pMsg||'';
					var ErrorMsg={
						'noselected':'������������Ϊ����0������',
						'default':'δ֪����'
					},
					$tips=this.node.find('span.total-error');
					if(pMsg){
						$tips.html(ErrorMsg[pMsg]||pMsg).show();
					}else{
						$tips.hide();
					}				
				},
				/**
				 * չʾ���������Ϣ
				 * @param {Object} pInputObj $('input')
				 * @param {Object} pMsg ['errorCode']
				 */
				showMsg:function(pInputObj,pMsg,isBatch){
					pInputObj=pInputObj||{};
					pMsg=pMsg||[];
					isBatch=isBatch||false;
					var msg,tips,pdiv,timer,
						ErrorMsg={
							'less0':'������������Ϊ����0������',		//С��0
							'maxerror':'���ֵУ�鲻ͨ��',	//���ֵУ�鲻ͨ��
							'mineroor':'��СֵУ�鲻ͨ��',	//��СֵУ�鲻ͨ��
							'default':'��������'	//��������
						};
					if(pInputObj.length&&pMsg.length){
						//Ŀǰֻ��ʾ���һ����
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
				 * �ж��б�ĸ߶��Ƿ������չʾ�������ĸ߶�
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
				 * ѡ�����
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
				 * �ж��Ƿ����еĶ�ѡ����
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
				 * չʾ������Ϣ
				 * @param {String} pErrorMSG
				 */
				generateError:function(pErrorMSG){
					var $html=[];												
					$html.push('<div class="add-purchase-info add-warn">');
					$html.push('<h3>'+(pErrorMSG||'ϵͳ�������Ժ����ԡ�')+'</h3>');							
					$html.push('<div class="text-right"><a href="#" class="purchase-button  close" title="֪����"><em>֪����</em></a></div>');		
					$html.push('</div>');							
							
					return $html.join('');
				},
				/**
				 * ���ݴ����offer����������ͨoffer��html��ǩ
				 * @param {Object} pConfig
				 */
				generateNormal:function(pConfig){
					pConfig=pConfig||{};
					var _html=[];
					_html.push('<div class="normal-offer">');
					if(pConfig.isMixed){
						_html.push('<div class="mixed-condition">�û�Ʒ֧�֣�<span class="icon-mixed"></span></div>');
					}
					_html.push('<div class="input-line">��Ҫ������<span class="input-span">\
									<input class="amount-input" type="input" value="'+pConfig.minAmount+'"/>\
									<a class="arrow plus arrow-plus " title="��һ" href=""></a>\
									<a class="arrow minus arrow-minus "  title="��һ" href=""></a>\
								</span>'+pConfig.unit+'<span class="gray">������������'+pConfig.remainAmount+pConfig.unit+'��</span></div>');
					_html.push('<div class="stat-info"><span class="total-error"></span></div>');
					_html.push('</div>');
					return _html.join('');
				},
				/**
				 * ���ݴ����offer��Ϣ���ɲ�ͬ��html��ǩ
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
//								//���Ϊͬһ���ڵ�,���ҿ��Խ���ж��Ƿ�Ϊ��һ���ڵ�
//								if(_is2&&equalArray(_path,_temppath)){									
//									if(_i===_len-1){
//										_islast=true;
//									}else{
//										if(!equalArray(_path,_obj[_i+1].path.slice(0,-1))){
//											_islast=true;
//										}
//									}									
//								}else{
								//�����һά����Ҫÿ����Ⱦ�����߶�ά�еĵ�һ��
								if(!_is2||!equalArray(_path,_temppath)){
									//��һ���ڵ�
									_path=_temppath;
									_isfirst=' first-item ';
									_html.push('<li class="sku-item sku-item-notsel  fd-clr">');
									_html.push('<div class="col1"><input type="checkbox" class="select-one"/></div>');
									_html.push('<div class="col2">'+_temp.path[0]+'</div>');
									//�Ƿ��Ƕ�ά��
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
								_html.push('<a class="minus" title="��һ" href="#">-</a>');
								_html.push('<input type="text" class="amount-input " disabled="true"/>');
								_html.push('<a class="plus" title="��һ" href="#">+</a>');
								_html.push('</div>');
								if (_isSpecPrice) {
									_html.push('<div class="col7">0.00</div>');
								}
								_html.push('</li>');
								
								//�����һά�ڵ�ʼ�������һ���ڵ���бպϣ����ڶ�ά������Ҫ�ж�����Ϊ���һ������������һ����·�������ٵ�·����һ��
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
						isunit='<div class="col6-tips"><span class="col6-tips-span">����Ʒ��'+pConfig.sellUnit+'������'+pConfig.scale+pConfig.unit+'����1'+pConfig.sellUnit+'</span></div>';
					}
					
					if (_is2) {
						if(_isSpecPrice){
							_html.push('<div class="col34567 fd-clr">');
								_html.push('<div class="col3">' + _is2 + '</div>');
								_html.push('<div class="col4">���ۣ�Ԫ��</div>');
								_html.push('<div class="col5">����������<em class="unit">'+pConfig.unit+'</em>��</div>\
											<div class="col6">'+isunit+'\
												<div class="col6-line">����������<em class="unit">'+pConfig.unit+'</em>��</div>\
												<div class="col6-line"><input type="checkbox" class="select-same" id="select-same-checkbox"/><label for="select-same-checkbox">ȫ����ͬ</label></div>\
											</div>');
								_html.push('<div class="col7">С�ƣ�Ԫ��</div>');
							_html.push('</div>')
						}else{
							_html.push('<div class="col356 fd-clr">');
								_html.push('<div class="col3">' + _is2 + '</div>');
								_html.push('<div class="col5">����������<em class="unit">'+pConfig.unit+'</em>��</div>\
											<div class="col6">'+isunit+'\
												<div class="col6-line">����������<em class="unit">'+pConfig.unit+'</em>��</div>\
												<div class="col6-line"><input type="checkbox" class="select-same" id="select-same-checkbox"/><label for="select-same-checkbox">ȫ����ͬ</label></div>\
											</div>');
							_html.push('</div>')
						}				
						
						
					}else{
						if(_isSpecPrice){
							_html.push('<div class="col4567 fd-clr">');
								_html.push('<div class="col4">���ۣ�Ԫ��</div>');
								_html.push('<div class="col5">����������<em class="unit">'+pConfig.unit+'</em>��</div>\
											<div class="col6">'+isunit+'\
												<div class="col6-line">����������<em class="unit">'+pConfig.unit+'</em>��</div>\
												<div class="col6-line"><input type="checkbox" class="select-same" id="select-same-checkbox"/><label for="select-same-checkbox">ȫ����ͬ</label></div>\
											</div>');
								_html.push('<div class="col7">С�ƣ�Ԫ��</div>');
							_html.push('</div>')
						}else{
							_html.push('<div class="col56  fd-clr">');
								_html.push('<div class="col5">����������<em class="unit">'+pConfig.unit+'</em>��</div>\
											<div class="col6">'+isunit+'\
												<div class="col6-line">����������<em class="unit">'+pConfig.unit+'</em>��</div>\
												<div class="col6-line"><input type="checkbox" class="select-same" id="select-same-checkbox"/><label for="select-same-checkbox">ȫ����ͬ</label></div>\
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
						_html.push('<div class="mixed-condition">�û�Ʒ֧�֣�<span class="icon-mixed"></span></div>');
					}		
					if(_isSpecPrice){
						_html.push('<div><span class="span-type-stat">�ò�Ʒ���ƹ���<em class="total-type">0</em>��</span><span  class="span-money-stat">�ϼƣ�<em class="money total-money">0.00</em>Ԫ</span></div>');
					}else{					
						_html.push('<div class="price-range">\
							�ϼƣ�<span class="orange"><em class="total-amount">0</em>'+pConfig.unit+'*</span>\
							<div class="price-range-list">');
						for(var _i=0,_len=pConfig.priceRange.length;_i<_len;_i++){
							_priceinfo=pConfig.priceRange[_i];
							//���������
							if(_i==0){
								_html.push('<dl class="fd-clr first-item price-selected"><dt>');
							}else{
								_html.push('<dl class="fd-clr"><dt>');
							}
							
							if(_priceinfo.qty_end){
								_html.push(_priceinfo.qty_begin+'-'+_priceinfo.qty_end+'&nbsp;'+pConfig.unit+':');
							}else{
								_html.push('�R'+_priceinfo.qty_begin+'&nbsp;'+pConfig.unit+':');
							}
							_html.push('</dt><dd>'+_priceinfo.price+'&nbsp;Ԫ/'+pConfig.unit+'</dd></dl>');
						}		
						_html.push('</div>\
							<span class="orange">=<em class="total-money">0.00</em>Ԫ</span>\
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
					//û�취Ҫ��֤dialog��function������ȷ
					
					evalFunction(_config,'open');
					evalFunction(_config,'close');
					evalFunction(_config,'beforeClose');	
					$.use('ui-dialog', function(){
						//��û��չʾ��ʱ��չʾ
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
				 * �������������趨dialog��λ��
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
					//�����������Ի����˳������left-left#bottom-bottom��ʾ�������ߺͶԻ�����ߣ�������±ߺͶԻ�����±߶���
					
					switch(pstr){
						case 'center':	//����
							pConfig.dialogConfig.css={
								'left':pos1.left+size1.width/2-size2.width/2,
								'top':pos1.top+size1.height/2-size2.height/2-scollT
							};
							break;
						case 'left-left#top-bottom':	//�����ߺͶԻ�����߶��룬����ϱߺͶԻ����±߶���
							pConfig.dialogConfig.css={
								'left':pos1.left,
								'top':pos1.top-size2.height-scollT
							};
							break;
						case 'left-left#bottom-top':	//�����ߺͶԻ�����߶��룬����±ߺͶԻ����ϱ߶���
							pConfig.dialogConfig.css={
								'left':pos1.left,
								'top':pos1.top+size1.height-scollT
							};
							break;
						case 'left-right#bottom-top':	//�����ߺͶԻ����ұ߶��룬����±ߺͶԻ����ϱ߶���
							pConfig.dialogConfig.css={
								'left':pos1.left-size2.width,
								'top':pos1.top+size1.height-scollT
							};
							break;
						case 'left-right#top-top':	//�����ߺͶԻ����ұ߶��룬����ϱߺͶԻ����ϱ߶���
							pConfig.dialogConfig.css={
								'left':pos1.left-size2.width,
								'top':pos1.top-scollT
							};
							break;
						case 'left-right#bottom-bottom':	//�����ߺͶԻ����ұ߶��룬����±ߺͶԻ����±߶���
							pConfig.dialogConfig.css={
								'left':pos1.left-size2.width,
								'top':pos1.top+size1.height-size2.height-scollT
							};
							break;
						case 'left-right#top-bottom':	//�����ߺͶԻ����ұ߶��룬����ϱߺͶԻ����±߶���
							pConfig.dialogConfig.css={
								'left':pos1.left-size2.width,
								'top':pos1.top-size2.height-scollT
							};
							break;
						case 'right-left#bottom-top':	//�����ߺͶԻ�����߶��룬����ϱߺͶԻ����±߶���
							pConfig.dialogConfig.css={
								'left':pos1.left+size1.width,
								'top':pos1.top+size1.height-scollT
							};
							break;
						case 'right-left#top-top':	//�����ߺͶԻ�����߶��룬����ϱߺͶԻ����±߶���
							pConfig.dialogConfig.css={
								'left':pos1.left+size1.width,
								'top':pos1.top-scollT
							};
							break;
						case 'right-left#bottom-bottom':	//�����ߺͶԻ�����߶��룬����ϱߺͶԻ����±߶���
							pConfig.dialogConfig.css={
								'left':pos1.left+size1.width,
								'top':pos1.top+size1.height-size2.height-scollT
							};
							break;
						case 'right-left#top-bottom':	//�����ߺͶԻ�����߶��룬����ϱߺͶԻ����±߶���
							pConfig.dialogConfig.css={
								'left':pos1.left+size1.width,
								'top':pos1.top-size2.height-scollT
							};
							break;
						case 'right-right#bottom-top':	//�����ߺͶԻ�����߶��룬����ϱߺͶԻ����±߶���
							pConfig.dialogConfig.css={
								'left':pos1.left+size1.width-size2.width,
								'top':pos1.top+size1.height-scollT
							};
							break;
						case 'right-right#top-bottom':	//�����ߺͶԻ�����߶��룬����ϱߺͶԻ����±߶���
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
				 * ������ͨoffer��������
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
				 * ���ӵ�������
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
						
						//���¼�
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
							//���ٸ�iframe��ֹ��μ���
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
				 * չʾ���������֮�����Ϣ
				 * @param {String} pAction success/failure/othererror
				 * @param {Object} pResult {}
				 */
				showAddPurchaseMsg:function(pAction,pResult,pConfig){
					var _self=this,
						$html=[],
						$iknow='<div class="fd-clr"><a href="#" class="purchase-button fd-right close" title="֪����"><em>֪����</em></a></div>',
						$button='<div><a href="'+viewPurchaseUrl+'" class="purchase-button purchase-button-o view-purchase" title="�鿴������"><em>�鿴������</em></a><a href="#" class="purchase-button close" title="��������"><em>��������</em></a></div>';
					pAction=pAction||'default';
					pResult=pResult||{};

					switch(pAction){
						case 'success':
							_self.setTitle('��ӳɹ�');
                            if(pConfig && pConfig.promotionSwitch){
                                $html.push('<div class="d-promotion-wrap">');
                            }
							$html.push('<div class="add-purchase-info add-ok">');
							$html.push('<h3>��Ʒ����ӳɹ���</h3>');
							$html.push('<div  class="sub-info">��ǰ��������<strong class="orange">'+pResult.quantity+'</strong>�ֻ�Ʒ</div>');
                            $html.push(_self.checkLogin());
                            //$html.push($button);		
 							$html.push('</div>');											
                            if(pConfig && pConfig.promotionSwitch){
                                $html.push(_self.promotion1118());
                                $html.push('</div>');											
                            }
							break;
						case 'morethan':
							_self.setTitle('���ʧ��');
							$html.push('<div class="add-purchase-info add-error">');
							$html.push('<h3>���Ľ�������Ʒ�����Ѵ����ޣ�</h3>');
							$html.push('<div  class="sub-info">���������еĲ�Ʒ����Ϊ'+pResult.quantity+'�֣������ٹ���'+(100-pResult.quantity)+'�֡�</div>');
							$html.push($button);		
							$html.push('</div>');				
							break;
						case 'failure':
							_self.setTitle('���ʧ��');
							$html.push('<div class="add-purchase-info add-warn">');
							$html.push('<h3>'+pResult.msg+'</h3>');
							switch(pResult.code){
								case 'PURCHASE_OVER_FLOW_ERROR':
									$html.push('<div class="sub-info">���������еĲ�Ʒ����Ϊ100�֣��Ѵﵽ���ޡ�</div>');
									$html.push($button);
									break;
								
								default:
									$html.push($iknow);	
									break;
							}
							//$html.push('<div>��������'+pResult.quantity+'�ֻ�Ʒ<span class="total-cal">�ϼƣ�<em class="money">'+pResult.total+'</em>Ԫ</span></div>');
								
							$html.push('</div>');	
							break;
						case 'begin':
							_self.setTitle('�����...');
							$html.push('<div class="loading"><img src="http://img.china.alibaba.com/cms/upload/2012/120/733/337021_1070828466.gif"/>��Ʒ�ύ�У����Ժ�...</div>');
							
							break;						
						case 'othererror':						
						case 'default':
							_self.setTitle('���ʧ��');
							$html.push('<div class="add-purchase-info add-warn">');
							$html.push('<h3>��Ǹ����������ʱ�����ã����Ժ�����</h3>');
							//$html.push('<div>��������'+pResult.quantity+'�ֻ�Ʒ<span class="total-cal">�ϼƣ�<em class="money">'+pResult.total+'</em>Ԫ</span></div>');
							$html.push($iknow);		
							$html.push('</div>');	
							break;
					}
					
					_self.setContent($html.join(''));	
					_self.setFoot('');
					return _self;
					
				},
				/**
				 * ���ݵ�½��������Ӧ�Ĵ���
				 */
				checkLogin:function(){
					var _result='',
						_loginurl=(FE.test['style.loginchina.url']||'https://login.1688.com')+'/member/signin.htm?Done='+encodeURIComponent(window.location.href),
						_button='<div>\
									<a href="'+viewPurchaseUrl+'" class="purchase-button purchase-button-o view-purchase" title="�鿴������"><em>�鿴������</em></a>\
									<a href="#" class="purchase-button close" title="��������"><em>��������</em></a>\
								</div>',
						isLogin=FE.util.IsLogin();
					if(!isLogin){
						_result='<div class="login-tips-info">����δ��¼����Ʒֻ�ܱ���6��Сʱ��\
								<a class="login" href="'+_loginurl+'" target="_self" title="�����¼">��¼</a>�����ñ���</div>';
						_result+='<div>\
									<a href="'+_loginurl+'" class="purchase-button purchase-button-o login" title="��¼"><em>��¼</em></a>\
									<a href="'+viewPurchaseUrl+'" class="purchase-button view-purchase" title="ȥ����������"><em>ȥ����</em></a>\
									<a class="close" href="#" target="_self" title="��������">��������</a>\
								</div>';
					}else{
						_result=_button;
					}
					return _result;
				},
                /**
                 * ���չʾ�齱html
                 */
                promotion1118 : function (){
                    var html = '<div class="lottery-wrap">\
                                <a class="btn-lottery" href="#">��ʼ�齱</a>\
                                <p class="lottery-desc">�����������ȯ�����ã���</p>\
                                <p class="lottery-warning">�������֧����</p>\
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
				 * tracelog���
				 * @param {String} pStr
				 */
				doAliclick:function(pStr){
					aliclick(null,'?tracelog='+pStr);
				}
			};
		_Offer.prototype={
			/**
			 * ��ȡ��Ϣ
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
					'priceIndex':0,	//��ǰ�۸������
					'isMixed':o.is_mix_sale||false,					
					'remainAmount':o.remain_qty||0,
					'minAmount':o.least_qty||1,
					'specInfo':o.spec_names||[],
					'sellUnit':o.sell_unit||null,//���۵�λ
					'scale':o.scale||null,//���۵�λ����
					'price':0.00,	//�������ͨoffer��Ϊ�䵥�ۣ�����������
					'num':0,		//�������ͨoffer��������������Ϊsku��Ϊ������
					'totalMoney':0.0,	//�������ͨoffer��Ϊ��ϼƣ���Ϊsku��Ϊ�ϼƽ��
					'isChecked':false,
					'selectedAmount':0	//ѡ�е���Ʒ���࣬�ı�������ʱ����Ҫ����
				});
				if(!_self.config.isSku&&!_self.config.msg){
					_self.setNum([],_self.config.minAmount);
				}
				_self._setSpecInfo(o.sku_info||{});				
			},
			/**
			 * ��ȡ��������
			 */
			getConfig:function(){
				return this.config;
			},
			/**
			 * �������еĶ���ִ�к���
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
			/**��ȡ�۸�һ�����������˼۸�֮��
			 * ���۸�ı仯ֻ�������ı仯
			 * @param {Int} pIndex ����	 
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
			 * ��ȡ�ܼ�
			 * @param {Int} pIndex ����
			 */
			getTotalMoney:function(pIndex){			
				var _config=this.config,
					_temp=_config;
				
				//�����sku�����޶���Ҫĳһ���Ľ��
				if(_config.isSku&&pIndex!==undefined){
					_temp=this._getSpecInfo(pIndex);
				}
				return _temp.totalMoney;
			},
			/**
			 * ���ü۸���ܼ�
			 * @param {Int} pIndex ����	 
			 */
			_setPrice:function(pIndex){
				var _config = this.config,				
					_getPrice = function(num){
						var _num = num || 0, 
							_priceRange = _config.priceRange ||[{'qty_begin': 1,'price': 0.01}], 
							_result = {'price':0,'index':0},
							_tempprice;
						//����һ���������numС����С������������Сһ�����������ʱ��������Ҫ����һ��Ĭ�ϵ�ֵ
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
						
				//������ϸoffer
				if(_config.isSku){				
					//�����۷�ʽ
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
				}else{ //��ͨofferֻ��Ҫ�޸��Լ��ľͿ�����
					_priceinfo=_getPrice(_config.num);
					_config.price=_priceinfo.price;
					_config.priceIndex=_priceinfo.index;
					
				}
			},
			/**
			 * �������еĽ��
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
			 * ��ȡ��������
			 */
			getSelectedAmount:function(){
				return this.config.selectedAmount;
			},
			/**
			 * ������������
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
			 * ��������
			 * @param {Int} pIndex ����
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
				//���¼۸���ܼ�
				this._setPrice(pIndex);
				this._updateMoney();
				//����������С��������������Ϊ0���Ǽ���һ���������������ӵ����������õ�ֵ������Ǽ�һ��
				_diff=_config.num-_oldnum;
				if(_diff<0&&pNum==0){
					this._setSelectedAmount('minus');
				}else if(_diff>0&&_diff==pNum){
					this._setSelectedAmount('plus');
				}
			},
			/**
			 * �����С������
			 * @param {Int} pIndex ����
			 * @param {Object} pNum
			 */
			checkMinAmount:function(pIndex,pNum){
				var _config=this.config,
					_num;				
				//���֧�ֻ���ֱ�ӷ���true
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
			 * ����������
			 * @param {Int} pIndex ����
			 * @param {Object} pNum
			 */
			checkMaxAmount:function(pIndex,pNum){
				var _config=this.config,
					_spec;
				pIndex=pIndex||0;
				pNum=pNum||0;
				//�����SKU
				if(_config.isSku){
					_spec=this._getSpecInfo(pIndex);
					return pNum<=(_spec.remainAmount||0);				
				}else{//��ͨoffer
					return pNum<=_config.remainAmount;
				}
			},
			/**
			 * ��ȡ����
			 * @param {Int} pIndex ����
			 */
			getSpecAmount:function(pIndex){				
				if(pIndex!==undefined){
					return this._getSpecInfo(pIndex).num;					
				}else{
					return this.getAmount();
				}
			},
			/**
			 * ��ȡ����
			 */
			getAmount:function(){
				return this.config.num;			
			},
			/**
			 * ����ѡ�������ʵ�����һ��ʹ�ã���Ϊ����ָʾ����ͼ��Ŀ��ƶ���
			 * @param {Bool} pIschecked
			 * @param {Int} pIndex ����
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
			 * ��ӵ�������
			 * @param {Array} pList
			 * eg:[{pIndex,pNum}]
			 */
			addPurchase:function(pList){
				
			},
			/**
			 * ���ó�ʼ��sku��Ϣ��Ϊ�˷�ֹ�Ժ�ı����ͳһ�Ժ�����ݽ������´����װ
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
			 * ��ȡ����������ϢΪ�ύ����
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
			 * ��spec��Ϣ�ַ�����
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
			 * ��ȡspecinfo
			 * @param {Int} pIndex ����
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
                        /*��ٳ齱*/
