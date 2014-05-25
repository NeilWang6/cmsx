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



            // websocket ��������֮ǰ����Ӧ�������ݴ��䡣
            deepEqual( self.newSendMsg, {} , " when transceiver's ready state is not 1, no data  should be transmit" );


            // �ı� websocket ������״̬������ onopen���¼���ģ�⡡websocket �������ӳɹ�
            self.mokeTrans.readyState = 1;
            self.mokeTrans.trigger('onopen');

            // �������ӳɹ���Ӧ�����������Ѿ����ĵĳ���
            /*deepEqual( self.newSendMsg , {"scene":"system","content":{"mType":"subscribe","name":"wwmessage"}},"subscribe message ok");*/
            equal(self.newAddScene, 'wwmessage' , 'subscribe ok');

            // ���ĺ󣬲��ܷ�������û�л�ִ��Ӧ���� _subscribed �� _subHandles �д洢�������ͻص�
            ok($.inArray('wwmessage',FE.sys.pubsub._subscribed)!==-1,'after subscribe, the scene is in the _subscribed');  
            ok($.isArray(FE.sys.pubsub._subHandles['wwmessage']),' _subHandles["wwmessage"] is array'); 
            deepEqual([wwHandle],FE.sys.pubsub._subHandles['wwmessage'],' wwHandle function is added to the subHandles');

            // �յ��������Ķ��ĳɹ���ִ����Ҫ�ı� _sceneState  ��Ӧ�ĳ�����ֵ����Ϊ true
            /*transceiver.trigger('onmessage','{"scene":"system","content":"{\\"mType\\":\\"subscribe\\",\\"name\\":\\"wwmessage\\",\\"result\\":true}"}');*/
            /*ok( FE.sys.pubsub._sceneState.wwmessage , "after receive subscribe success , the state is true");*/

            // ִ�� unsubscribe �ص�����Ҫ���� unsubscribe ���󵽷����� , ������û���յ��������˵ĳɹ���ִ֮ǰ�����ı� _sceneState ��״̬
            /*FE.sys.pubsub.unsubscribe('wwmessage');*/
            /*deepEqual( newRcMsg, {"scene":"system","content":{"mType":"unsubscribe","name":"wwmessage"}}, "unsubscribe message is ok");*/
            /*ok( FE.sys.pubsub._sceneState.wwmessage , "before receive unsubscribe success , the state is true");*/

            // ����յ��������˵�ʧ�ܣ���ִ�����ǲ�Ӧ�øı�  _sceneState ��״̬
            /*transceiver.trigger('onmessage','{"scene":"system","content":"{\\"mType\\":\\"unsubscribe\\",\\"name\\":\\"wwmessage\\",\\"result\\":false}"}');*/
            /*ok( FE.sys.pubsub._sceneState.wwmessage , "if receive unsubscribe false , the state is true");*/

            // ֱ���յ��������˵ĳɹ���ִ�����ܸı� _sceneState ��״̬
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

                                /*// ���յ�ȷ�ϳ������ĳɹ�֮ǰ�����ܷ��͸ó�������Ϣ�����ǻỺ������*/
                                /*notDeepEqual( newRcMsg, {"scene":"wwmessage","content":{"name":"allenm"}}, " before receive subscribe is true , can't send message of this scene");*/

                                /*transceiver.trigger('onmessage','{"scene":"system","content":"{\\"mType\\":\\"subscribe\\",\\"name\\":\\"wwmessage\\",\\"result\\":true}"}');*/

                                /*// ���յ�ȷ�ϳ������ĳɹ�֮����������ǰ��û����ȥ����Ϣ*/
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

                            /*// ���ڶ��ĳɹ��ĳ��������������յ���Ϣ*/
                            /*deepEqual( newWWMsg , {"name":"allenm56"},"basic receive message , unwrap the message");*/



                            /*// ȡ�����ĺ��������յ���Ϣ*/
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
