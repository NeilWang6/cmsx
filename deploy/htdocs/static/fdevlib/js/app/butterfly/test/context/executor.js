define('butterfly/test/context/Executor', 

['butterfly/context/Executor'],

function(Executor) {
	

describe('butterfly/context/Executor', function() {
		
	it('ʹ��executorִ��һ������', function() {
		var errorHappen = false;

		var executor = new Executor({
			error: function() {
				// ͳһ�쳣����
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

		// ��ӡ����
		var report = executor.report();
		expect(typeof report).toBe('string');
	});

		
});
//~


});
