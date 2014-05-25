/**
 * 选择内容模板对话框
 * @author : yu.yuy
 * @createTime : 2011-03-14
 */
(function($, D){
    var tools = D.tools,
    ET = D.ElementTemplate;
    ET.addOther('radio',function(){
        var el = ET.get('input').cloneNode(false);
        el.setAttribute('type', 'radio');
        el.setAttribute('name', 'relatedRuleId');
        return el;
    }());
    D.TemplateDialog = function(dialogElement, dialogConfig, config){
        this.init(dialogElement, dialogConfig, config);
    };
    D.TemplateDialog.prototype = {
        currentPage : 1,
        selectedTemplateId : null,
        //缓存，为提取调用名而使用
        cache : {
            o : {},
            clear : function(){
                this.o = {};
            },
            add : function(key, value){
                this.o[key] = value;
            },
            get : function(key){
                var ret;
                if(this.o.hasOwnProperty(key)){
                    ret = this.o[key];
                }
                return ret;
            }
        },
        //初始化
        init : function(dialogElement, dialogConfig, config){
            var that = this;
            
            that.dialog = dialogElement;                        //对话框DOM元素
            that.dialogConfig = dialogConfig;                   //对话框配置参数
            that.container = config.container;                  //模板信息承载容器
            that.previousBtn = config.previousBtn;              //上一页按钮
            that.nextBtn = config.nextBtn;                      //下一页按钮
            that.firstPageBtn = config.firstPageBtn;            //首页按钮
            that.cmsdomain = config.cmsdomain;                  //域名
            that.openBtn = config.openBtn;                      //打开对话框按钮
            that.closeBtns = config.closeBtns;                  //关闭对话框按钮（取消和右上角关闭按钮）
            that.submitBtn = config.submitBtn;                  //确认保持按钮
            that.searchBtn = config.searchBtn;                  //搜索按钮
            that.templateName = config.templateName;            //选择内容模板输入框
            that.keywordElement = config.keywordElement;        //搜索关键字输入框
            that.categoryTwoElement = config.categoryTwoElement;//搜索二级类目下拉框
            that.category = config.category;                    //类目级联下拉对象
			that.validator = config.validator;

            that.openBtn.click(function(e){
                that.dialog.dialog(that.dialogConfig);
            });
            //关闭选择投放规则对话框
            that.closeBtns.click(function(e){
                that.dialog.dialog('close');
                e.preventDefault();
            });
            that.searchBtn.click(function(e){
                that.search(1);
            });
            //选择投放规则对话框内，分页中下一页事件
            that.dialog.delegate(".dcms-next-btn", "click", function(){
                that.search(that.currentPage + 1);
            });
            //选择投放规则对话框内，分页中上一页事件
            that.dialog.delegate(".dcms-previous-btn", "click", function(){
                that.search(that.currentPage - 1);
            });
            //选择投放规则对话框内，分页中首页事件
            that.dialog.delegate(".dcms-first-page-btn", "click", function(){
                that.search(1);
            });
            that.submitBtn.click(function(){
                var templateId = that.selectedTemplateId,
                cache = that.cache,
                quoteName;
                if(templateId){
                    quoteName = cache.get(templateId);
                    that.templateName.val(quoteName);
					that.templateName.blur();
					//that.validator.valid(that.templateName);
					//that.templateName.nextAll('.dcms-validator-tip').removeClass('dcms-validator-error');
                    that.dialog.dialog('close');
                }
            });
            that.container.delegate("tr", "click", function(){
                var currentRadio = $('input[type="radio"]',this);
                that.selectedTemplateId = currentRadio.val();
                currentRadio.attr('checked','checked');
            });
        },
        //重置对话框
        reset : function(){
            var that = this;
            that.category.reset();
            that.keywordElement.val('');
            that.search(1);
        },
        //清除搜索内容
        clear : function(){
            this.container.empty();
        },
        //搜索
        search : function(pageNum){
            var that = this,
            url = that.cmsdomain+'/position/selectTemplate.html';
            $.ajax(url,{
                dataType: "jsonp",
                data : {
                    currentPage : pageNum,
                    catalogId : that.categoryTwoElement.val(),
                    name : encodeURIComponent(that.keywordElement.val())
                },
                success: function(o){
                    var count = o['count'],
                    currentPageNum = o['currentPage'],
                    dataList = o['dataList'];
                    that.clear();
                    that.cache.clear();
                    that.render(dataList);
                    that.buildPaging(count, currentPageNum);
                },
                error : function(){
                    that.container.html('<tr><td class="dcms-dialog-tips" colspan="4">抱歉，没有找到符合的信息。</td></tr>');
					that.cache.clear();
                    that.buildPaging(1, 1);
                }
            });
        },
        //创建新TD元素
        createTd : function(content, attr, attrName, isTitle, cutNum){
            var newTd = ET.get('td').cloneNode(false);
            if (cutNum){
                newTd.innerHTML = tools.truncateStr(content, 26, true);
            } else {
                newTd.innerHTML = content;
            }
            if (attr && attrName){
                newTd.setAttribute(attr, attrName);
            }
            if (isTitle===true){
                newTd.setAttribute('title', content);
            }
            return newTd;
        },
        //构建每个信息单元
        buildUnit : function(o){
            var that = this,
            tr = ET.get('tr'),
            td = ET.get('td'),
            radio = ET.get('radio'),
            span = ET.get('span'),
            id = o['id'],
            name = o['name'],
            quoteName = o['code'],
            selCategoryNames = o['selCategoryNames'],
            newTr = tr.cloneNode(false),
            radioTd = td.cloneNode(false),
            newRadio = radio.cloneNode(false),
            nameWrap = span.cloneNode(false),
            nameTd = td.cloneNode(false),
            quoteNameWrap = span.cloneNode(false),
            quoteNameTd = td.cloneNode(false);
            newRadio.setAttribute('value',id);
            radioTd.appendChild(newRadio);
            newTr.appendChild(radioTd);
            nameWrap.setAttribute('title',name);
            nameWrap.innerHTML = tools.truncateStr(name, 28, true);
            nameTd.appendChild(nameWrap);
            newTr.appendChild(nameTd);
            quoteNameWrap.setAttribute('title',quoteName);
            quoteNameWrap.innerHTML = tools.truncateStr(quoteName, 28, true);
            quoteNameTd.appendChild(quoteNameWrap);
            newTr.appendChild(quoteNameTd);
            newTr.appendChild(that.createTd(selCategoryNames, 'class', 'td-directory', true, 26));
            that.cache.add(id, quoteName);
            return newTr;
        },
        //构建分页模块
        buildPaging : function(count, currentPageNum){
            var that = this,
            totalPageNum = Math.ceil(count/10);
            that.currentPage = currentPageNum;
            if(currentPageNum === 1){
                if(totalPageNum > currentPageNum){
                    that.nextBtn.addClass('dcms-next-btn');
                }
                else{
                    that.nextBtn.removeClass('dcms-next-btn');
                }
                that.previousBtn.removeClass('dcms-previous-btn');
                that.firstPageBtn.removeClass('dcms-first-page-btn');
            }
            else if(currentPageNum === totalPageNum){
                that.nextBtn.removeClass('dcms-next-btn');
                that.previousBtn.addClass('dcms-previous-btn');
                that.firstPageBtn.addClass('dcms-first-page-btn');
            }
            else{
                that.nextBtn.addClass('dcms-next-btn');
                that.previousBtn.addClass('dcms-previous-btn');
                that.firstPageBtn.addClass('dcms-first-page-btn');
            }
        },
        //请求成功后渲染对话框内容区域
        render : function(dataList){
            var that = this,
            fragment = ET.get('fragment').cloneNode(false),
            l;
            if(dataList && $.isArray(dataList)){
                l = dataList.length;
                if(l===0){
                    that.container.html('<tr><td class="dcms-dialog-tips" colspan="4">抱歉，没有找到符合的信息。</td></tr>');
                    return;
                }
                for(var i=0;i<l;i++){
                    fragment.appendChild(that.buildUnit(dataList[i]));
                }
            }
            that.container.append(fragment);
        }

    };
})(dcms,FE.dcms);