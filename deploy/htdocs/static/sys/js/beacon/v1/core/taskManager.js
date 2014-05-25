/**
 * 任务管理器
 * @author : yu.yuy
 * @createTime : 2011-9-24
 * @modifyTime : 2012-05-08
 */
(function($ns){
    $ns.taskManager = function(){
        var G = $ns.globals,
        WIN = G.win,
        //预约功能，确认时间是否过期
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
        //启动监控任务
        _launch = function(mission){
            var name = mission['name'],
            endTime = mission['endTime'],
            samplerate = mission['samplerate'],
            config = mission['config'];
            //过期不执行
            if(endTime && !_checkTime(endTime)){
                return;
            }
            //载入执行模块，且执行
            _require(name,function(o){
                //执行模块结果对象中的init方法
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
                //页面完全加载后才执行各配置任务
                _tools.on(WIN,'load',function(){
                    for(var i=0,l=pool.length;i<l;i++){
                        _launch(pool.pop());
                    }
                });
            }
        }
    }();
})(MAGNETO);