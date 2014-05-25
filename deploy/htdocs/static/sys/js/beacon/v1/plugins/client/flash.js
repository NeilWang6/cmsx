AA.moduleManager.register('flash',function(){
console.info('test');
return {
    init : function(t,o){
        console.info('i am alive');
        console.info(t);
        console.info(o);
    }
}
});