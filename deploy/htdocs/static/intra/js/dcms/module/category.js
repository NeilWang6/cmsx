/**
 * 目录级联下拉
 * @author : yu.yuy
 * @createTime : 2011-03-13
 */
(function($, D){
    var ET = D.ElementTemplate;
    D.Category = function(parent, child, cmsdomain){
        this.init(parent, child, cmsdomain);
    };
    D.Category.prototype = {
        optionTemplate : document.createElement('option'),
        init : function(parent, child, cmsdomain){
            var that = this;
            that.parent = parent,
            that.child = child,
            that.cmsdomain = cmsdomain;
            //that.reset();
            that.parent.change(function(){
                var parentId = $(this).val();
                if(!parentId){
                    that.clear();
                    return;
                }
                that.getChildren(parentId);
            });
        },
        clear : function(){
            this.child.html('<option value="">请选择二级目录</option>');
            this.child.animate({
                backgroundColor: "#D4DBE9"
            }, 300).animate({
                backgroundColor: "#FFFFFF"
            }, 300);
        },
        reset : function(oneId, twoId){
            var that = this;
            if(oneId && twoId){
                that.parent.val(oneId);
                that.getChildren(oneId, function(){
                    that.child.val(twoId);
                });
                return;
            }
            that.parent.val('');
            that.child.html('<option value="">请选择二级目录</option>');
        },
        getChildren : function(parentId, callback){
            var that = this,
            url = that.cmsdomain+'/position/childrenCatalog.html',
            childElement = that.child;
            if(!parentId){
                that.clear();
                return;
            }
            $.ajax(url,{
                dataType: "jsonp",
                data : {
                    parentId : parentId
                },
                success: function(o){
                    var dataList = o['dataList'],
                    fragment;
                    if(dataList && $.isArray(dataList)){
                        fragment = ET.get('fragment').cloneNode(false);
                        fragment.innerHTML = '<option value="">请选择二级目录</option>';
                        for(var i=0,l=dataList.length;i<l;i++){
                            fragment.appendChild(that.buildNewOption(dataList[i]));
                        }
                        that.clear();
                        childElement.append(fragment);
                        if(callback){
                            callback.call(that);
                        }
                    }
                },
                error : function(){
                    that.child.html('<option value="">请选择二级目录</option>');
                }
            });
        },
        buildNewOption : function(o){
            var newOption = this.optionTemplate.cloneNode(false),
            id = o['id'],
            name = o['name'];
            newOption.setAttribute('value',id);
            newOption.innerHTML = name;
            return newOption;
        }
    };
})(dcms,FE.dcms);