// This is a decorator for a tiny promise to make it timeout after a
// specified number of msec. Usage:
// var myPromise = makeTimed(new Promise(), 500);

function makeTimed (promise, msec) {

	// this function will get called if the stated msec elapse
	function timedOut () {
		promise.reject(new Error('Promise timed out.'));
	}

	var
		// start the timeout period
		handle = setTimeout(timedOut, msec),
		// grab a reference to the promise's original reject method
		prevReject = promise.reject;

	// create the new reject method
	promise.reject = function (ex) {
		// stop the timeout
		clearTimeout(handle);
		// call the original reject method
		prevReject.call(promise, ex);
	};

	return promise;

}
