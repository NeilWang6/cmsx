/*
* @ʡ����������������Ƕ༶���������Ӧ��֮һ
*  �����֧��1~3���������˵���������������������Ӧ�ã����ұ���һ�����ṩ���еļ������ݣ����ݸ�ʽ��������ļ�
*  ����һ������ʵ������Ϊ��FD.widget.PCA(...)
* @author Denis<danxia.shidx@alibaba-inc.com>
* @version 2.0.1
* @version 2.0.2    �����ͨ��text��λ�����Ľӿ�
*/
(function(w) {
    /*
    * @namespace ʵ���������˵������
    * @param {Array} els ��Ӧ��select����
    * @param {object} opts ���ã������ڴ˴��ṩ��������
    */
    var PCA=function(els,opts) {
        if(opts.store)
            this.init(els,opts);
    },
    defaults={
        //Ĭ�ϱ���
        title: ['--��ѡ��--','--��ѡ��--','--��ѡ��--'],
        //Ĭ����ʾ����
        showTitle: true,
        //��ʼvalue
        vals: [],
        //��ʼtext
        texts: []
        //onPSelected:function(){},
        //onCSelected:function(){},
        //onASelected:function(){},
    };
    PCA.prototype={
        //elP: null,
        //elC: null,
        //elA: null,
        //valP: null,
        //valC: null,
        //valA: null,
        //ip: -1,
        //ic: -1,
        /*
        * @namespace ʵ���������˵������
        * @param {Array} els ��Ӧ��select��
        * @param {object} opts ����
        */
        init: function(els,opts) {
            opts=opts||{};
            this.defaults=FD.common.applyIf(opts,defaults);
            for(var i=0,j=this.defaults.vals.length;i<j;i++) {
                switch(i) {
                    case 0:
                        this.valP=this.defaults.vals[0];
                        break;
                    case 1:
                        this.valC=this.defaults.vals[1];
                        break;
                    case 2:
                        this.valA=this.defaults.vals[2];
                        break;
                }
            }
            for(var i=0,j=this.defaults.texts.length;i<j;i++) {
                switch(i) {
                    case 0:
                        this.textP=this.defaults.texts[0];
                        break;
                    case 1:
                        this.textC=this.defaults.texts[1];
                        break;
                    case 2:
                        this.textA=this.defaults.texts[2];
                        break;
                }
            }
            for(var i=els.length-1;i> -1;i--) {
                switch(i) {
                    case 0:
                        this.elP=els[0];
                        //������ڳ������� ��ʡ��������change�¼�
                        if(this.elC||this.defaults.onPSelected)
                            FYE.on(this.elP,'change',function(e,pca) {
                                if(pca.elC){
                                    pca.ip=pca.defaults.store[0][(pca.defaults.store[0][1]?1:0)].indexOf(this.value);
                                    pca.valA=pca.textA=null;
                                    pca.cityBind.call(pca);
                                }
                                if(pca.defaults.onPSelected)
                                    pca.defaults.onPSelected.call(this);
                            },this);
                        break;
                    case 1:
                        //��¼���������ؼ�
                        this.elC=els[1];
                        //������ڵ������� ������������change�¼�
                        if(this.elA||this.defaults.onCSelected)
                            FYE.on(this.elC,'change',function(e,pca) {
                                if(pca.elA){
                                    pca.ic=(pca.defaults.store[1][1])?pca.defaults.store[1][1][pca.ip].indexOf(this.value):pca.defaults.store[1][0][pca.ip].indexOf(this.value);
                                    pca.areaBind.call(pca);
                                }
                                if(pca.defaults.onCSelected)
                                    pca.defaults.onCSelected.call(this);
                            },this);
                        break;
                    case 2:
                        //��¼���������ؼ�
                        this.elA=els[2];
                        if(this.defaults.onASelected) {
                            FYE.on(this.elA,'change',function(e,pca) {
                                pca.defaults.onASelected.apply(this);
                            },this);
                        }
                        break;
                }
            }
            this.provinceBind(this.valP,this.textP);
        },
        /*
        * @method �趨ʡ��
        * @param {string} val   Item��ֵ
        * @param {string} text  Item��ֵ
        */
        provinceBind: function(val,text) {
            var v=this.defaults.store[0][1]?1:0;
            if(text&&!val) val=this.defaults.store[0][v][this.defaults.store[0][0].indexOf(text)];
            this.ip=val?this.defaults.store[0][v].indexOf(val):-1;
            //this.ip=j;
            //if(!(!this.defaults.showTitle&&j> -1)) j++;
            //�������
            this.elP.options.length=0;
            if(this.defaults.showTitle) {
                var option=new Option(this.defaults.title[0],'');
                this.elP.options.add(option);
                //�ڲ���ʾ���Ⲣû��ָ��val����� Ĭ��ѡ�е�һ��
            } else if(this.ip<0) this.ip=0;
            for(var i=0,j=this.defaults.store[0][0].length;i<j;i++) {
                var option=new Option(this.defaults.store[0][0][i],this.defaults.store[0][v][i]);
                this.elP.options.add(option);
            }
            if(val) this.elP.value=val;
            else this.elP.selectedIndex=0;
            if(this.elC) this.cityBind(this.valC,this.textC);
        },
        /*
        * @method �趨����
        * @param {string} val Item��ֵ
        */
        cityBind: function(val,text) {
            var v=this.defaults.store[1][1]?1:0;
            if(text&&!val) val=this.defaults.store[1][v][this.ip][this.defaults.store[1][0][this.ip].indexOf(text)];
            this.ic=val&&this.ip> -1?this.defaults.store[1][v][this.ip].indexOf(val):-1;
            //this.ic=j;
            //if(!(!this.defaults.showTitle&&j> -1)) j++;
            //�������
            this.elC.options.length=0;
            if(this.defaults.showTitle) {
                var option=new Option(this.defaults.title[1],'');
                this.elC.options.add(option);
                //�ڲ���ʾ���Ⲣû��ָ��val����� Ĭ��ѡ�е�һ��
            } else if(this.ic<0) this.ic=0;
            if(this.ip> -1) {
                for(var i=0,j=this.defaults.store[1][0][this.ip].length;i<j;i++) {
                    var option=new Option(this.defaults.store[1][0][this.ip][i],this.defaults.store[1][v][this.ip][i]);
                    this.elC.options.add(option);
                }
            }
            if(val) this.elC.value=val;
            else this.elC.selectedIndex=0;
            if(this.elA) this.areaBind(this.valA,this.textA);
        },
        /*
        * @method �趨����
        * @param {string} val Item��ֵ
        */
        areaBind: function(val,text) {
            var v=this.defaults.store[2][1]?1:0;
            if(text&&!val) val=this.defaults.store[2][v][this.ip][this.ic][this.defaults.store[2][0][this.ip][this.ic].indexOf(text)];
            this.ia=(val&&this.ip> -1&&this.ic> -1)?this.defaults.store[2][v][this.ip][this.ic].indexOf(val):-1;
            //this.ia=j;
            //if(!(!this.defaults.showTitle&&j> -1)) j++;
            //�������
            this.elA.options.length=0;
            if(this.defaults.showTitle) {
                var option=new Option(this.defaults.title[2],'');
                this.elA.options.add(option);
            } else if(this.ia<0) this.ia=0;
            if(this.ip> -1&&this.ic> -1) {
                for(var i=0,j=this.defaults.store[2][0][this.ip][this.ic].length;i<j;i++) {
                    var option=new Option(this.defaults.store[2][0][this.ip][this.ic][i],this.defaults.store[2][v][this.ip][this.ic][i]);
                    this.elA.options.add(option);
                }
            }
            if(val) this.elA.value=val;
            else this.elA.selectedIndex=0;
        }
    };
    w.PCA=PCA;
})(FD.widget);