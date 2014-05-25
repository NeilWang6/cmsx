/**
 * ���������
 * @author : yu.yuy
 * @createTime : 2011-9-24
 * @modifyTime : 2012-05-08
 */
(function($ns){
    $ns.taskManager = function(){
        var G = $ns.globals,
        WIN = G.win,
        //ԤԼ���ܣ�ȷ��ʱ���Ƿ����
        _checkTime = function(time){
            try{
                var now = +new Date(),
                endTime = +new Date(time);
                return endTime-now >= 0;
            }
            catch(e){
                return false;
            }
        },
        _tools = $ns.tools,
        _require = $ns.moduleManager.require,
        //�����������
        _launch = function(mission){
            var name = mission['name'],
            endTime = mission['endTime'],
            samplerate = mission['samplerate'],
            config = mission['config'];
            //���ڲ�ִ��
            if(endTime && !_checkTime(endTime)){
                return;
            }
            //����ִ��ģ�飬��ִ��
            _require(name,function(o){
                //ִ��ģ���������е�init����
                o.init(samplerate,config);
            });
        };
        return{
            push : function(missions){
                var pool = [];
                if(!missions){
                    return;
                }
                if(!_tools.isArray(missions)){
                    pool.push(missions);
                }
                else{
                    pool = missions;
                }
                //ҳ����ȫ���غ��ִ�и���������
                _tools.on(WIN,'load',function(){
                    for(var i=0,l=pool.length;i<l;i++){
                        _launch(pool.pop());
                    }
                });
            }
        }
    }();
})(MAGNETO);