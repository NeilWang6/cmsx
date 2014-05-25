define('butterfly/test/context/Executor', 

['butterfly/context/Executor'],

function(Executor) {
	

describe('butterfly/context/Executor', function() {
		
	it('使用executor执行一个函数', function() {
		var errorHappen = false;

		var executor = new Executor({
			error: function() {
				// 统一异常处理
				errorHappen = true;
			}
		});


		var flag = false;
		executor.execute('fun1', function() {
			flag = true;
		});

		expect(flag).toBeTruthy();

		var stamp = executor.timestamp('fun1');
		expect(stamp.name).toBe('fun1');


		executor.execute('fun2', function() {
			throw 'some error happen';
		});

		expect(errorHappen).toBeTruthy();

		// 打印报表
		var report = executor.report();
		expect(typeof report).toBe('string');
	});

		
});
//~


});
