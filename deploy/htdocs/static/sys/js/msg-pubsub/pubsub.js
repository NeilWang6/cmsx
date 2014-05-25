/**
 * author honglun.menghl
 * date 2011-10-20
 * 消息订阅中心，提供各应用方接入 WebSocket 通道的实时消息服务。
 */

('pubsub' in FE.sys) ||
(function($){

    var pubsub = {

        _subscribed :['system'], // the scenes whose have subscribed
        
        _subHandles : {   // the scenes 
        },

        trans: null, // transceiver 

        _msgCache : {
            system:[]
        },

        _sceneState:{
            system:true
        },

        _stateChangeCallbacks:{
        },
        

        /**
         * init this module
         * @param { object } trans . transceiver , a websocket connect or a websocket proxy 
         */
        init:function( trans ){
            this.trans = trans;
            this.initOnOpen();
            this.initOnMessage();
            this.initOnClose();
            this.initOnSceneActive();
        },

        /**
         * unload transceiver
         */
        unloadTrans:function(){
            this.trans = null;
            this._sceneState = {
                system:true
            };
        },

        /**
         * handle the onopen event
         */
        initOnOpen:function(){
            var self = this;
            // console.log("initOnOpen");
            this.trans.bind('onopen',function(){
                self._sendAllSubMsg();
            });
        },

        /**
         * handle the onmessage event
         */
        initOnMessage:function(){
            var self = this;
            this.trans.bind('onmessage',function(ev,data){
                // console.log('pubsub receive message :');
                // console.log(JSON.stringify(data));
                if(data && data.scene && $.isArray(self._subHandles[data.scene])){
                    $.each(self._subHandles[data.scene],function(i,item){
                        if($.isFunction(item)){
                            item(JSON.parse(data.content)); // TODO 
                        }
                    });
                }
            });
        },

        /**
         * handle the onclose event
         */
        initOnClose:function(){
            var self = this;
            this.trans.bind('onclose',function(){
                self._sceneState = {
                    system:true
                };

                $.each( self._stateChangeCallbacks, function( key , item ){
                    if( $.isArray( item )){
                        $.each( item , function( i, item ){
                            item(0);   
                        });
                    }
                });
            });
        },

        initOnSceneActive:function(){
            var self = this;
            this.trans.bind('onSceneActive',function(ev,data){
                if(data && data.scene){
                    self._sendCacheMsg(data.scene);
                    if( $.isArray( self._stateChangeCallbacks[ data.scene ] )){
                        $.each(  self._stateChangeCallbacks[ data.scene ] , function( i, item ){
                            item( 1 );
                        });
                    }
                }
            });
        },

        /**
         * @param { string } scene .  scene name , like wwmessage , msgcenter
         * @param { function(msg) } onMsg . The onmessage callback
         * @return { object{ send:function(msg){} } } return a object .  Application can use obj.send('msg'} send message to server
         *         the send function's param msg can be string or json , recommend use json
         */
        subscribe:function( scene, onMsg, onStateChange ){
            /*if($.inArray(scene, this._subscribed === -1)){  // if this scene not exist */
                /*this._addScene(scene, onMsg);*/
                /*return this._genSubObj(scene);*/
                /*}else{*/
                    /*if($.isArray(this._subHandles[scene])){ */
                        /*this._subHandles[scene].push(onMsg);*/
                        /*return this._genSubObj(scene);*/
                        /*}else{*/
                            /*return false;*/
                            /*}*/
                            /*}*/
            var onStateChange = onStateChange || $.noop;

            if(!this.getSceneState(scene)){
                this._addScene(scene);
            }
            if($.isArray(this._subHandles[scene])){
                this._subHandles[scene].push(onMsg);
            }else{
                this._subHandles[scene] = [ onMsg ];
            }

            if($.isArray(this._stateChangeCallbacks[scene])){
                this._stateChangeCallbacks[scene].push( onStateChange );
            }else{
                this._stateChangeCallbacks[ scene ] = [ onStateChange ];
            }
            return this._genSubObj(scene);

        },

        /**
         * generate subscribe object 
         * @param { string } scene . 
         */
        _genSubObj:function( scene ){
            var self = this;
            return {
                send:function(msg){
                    self._sendSceneMsg(msg,scene);
                },
                getState:function(){
                    return self.getSceneState(scene);
                },
                isHost:function(){
                    if(self.trans){
                        return self.trans.isHost;
                    }else{
                        return false;
                    }
                }
            }
        },

        /**
         * send message according to the scene name
         * @param { object | string } msg,  the message content
         * @param { string } scene scene, the scene name
         */
        _sendSceneMsg:function(msg,scene){
            var msg = { scene:scene , content:msg };
            if(this.getSceneState(scene)){
                this.trans.send(msg);
            }else{
                if(!$.isArray(this._msgCache[scene])){
                    this._msgCache[scene] = [];
                }
                this._msgCache[scene].push(msg);
            }
        },

        /**
         * get scene state
         * @param { string } scene 
         */
        getSceneState:function(scene){
            /*return this.trans && this.trans.readyState === 1 && this._sceneState[scene] ;*/
            return this.trans.getSceneState(scene);
        },

        /**
         * @param { string } scene . scene name , line wwmessage ,msgcenter
         * @param optional { function(msg) } onMsg . The onmessage callback. If this param is null, then unsubscribe all the handle of this scene
         */
        unsubscribe:function( scene , onMsg ){
            var index = $.inArray( scene, this._subscribed );
            if( index === -1 ){ // it this scene not exist
                return false;
            }else{
                if (!onMsg) { // if this param is null
                    this._removeScene(scene);
                    return true;
                }else{
                    var handles = this._subHandles[scene],
                        hIndex = $.inArray( onMsg, handles );
                    if( hIndex === -1 ){ // if the onMsg is not in the handles return false
                        return false;
                    }else{
                        if(this._subHandles[scene].length === 1){ //  if only this onMsg is remain , then remove the scene;
                            this._removeScene(scene);
                        }else{
                            this._subHandles[scene].splice(hIndex,1);
                        }
                        return true;
                    }
                }
            }
        },


        /**
         * @param { string } scene . scene name 
         * @param { function( msg ) } onMsg . The onmessage callback
         */
        _addScene:function(scene){
            if($.inArray(scene , this._subscribed)=== -1){
                this._subscribed.push(scene); 
            }

            if(this.getSceneState('system')){ // if the connect not ready , don't send subscribe message and don't cache this message . It will be auto send when the connect open            		
                this.trans.addScene(scene);
            }
        },

        /**
         * send all the subscribe message to server, every time the connect open ,should excute this function
         */
        _sendAllSubMsg:function(){
            var self = this;
            $.each(self._subscribed,function(i,item){
                if( item !== 'system'){
                    self.trans.addScene(item);
                }
            });
        },


        /**
         * remove scene
         * @param { string } scene . scene name
         */
        _removeScene:function(scene){
            var index = $.inArray( scene, this._subscribed );
            this._subscribed.splice(index,1);
            this._subHandles[scene] = [];
            if(this.getSceneState('system')){
                this.trans.removeScene(scene);
            }
        },

        /**
         * send the cache message according to the scene name
         * @param { string } scene. scene name
         */
        _sendCacheMsg:function(scene){
            var self = this;
            if(this.getSceneState(scene) && $.isArray(this._msgCache[scene])){
                $.each(this._msgCache[scene],function(){
                    self.trans.send(this);
                });
                this._msgCache[scene] = [];
            }
        },

        /**
         * get subscribe scenes 
         */
        getSubscribed:function(){
            return this._subscribed;
        }
        
    };

    FE.sys.pubsub = pubsub;

})(jQuery);
