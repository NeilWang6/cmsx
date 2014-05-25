/**
 * @package FD.app.cms.previewpage
 * @author: hongss
 * @Date: 2011-03-012
 */

 ;(function($, D){
     var readyFun = [
        /**
         * ҳ��λ�á���ͨģ�� ���ֲ㼫�����Ч��
         */
        function(){
            var positions = $('position'),
            templates = $('dtemplate'),
            allMods = positions.add(templates),
            coverObj = $('<cover />'),
            divObj = $('<div />'),
            operatePosition = $('operate.js-operate-position'),
            operateTemplate = $('operate.js-operate-template'),
            operateAll = operatePosition.add(operateTemplate),
            rulesObj = $('operate .dcms-get-rule btn'),
            rulesContainer = $('#js-rules-select'),  
            rulesLis = rulesContainer.find('li'),
            editTemObj = $('operate .dcms-edit-template'),
            editPosObj = $('operate .dcms-edit-position'),
            container, modChildren, positionId, templateCode, 
            currentOperate, currentColor, operateDelayId,
            
            POSITION_TAG_NAME = 'POSITION',
            TEMPLATE_TAG_NAME = 'TEMPLATE',
            MOD_TEMPLATE_DATA_NAME = 'templatecode',
            MOD_POSITION_DATA_NAME = 'positionid',
            POSITION_COVER_COLOR = '#bdf809', //#bdf809  ffdd7a
            TEMPLATE_COVER_COLOR = '#c00',
            OPERATE_DIV_HEIGHT = 24;
            
            //��ҳ��λ�á���ͨģ������ֲ�
            setCover(allMods);
            D.changeCapacity(allMods, function(el){
                setCover(el);
            });
            
            //��������������롢�Ƴ�
            operateAll.hover(function(){
                var self = $(this);
                /*if (operateDelayId){ 
                    window.clearTimeout(operateDelayId);
                    operateDelayId = '';
                    
                }*/
                //operateDelayId = setTimeout(function(){
                    modChildren.find('cover.dcms-cover-div').hide();
                    self.show();
                //}, 200);
            },function(){
                var self = $(this);
                //setTimeout(function(){
                    modChildren.find('cover.dcms-cover-div').show();
                    self.hide();
                    rulesContainer.hide();
                //}, 200);
            });
            
            editTemObj.bind('mouseenter', function(e){
                setEditTemplateUrl($(this), templateCode);
            });
            editPosObj.bind('mouseenter', function(e){
                setEditPositionUrl($(this), positionId);
            });
            
            //�󶨲������С����򡱵���¼�
            rulesObj.click(function(e){
                e.preventDefault();
                var params = {};
                params['positionId'] = positionId;
                $.ajax({
                    url: D.domain+'/position/queryRuleList.html',
                    data: params,
                    dataType: 'jsonp',
                    success: function(o){
                        if(o && o.dataList && o.dataList.length>0){
                            var data = o.dataList,
                            strHtml = '<ul>';
                            for (var i=0, l=data.length; i<l; i++) {
                                strHtml += '<li data-templateid="'+data[i].templateId+'" data-templatecode="'+data[i].templateCode+'">'+data[i].ruleName+'</li>';
                            }
                            strHtml += '</ul>';
                            rulesContainer.html(strHtml);
                        } else {
                            rulesContainer.html('<ul><li>��������</li></ul>');
                        }
                    },
                    error: function(){
                        rulesContainer.html('<ul><li>���ݼ���ʧ�ܣ�������</li></ul>');
                    }
                });
                rulesContainer.show();
            });
            //���������й����б�ĵ���¼�
            rulesLis.live('click', function(e){
               e.preventDefault();
               var tempTemplateCode = $(this).data('templatecode'),
               //tempTemplateId = $(this).data('templateId'),
               params = {};
               container.data(MOD_TEMPLATE_DATA_NAME, tempTemplateCode);
               params['templateCode'] = tempTemplateCode;
               $.ajax({
                   url: D.domain+'/position/queryContext.html',
                   data: params,
                   dataType: 'jsonp',
                   success: function(o){
                       if (o && o.content){
                           var content = $(o.content).not('script');
                           container.html(content);
                       } else {
                           container.html('��������');
                       }
                       setCover(container);
                       /*D.changeCapacity(container, function(){
                           allMods.each(function(i){
                               var el = $(templates[i]);
                               setCover(el);
                           });
                       });*/
                   },
                   error: function(){
                       container.html('���ݼ���ʧ�ܣ�������');
                       setCover(container);
                   }
               });
               rulesContainer.hide();
               
            });
            
            function setCover(els){
				els.each(function(i){
                    var el = $(els[i]),
                    children, width, height, operateDiv,
                    nodes = els[i].childNodes;
                    
                    for (var i=0, l=nodes.length; i<l; i++){
                        var nodeValue = $.trim(nodes[i].nodeValue);
                        if (nodes[i].nodeName.toUpperCase()==='#TEXT' && !(nodeValue==='\n'||nodeValue==='')){
                            $(nodes[i]).wrap('<span></span>');
                        }
                    }
                    
                    el.find('table').wrap('<div></div>');
                    el.find('iframe').wrap('<div></div>');
                    children = (el.children().length===0) ? el : el.children().not('style').not('link').not('script');
                    
                    if(el[0].tagName.toUpperCase()===POSITION_TAG_NAME){
                        operateDiv = operatePosition;
                        color = POSITION_COVER_COLOR;
                    } else {
                        operateDiv = operateTemplate;
                        color = TEMPLATE_COVER_COLOR;
                    }
                    
                    //�������ֲ�
                    children.each(function(i){
                        var child = $(children[i]), coverDiv;
                        if (child.css('position')!=='absolute') {
                            child.css('position', 'relative');
                            //child.css('overflow', 'hidden');
                        }
                        width = child.outerWidth();
                        height = child.outerHeight();
                        
                        coverDiv = $(this).find('cover.dcms-cover-div');
                        if (coverDiv.length===0){
                            coverDiv = coverObj.clone();
                            coverDiv.addClass('dcms-cover-div');
                            child.append(coverDiv);
                        }
                        coverDiv.css({'width':width+'px', 'height':height+'px', 'background-color':color});
                        
                    });
                    
                    //���ֲ����������
                    el.bind('mouseenter', function(e){
						var self = $(this);
                        //if (operateDelayId){ clearTimeout(operateDelayId);}
                        //setTimeout(function(){
						var firstChild = getFirstChild(children);
						if (firstChild){
							var top = firstChild.offset().top,
                            left = firstChild.offset().left;
                            container = self;
                            modChildren = children;
                            positionId = self.data(MOD_POSITION_DATA_NAME);
                            templateCode = self.data(MOD_TEMPLATE_DATA_NAME);
                            children.find('cover.dcms-cover-div').hide();
                            operateDiv.css({'top':(top-OPERATE_DIV_HEIGHT)+'px', 'left':left+'px'});
                            operateDiv.show();
						}	
							//operateDiv.css('display', 'inline');
                        //}, 200);
                    });
                    //���ֲ�������Ƴ�
                    el.bind('mouseleave', function(e){
                        /*if (operateDelayId){
                            window.clearTimeout(operateDelayId);
                            operateDelayId = '';
                        }*/
                        //operateDelayId = window.setTimeout(function(){
                            children.find('cover.dcms-cover-div').show();
                            operateDiv.hide();
                            rulesContainer.hide();
                        //}, 5);
                    });
                });
                
            }
			
			function getFirstChild(children){
				for (var i=0, l=children.length; i<l; i++){
					if (children.eq(i).css('display')!=='none'){
						return children.eq(i);
					}
				}
			}
            
            //���á��༭����URL
            function setEditTemplateUrl(el, templateCode){ 
                el.attr('href', D.domain+'/page/edit_template.html?templateName='+templateCode);
            }
            //���á����á���URL
            function setEditPositionUrl(el, positionId) {
                el.attr('href', D.domain+'/position/modify_position.html?id='+positionId);
            }
        }
     ];
     
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
     
     D.changeCapacity = function(els, callback, time){
         if (!$.isFunction(callback)){ return; }
         time = parseInt(time) || 1000*5; //ʱ�䵥λΪ����
         var DELAY_TIME = 200,
         INTERVAL_ID_DATA_NAME = 'dcms-intervalid',
         times = Math.round(time/DELAY_TIME);
         
         els.each(function(i){
             var self = $(this),
             width = self.outerWidth(),
             height = self.outerHeight(), 
             n = 1, intervalId, 
             elIntervalId = self.data(INTERVAL_ID_DATA_NAME);
             if (elIntervalId){
                 window.clearInterval(elIntervalId);
             }
             
             intervalId = window.setInterval(function(){
                 if (n>=times){
                     window.clearInterval(intervalId);
                 }
                 var tempWidth = self.outerWidth(),
                 tempHeight = self.outerHeight();
                 if (width!==tempWidth || height!==tempHeight){
                     width = tempWidth;
                     height = tempHeight;
                     callback.call(this, els.eq(i));
                 }
                 n++;
             }, DELAY_TIME);
             $(this).data(INTERVAL_ID_DATA_NAME, intervalId);
         }); 
     }
 })(dcms, FE.dcms);
