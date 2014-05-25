/**
 * author honglun.menghl
 * date 2011-10-24
 * pubsub.js unit test
 */


(function($){


    $(document).ready(function(){
        
        module('pubsub',{
            setup:function(){
                this.newSendMsg = {};
                this.sceneState = false;
                this.newAddScene = '';

                var self = this;

                this.mokeTrans = {
                    readyState:3,
                    isHost:false,
                    send:function(){
                        
                    },
                    addScene:function(scene){
                        self.newAddScene = scene;
                    },
                    removeScene:function(){
                    },
                    getSceneState:function(){
                        return self.sceneState;
                    }
                }
                $.extend(self.mokeTrans, $.EventTarget);
                FE.sys.pubsub.init(this.mokeTrans);
            },
            teardown:function(){
                FE.sys.pubsub.unloadTrans();
                FE.sys.pubsub._subscribed = ['system'];
                FE.sys.pubsub._subHandles = {};
            }
        });
    
        test("basic subscribe and unsubscribe",function(){

            
        
            var newWWMsg = {};
            var wwHandle = function(msg){
                newWWMsg = msg;
                // console.log(msg);
            };
            var self = this;

            ww = FE.sys.pubsub.subscribe('wwmessage',wwHandle);



            // websocket 建立连接之前，不应该有数据传输。
            deepEqual( self.newSendMsg, {} , " when transceiver's ready state is not 1, no data  should be transmit" );


            // 改变 websocket 的连接状态，触发 onopen　事件，模拟　websocket 建立连接成功
            self.mokeTrans.readyState = 1;
            self.mokeTrans.trigger('onopen');

            // 建立连接成功后，应该立即发送已经订阅的场景
            /*deepEqual( self.newSendMsg , {"scene":"system","content":{"mType":"subscribe","name":"wwmessage"}},"subscribe message ok");*/
            equal(self.newAddScene, 'wwmessage' , 'subscribe ok');

            // 订阅后，不管服务器有没有回执，应该在 _subscribed 和 _subHandles 中存储场景名和回调
            ok($.inArray('wwmessage',FE.sys.pubsub._subscribed)!==-1,'after subscribe, the scene is in the _subscribed');  
            ok($.isArray(FE.sys.pubsub._subHandles['wwmessage']),' _subHandles["wwmessage"] is array'); 
            deepEqual([wwHandle],FE.sys.pubsub._subHandles['wwmessage'],' wwHandle function is added to the subHandles');

            // 收到服务器的订阅成功回执后，需要改变 _sceneState  对应的场景的值，变为 true
            /*transceiver.trigger('onmessage','{"scene":"system","content":"{\\"mType\\":\\"subscribe\\",\\"name\\":\\"wwmessage\\",\\"result\\":true}"}');*/
            /*ok( FE.sys.pubsub._sceneState.wwmessage , "after receive subscribe success , the state is true");*/

            // 执行 unsubscribe 回调后，需要发送 unsubscribe 请求到服务器 , 但是在没有收到服务器端的成功回执之前，不改变 _sceneState 的状态
            /*FE.sys.pubsub.unsubscribe('wwmessage');*/
            /*deepEqual( newRcMsg, {"scene":"system","content":{"mType":"unsubscribe","name":"wwmessage"}}, "unsubscribe message is ok");*/
            /*ok( FE.sys.pubsub._sceneState.wwmessage , "before receive unsubscribe success , the state is true");*/

            // 如果收到服务器端的失败，回执，还是不应该改变  _sceneState 的状态
            /*transceiver.trigger('onmessage','{"scene":"system","content":"{\\"mType\\":\\"unsubscribe\\",\\"name\\":\\"wwmessage\\",\\"result\\":false}"}');*/
            /*ok( FE.sys.pubsub._sceneState.wwmessage , "if receive unsubscribe false , the state is true");*/

            // 直到收到服务器端的成功回执，才能改变 _sceneState 的状态
            /*transceiver.trigger('onmessage','{"scene":"system","content":"{\\"mType\\":\\"unsubscribe\\",\\"name\\":\\"wwmessage\\",\\"result\\":true}"}');*/
            /*ok( !FE.sys.pubsub._sceneState.wwmessage , "if receive unsubscribe success , the state is false");*/


        });


        /*test("basic send message",function(){*/

            /*var newRcMsg = {};*/
            /*var transceiver = {*/
                /*readyState:3,*/
                /*open:function(){*/
                    /*},*/
                    /*send:function(msg){*/
                        /*newRcMsg = msg;*/
                        /*},*/
                        /*close:function(){*/
                            /*}*/
                            /*}*/

                            /*$.extend(transceiver,$.EventTarget);*/

                            /*var newWWMsg = {};*/
                            /*var wwHandle = function(msg){*/
                                /*newWWMsg = msg;*/
                                /*// console.log(msg);*/
                                /*}*/

                                /*ww = FE.sys.pubsub.subscribe('wwmessage',wwHandle);*/

                                /*FE.sys.pubsub.init(transceiver);*/

                                /*transceiver.readyState = 1;*/
                                /*transceiver.trigger('onopen');*/

                                /*ww.send({"name":"allenm"});*/

                                /*// 在收到确认场景订阅成功之前，不能发送该场景的消息，但是会缓存起来*/
                                /*notDeepEqual( newRcMsg, {"scene":"wwmessage","content":{"name":"allenm"}}, " before receive subscribe is true , can't send message of this scene");*/

                                /*transceiver.trigger('onmessage','{"scene":"system","content":"{\\"mType\\":\\"subscribe\\",\\"name\\":\\"wwmessage\\",\\"result\\":true}"}');*/

                                /*// 在收到确认场景订阅成功之后，立即发送前面没发出去的消息*/
                                /*deepEqual( newRcMsg, {"scene":"wwmessage","content":{"name":"allenm"}}, "after receive subscribe is true, simple send message and pubsub auto wrapper the message ");*/

                                /*FE.sys.pubsub.unsubscribe('wwmessage');*/
                                /*transceiver.trigger('onmessage','{"scene":"system","content":"{\\"mType\\":\\"unsubscribe\\",\\"name\\":\\"wwmessage\\",\\"result\\":true}"}');*/
                                /*FE.sys.pubsub.unloadTrans();*/

    /*});*/

    /*test("basic receive message", function(){*/

        /*var newRcMsg = {};*/
        /*var transceiver = {*/
            /*readyState:3,*/
            /*open:function(){*/
                /*},*/
                /*send:function(msg){*/
                    /*newRcMsg = msg;*/
                    /*},*/
                    /*close:function(){*/
                        /*}*/
                        /*}*/

                        /*$.extend(transceiver,$.EventTarget);*/

                        /*var newWWMsg = {};*/
                        /*var wwHandle = function(msg){*/
                            /*newWWMsg = msg;*/
                            /*// console.log(msg);*/
                            /*}*/

                            /*ww = FE.sys.pubsub.subscribe('wwmessage',wwHandle);*/

                            /*FE.sys.pubsub.init(transceiver);*/
                            /*transceiver.readyState = 1;*/
                            /*transceiver.trigger('onopen');*/

                            /*transceiver.trigger('onmessage','{"scene":"system","content":"{\\"mType\\":\\"subscribe\\",\\"name\\":\\"wwmessage\\",\\"result\\":true}"}');*/
                            /*transceiver.trigger('onmessage','{"scene":"wwmessage","content":"{\\"name\\":\\"allenm56\\"}"}');*/

                            /*// 对于订阅成功的场景，可以正常收到消息*/
                            /*deepEqual( newWWMsg , {"name":"allenm56"},"basic receive message , unwrap the message");*/



                            /*// 取消订阅后，则不能再收到消息*/
                            /*FE.sys.pubsub.unsubscribe('wwmessage');*/
                            /*transceiver.trigger('onmessage','{"scene":"system","content":"{\\"mType\\":\\"unsubscribe\\",\\"name\\":\\"wwmessage\\",\\"result\\":true}"}');*/

                            /*transceiver.trigger('onmessage','{"scene":"wwmessage","content":"{\\"name\\":\\"allenm56test\\"}"}');*/
                            /*notDeepEqual( newWWMsg , {"name":"allenm56test"}, " if have unsubscribe the scene, can't receive message");*/

                            /*FE.sys.pubsub.unloadTrans();*/

    /*});*/

    /*test("reconnect test",function(){*/

        /*var newRcMsg = {},*/
        /*msgCount = 0;*/
        /*var transceiver = {*/
            /*readyState:3,*/
            /*open:function(){*/
                /*},*/
                /*send:function(msg){*/
                    /*newRcMsg = msg;*/
                    /*msgCount += 1;*/
                    /*},*/
                    /*close:function(){*/
                        /*}*/
                        /*}*/

                        /*$.extend(transceiver,$.EventTarget);*/

                        /*var newWWMsg = {};*/
                        /*var wwHandle = function(msg){*/
                            /*newWWMsg = msg;*/
                            /*// console.log(msg);*/
                            /*}*/

                            /*ww = FE.sys.pubsub.subscribe('wwmessage',wwHandle);*/

                            /*FE.sys.pubsub.init(transceiver);*/
                            /*transceiver.readyState = 1;*/
                            /*transceiver.trigger('onopen');*/

                            /*deepEqual( newRcMsg, {"scene":"system","content":{"mType":"subscribe","name":"wwmessage"}},"subscribe message ok");*/

                            /*transceiver.readyState = 3;*/
                            /*transceiver.trigger('onclose');*/

                            /*newRcMsg = {};*/
                            /*transceiver.readyState = 1;*/
                            /*transceiver.trigger('onopen');*/

                            /*deepEqual( newRcMsg, {"scene":"system","content":{"mType":"subscribe","name":"wwmessage"}}," should resend the subscribe message");*/
                            /*equal( msgCount , 2 , " every time reconnect , should send the subscribe message to server ");*/

    /*});*/


    });
})(jQuery);
