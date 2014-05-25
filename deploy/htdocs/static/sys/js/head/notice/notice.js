(function(){
    //���������б�
    var buildNoticeList = function(){
        var noticeContainer = $('noticeContainer'),
        url = 'http://page.1688.com/homepage-notice-20101104.html?_input_charset=UTF-8&t='+(+new Date()),
        defaultData = [{
            content:"�Ա��̳�������������",
            url:"http://info.1688.com/news/detail/v5003008-d1013182690.html"
        },{
            content:"���Ｏ���ٵ�������������ҵ200ǿ���ף�",
            url:"http://info.1688.com/news/detail/v5003008-d1013182690.html"
        }],
        doDefault = function(){
            render(defaultData);
        },
        render = function(data){
            var newDlElement = document.createElement('dl'),
            flagment = document.createDocumentFragment(),
            titleElement = document.createElement('dt'),
            newDdElement,
            anchor,
            noticeObject,
            noticeContent,
            noticeUrl,
            noticeJson = format(data);
            titleElement.innerHTML = '���﹫�棺';
            for(var i=0,l=noticeJson.length;i<l;i++){
                noticeObject = noticeJson[i];
                noticeContent = noticeObject['content'];
                noticeUrl = noticeObject['url'];
                newDdElement = document.createElement('dd');
                anchor = document.createElement('a');
                anchor.setAttribute('title', noticeContent);
                anchor.setAttribute('href', noticeUrl);
                anchor.innerHTML = noticeContent;
                newDdElement.appendChild(anchor);
                flagment.appendChild(newDdElement);
            }
            newDlElement.appendChild(titleElement);
            newDlElement.appendChild(flagment);
            noticeContainer.appendChild(newDlElement);
        },
        //��ʽ��json���ݣ��粻���ϣ�����Ĭ������
        format = function(data){
            var noticeJson = data,
            ret = [],
            noticeObject,
            noticeContent,
            noticeUrl,
            //���URL����Ч��
            isEffectiveUrl = function(url){
                var regex = new RegExp(/^http:\/\/[\s\S]+/);
                return regex.test(url);
            };
            if(!FDEV.lang.isArray(noticeJson)){
                return defaultData;
            }
            for(var i=0,l=noticeJson.length;i<l;i++){
                noticeObject = noticeJson[i];
                noticeContent = noticeObject['content'];
                noticeUrl = noticeObject['url'];
                if((noticeContent&&FDEV.lang.isString(noticeContent)) && (noticeUrl&&isEffectiveUrl(noticeUrl))){
                    ret.push(noticeObject);
                }
                else{
                    ret.push(defaultData[i]);
                }
            }
            return ret;
        };
        $Y.Get.script(url,{
            onSuccess : function(){
                try{
                    var data = NoticeQueue;
                    if(data && FDEV.lang.isArray(data)){
                        render(data);
                    }
                    else{
                        doDefault();
                    }
                }catch(e){
                    doDefault();
                }
            },
            onFailure : function(){
                doDefault();
            },
            onTimeout : function(){
                doDefault();
            },
            charset : 'gb2312',
            timeout : 5000
        });
    };
    $E.onDOMReady(function(){
        try{
            buildNoticeList();
        }catch(e){
        
        }
    });
})();