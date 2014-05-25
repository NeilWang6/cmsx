/**
 * author honglun.menghl
 * date 2011-11-1
 * tab-sync test
 */


(function($){

    $(document).ready(function(){

        module('sync tab test',{
            setup:function(){

                var self = this;

                setTimeout(function(){
                    self.client0 = window.open('sync-client.html','client1','width=250,height=250');
                    self.client0.onload = function(){
                        // console.log('onload0');
                        self.client0.init('wssynctest');
                    };
                    self.client1 = window.open('sync-client.html','client2','width=250,height=250,left=200');
                    self.client1.onload = function(){
                        // console.log('onload1');
                        self.client1.init('wssynctest');
                    };
                    self.client2 = window.open('sync-client.html','client3','width=250,height=250,left=300');
                    self.client2.onload = function(){
                        // console.log('onload2');
                        self.client2.init('wssynctest');
                    };
                },2000);
            },
            teardown:function(){
                this.client0.close();
                this.client1.close();
                this.client2.close();
                this.client0 = null;
                this.client1 = null;
                this.client2 = null;
            }
        });

        // 简单测试建立连接, 只能有一个 host 存在
        asyncTest('basic sync data',function(){

            var self = this;
            setTimeout(function(){
                var isHostArray = [ self.client0.isHost, self.client1.isHost, self.client2.isHost ];
                var isHost = $.grep(isHostArray,function(n,i){
                    return n;
                });
                equal(isHost.length , 1, 'only one tab can be host');
                start();
            },8000);


        });

        //  测试从 hosttab 同步字符串
        asyncTest('sync string from host',function(){
            var self = this;
            var data = 'sync strin中文';
            setTimeout(function(){
                var host = null;
                if(self.client0.client.isHost){
                    host = self.client0.client;
                }else if(self.client1.client.isHost){
                    host = self.client1.client;
                }else{
                    host = self.client2.client;
                }
                host.syncData(data);
                setTimeout(function(){
                    equal(host.isHost, true , 'sync from host');
                    equal(self.client0.newMsg, data, ' sync string 1');
                    equal(self.client1.newMsg, data, ' sync string 2');
                    equal(self.client2.newMsg, data, ' sync string 3');
                    start();
                },2000);
            },12000);
        });

        // 测试从 client tab 同步字符串
        asyncTest('sync string from client',function(){
            var self = this;
            var data = 'sync string涓枃';
            setTimeout(function(){
                var client = null;
                if(!self.client0.client.isHost){
                    client = self.client0.client;
                }else{
                    client = self.client1.client;
                }
                client.syncData(data);
                setTimeout(function(){
                    equal(client.isHost, false , 'sync from client');
                    equal(self.client0.newMsg, data, ' sync string 1');
                    equal(self.client1.newMsg, data, ' sync string 2');
                    equal(self.client2.newMsg, data, ' sync string 3');
                    start();
                },2000);
            },8000);
        });

        // 测试从 host tab 同步 json 
        asyncTest('sync json from host',function(){
            var self = this;
            var data = {"name":"allenm"};
            setTimeout(function(){
                var host = null;
                if(self.client0.client.isHost){
                    host = self.client0.client;
                }else if(self.client1.client.isHost){
                    host = self.client1.client;
                }else{
                    host = self.client2.client;
                }
                host.syncData(data);
                setTimeout(function(){
                    equal(host.isHost, true, 'data from host');
                    equal(JSON.stringify(self.client0.newMsg), JSON.stringify(data), ' sync json 1');
                    equal(JSON.stringify(self.client1.newMsg), JSON.stringify(data), ' sync json 2');
                    equal(JSON.stringify(self.client2.newMsg), JSON.stringify(data), ' sync json 3');
                    start();
                },1000);
            },8000);
        });

        // 测试从 client tab 同步 json
        asyncTest('sync json from client',function(){
            var self = this;
            /*var data = {"name":"allenm"};*/
            /*var data = {"type":"toHostOnly","content":{"type":"wssend","content":"{"scene":"system","content":{"mType":"subscribe","name":"wwmessage"}}"}};*/
            var data = {"type": "toHostOnly","content": {"type": "wssend","content": "{\"scene\":\"system\",\"content\":{\"mType\":\"subscribe\",\"name\":\"wwmessage\"}}"}};
            setTimeout(function(){
                var client = null;
                if(!self.client0.client.isHost){
                    client = self.client0.client;
                }else{
                    client = self.client1.client;
                }
                client.syncData(data);
                setTimeout(function(){
                    equal(client.isHost, false , 'sync from client')
                    equal(JSON.stringify(self.client0.newMsg), JSON.stringify(data), 'json sync json 1');
                    equal(JSON.stringify(self.client1.newMsg), JSON.stringify(data), 'json sync json 2');
                    equal(JSON.stringify(self.client2.newMsg), JSON.stringify(data), 'json sync json 3');
                    start();
                },1000);
            },8000);
        });
        

        // 测试某些 client tab 被关闭
        asyncTest('some client close',function(){

            var self = this;
            var data = 'some string';

            setTimeout(function(){

                var clientTab = null,
                    remainTabs = [];
                if(!self.client0.client.isHost){
                    clientTab = self.client0;
                    remainTabs = [ self.client1, self.client2];
                }else{
                    clientTab = self.client1;
                    remainTabs = [ self.client0, self.client2];
                }
                clientTab.close();
                remainTabs[0].client.syncData(data);

                setTimeout(function(){
                    equal(remainTabs[0].newMsg , data , 'sync remain');
                    equal(remainTabs[1].newMsg , data , 'sync remain');
                    start();
                },1000);

            },8000)

        });

        // 测试 host 被关闭,这个时候会执行重新 init 的动作，并且会触发 onHostChange 
        asyncTest('host close',function(){

            var self = this;
            var data = 'host close';

            setTimeout(function(){
                var hostTab = null,
                remainTabs = [];
                if(self.client0.client.isHost){
                    hostTab = self.client0;
                    remainTabs = [ self.client1, self.client2 ];
                }else if(self.client1.client.isHost){
                    hostTab = self.client1;
                    remainTabs = [ self.client0, self.client2 ];
                }else if(self.client2.client.isHost){
                    hostTab = self.client2;
                    remainTabs = [ self.client0, self.client1 ];
                }

                hostTab.close();
                setTimeout(function(){
                    remainTabs[0].client.syncData(data);

                    setTimeout(function(){
                        equal(remainTabs[0].newMsg , data , 'should reinit localconnect');
                        equal(remainTabs[1].newMsg , data , 'should reinit localconnect');
                        equal(remainTabs[0].hostChangeTime , 2 , 'host change twice');
                        equal(remainTabs[1].hostChangeTime , 2 , 'host change twice');
                        start();
                    },1000);
                },15000)


            },8000);

        });

        asyncTest('heart beat callback test',function(){

            var self = this;
            setTimeout(function(){

                ok(self.client0.heartBeat>1, 'The time of heare beat is more than one')
                ok(self.client1.heartBeat>1, 'The time of heare beat is more than one')
                ok(self.client2.heartBeat>1, 'The time of heare beat is more than one')
                start();

            },15000);

        });

        asyncTest('send to host only (host send)',function(){
            var self = this;
            setTimeout(function(){

                var hostTab = null,
                remainTabs = [];
                if(self.client0.client.isHost){
                    hostTab = self.client0;
                    remainTabs = [ self.client1, self.client2 ];
                }else if(self.client1.client.isHost){
                    hostTab = self.client1;
                    remainTabs = [ self.client0, self.client2 ];
                }else if(self.client2.client.isHost){
                    hostTab = self.client2;
                    remainTabs = [ self.client0, self.client1 ];
                }

                var data = 'only for host';
                hostTab.client.syncData(data,'toHostOnly');
                setTimeout(function(){
                    equal(hostTab.newMsg, data, 'host tab have the new message');
                    notEqual(remainTabs[0].newMsg, data, 'client tab don\'t have the new message');
                    notEqual(remainTabs[1].newMsg, data, 'client tab don\'t have the new message');
                    start();

                },1000);

            },8000);

        });

        asyncTest('send to host only (client send)',function(){
            var self = this;
            setTimeout(function(){

                var hostTab = null,
                remainTabs = [];
                if(self.client0.client.isHost){
                    hostTab = self.client0;
                    remainTabs = [ self.client1, self.client2 ];
                }else if(self.client1.client.isHost){
                    hostTab = self.client1;
                    remainTabs = [ self.client0, self.client2 ];
                }else if(self.client2.client.isHost){
                    hostTab = self.client2;
                    remainTabs = [ self.client0, self.client1 ];
                }

                /*var data = 'only for host(from client)';*/

                var data = JSON.stringify({"type": "toHostOnly","content": {"type": "wssend","content": "{\"scene\":\"system\",\"content\":{\"mType\":\"subscribe\",\"name\":\"wwmessage\"}}"}});
                remainTabs[0].client.syncData(data,'toHostOnly');

                setTimeout(function(){
                    equal(hostTab.newMsg, data, 'host tab have the new message');
                    notEqual(remainTabs[0].newMsg, data, 'client tab don\'t have the new message');
                    notEqual(remainTabs[1].newMsg, data, 'client tab don\'t have the new message');
                    start();

                },1000);

            },8000);

        });
    });


})(jQuery);
