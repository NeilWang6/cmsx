/**
 * author honglun.menghl
 * date 2011-10-27
 * tab sync
 * update by xuping.nie tabSync.prepare.init 添加参数groupName，解决总是使用的默认groupName的问题
 * TODO: heartbeat 貌似没有起作用，确认msgcenter是否有用，然后可以删除？
 * 2012-12-18 增加对ipad的支持。当为ipad时忽略掉同步功能。将用与服务器同步代替。
 */

('tabSync' in FE.sys) ||
(function($){

    var tabSync = {};

    tabSync.prepare = {
        state:false,
		
		isUsingFlash:true,
        
        isHost:false,
        
        groupName:'tabSyncGroup',

        callbackCache:[],
        
        funcCache:[],

        localConnect:{},
        
        swfContainer:{},

        init:function(groupName){

            var self = this;
            if(groupName){
                self.groupName = groupName ;
            }
			if(jQuery.util.flash.available == false){
				// console.log("tab-sync.js: not support flash, ignore sync.");
				self.isHost = true;
				self.isUsingFlash = false;
				self.state = true;
				self.clearCache();
			}
			else{
				$.add('ui-flash-localconnect',{
					requires:['ui-flash'],
					js:['http://style.c.aliimg.com/js/sys/msg-pubsub/localconnect.js'],
					ver:'1.0.0'
				});

				$.use('ui-flash-localconnect',function(){
					$(document).ready(function(){
							self.swfContainer=$('<div id="swf-localconnect">');
							self.swfContainer.appendTo('body').css({
							position: 'absolute',
							left: '0px;',
							top: '0px',
							width: '1px',
							height: '1px'
						}).bind('swfReady.flash',function(){
								self.initLocalConnect($(this).flash('getConnect'));                                  
									
									//conect 
								if(!self.localConnect.initHost(self.groupName)){
										self.localConnect.connect(self.groupName);
										}                     
						}).bind('joinfail.flash',function(){
							 //nothing to do yet
						}).bind('joined.flash',function(){
							 // console.log('tab-sync.js: tab-sync swf ready host:false');
							 self.isHost = false;
							 self.state = true;
							 self.clearCache();                    	 
						}).bind('data.flash',function(E,data){
							 //nonthing to do yet
							 // console.log('tab-sync.js: tab-sync swf get data :'+decodeURIComponent(data.data));
						}).bind('created.flash',function(){
								// console.log('tab-sync.js:tab-sync swf create ready host:true');
								self.isHost = true;
								self.state = true;
								self.clearCache();
						}).flash({
							module: 'localconnect'
						});
					});
				});
			}
        },
        
        bindSync : function(s){
            var sync = s;

        	var swf = $('#swf-localconnect');
        	sync.isHost=this.isHost;
        	swf.bind('joinfail.flash',function(){
          	 //nothing to do yet
          }).bind('joined.flash',function(){
          	 	sync.onHostChange(false);
				sync.isHost = false;
          }).bind('data.flash',function(E,data){
          	 	sync._onMessage(decodeURIComponent(data.data));
          }).bind('created.flash',function(){
          	 	sync.onHostChange(true);
				sync.isHost = true;
          })
        	
        },
        
        ready:function(callback){        		
            // console.log("tab-sync.js: start ready");
            if(!callback){
                return;
            }
            if(this.state){
			    // console.log("tab-sync.js: state is true. do callback.");
                callback();
            }else{
                this.callbackCache.push(callback);
                // console.log("tab-sync.js: this.callbackCache size: " +  this.callbackCache.length);
            }
        },

        clearCache:function(){
            for(var i=0,l=this.callbackCache.length; i<l; i++){
                this.callbackCache[i]();                
            }
            this.callbackCache = [];
        },

        initLocalConnect:function(conn){
            var self = this;
            this.localConnect = {
                initHost:function(groupname){
                    return conn.initHost(groupname);
                },
                connect:function(groupname){
                    return conn.connect(groupname);
                },
                pubMsg:conn.pubMsg,
                send2Host:conn.send2Host,
                uninitHost:conn.uninitHost
            }
        },

        _func2str:function(func){
            var i = this.funcCache.length;
            var wrapperFunc = function(){
                var args = $.makeArray( arguments );
                $.each( args , function( n, item ){
                    if( item ){
                        args[n] = decodeURIComponent( item );
                    }
                });
                func.apply( this, args );
            }
            this.funcCache.push(wrapperFunc);
            return 'FE.sys.tabSync.prepare.funcCache['+i+']';
        }
    };
    
    //tabSync.prepare.init();
    

    /**
     * @param {string} name . The  name of tab sync. NOTE:groupname should set by tabSync.prepare.init(groupname);
     * @param { function(data){} } onSync . When some data be synced , this callback will be excuted
     * @param optional { function( isHost ){} } onHostChange. When the group's host is change , this callback will be excuted . isHost is a boolean variable.
     *                                                        After init , the tab which is host ,will excute onHostChange(true), other excute onHostChange(false);
     *                                                        When host tab changed , the new host Tab excute onHostChange(true) , other excute onHostChange(false);
     * @param { function(){} } onHeartBeat onHeartBeat. When receive the heart beat , excute this function, you can use this to sync some as timed task;
     */
    tabSync.sync = function(name,onSync,onHostChange,onHeartBeat){
        
        // console.log("tab-sync.js: " + tabSync.prepare.groupName + ' tab sync['+ name +'] is initing');
        this.onSync = onSync;
        this.onHostChange = onHostChange || function(){};
        this.onHeartBeat = onHeartBeat || function(){};
        this._conn = tabSync.prepare.localConnect;
        this._heartBeatRcvT = null;
        this._heartBeatSendT = null;
        this._lastHeartBeat = 0;
    }

    tabSync.sync.prototype = {
        /**
         * @param { string | object } data . The data you want sync
         * @param optional { string } data . The data type . 'toHostOnly' means this message just sent to host , should not sync to client .
         *                                  'heartbeat' means this message is a hearbeat. 
         *                                  'sync' is the common sync type
         */
        syncData:function(data,type){
            var type = type || 'sync',
                rawdata = {
                    type:type,
                    content:data
                };
            rawdata = JSON.stringify(rawdata);
            if(this.isHost){
                this._onMessage(rawdata);
            }else{
                this._conn.send2Host(rawdata);
            }
        },

        /**
         * 收到消息后的处理，如果是 host 收到消息，除了触发自己的 onSync 回调以外，需要把消息再广播出去
         */
         _onMessage:function(rawdata){
            try{
                var data = JSON.parse(rawdata);
            }catch(e){
                return;
            }

            var self = this;

            switch (data.type){
                case 'heartbeat':
                    self._sync2Tabs(rawdata);
                    self._handleHeartBeat(data.content);
                    break;
                case 'toHostOnly':
                    self._handleHostOnlyData(data.content);
                    break;
                case 'sync':
                    self._sync2Tabs(rawdata);
                    self._handleNormalSync(data.content);
                    break;
                default:
                    self._sync2Tabs(rawdata);
                    self._handleNormalSync(data.content);
                    break;
            }
        },

        /**
         * 初始化心跳，保证 host 页面被关闭后，其他页面可以感知到
         */
        _initHeartBeatSend:function(){
            var heartBeatData = {live:true},
                self = this;
            self._heartBeatSendT = setInterval(function(){
                self.syncData(heartBeatData,'heartbeat');
            },3000);
        },

        // 隔一段时间检查心跳包是否正常，如果不正常，则执行重新初始化
        _initHeartBeatReceive:function(){
            this._lastHeartBeat = (new Date())-0;
            var self = this;
            self._heartBeatRcvT = setInterval(function(){
                if((new Date()) - self._lastHeartBeat > 11000){
                    // console.log('tab-sync.js: no heartbeat for long time. reconnect.');
                    self._delayInit();
                }
            },10000);
        },

        // 处理普通的同步数据，无论如何，执行 onSync(data)，向 client tab 同步数据的任务交给 _sync2Tabs 来做
        _handleNormalSync:function(data){
            this.onSync(data);
        },
        
        // 在需要向 client tab 同步数据的情况下，执行同步
        _sync2Tabs:function(rawdata){
            if(this.isHost && FE.sys.tabSync.prepare.isUsingFlash){
                this._conn.pubMsg(rawdata);
            }
        },

        // 如果 heartbeat 的 live 为 false 表明 host tab 要关闭了，立即重新建立连接
        _handleHeartBeat:function(data){
            if(data.live){
                this._lastHeartBeat = (new Date())-0;
                this.onHeartBeat();
            }else{
                this._delayInit();
            } 
        },

        // 处理一些只发往 host 的消息，不再执行向 client tabs 同步的任务
        _handleHostOnlyData:function(data){
            if(this.isHost){
                this.onSync(data);
            }
        },

        _delayInit:function(){
            var time = Math.ceil(Math.random()*500),
                self = this;
            setTimeout(function(){
                self._init();
            },time);
        }

    }

    FE.sys.tabSync = tabSync;

})(jQuery);
