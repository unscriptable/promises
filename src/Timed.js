// This is a decorator for a tiny promise to make it timeout after a
// specified number of msec. Usage:
// var myPromise = makeTimed(new Promise(), 500);

function makeTimed (promise, msec, timeoutArg) {

	// this function will get called if the stated msec elapse
	function timedOut () {
		var arg = typeof timeoutArg === ' undefined' ?
				new Error('Promise timed out.') :
				timeoutArg;
		promise.reject(arg);
	}

	var
		// start the timeout period
		handle = setTimeout(timedOut, msec),
		// grab a reference to the promise's original reject method
		prevReject = promise.reject,
		prevResolve = promise.resolve;

	// create the new reject method
	promise.reject = function reject (ex) {
		// stop the timeout
		clearTimeout(handle);
		// call the original reject method
		prevReject.call(promise, ex);
	};

	promise.resolve = function resolve (val) {
		// stop the timeout
		clearTimeout(handle);
		// call the original reject method
		prevResolve.call(promise, val);
	};

	return promise;

}
