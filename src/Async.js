// This decorator makes a promise always execute callbacks asynchronously.
// If your code is becoming complex because you don't know whether the
// promise may callback immediately or not, you can use this decorator.
// Note: check out dojo.when() which is a different way to solve this issue.
// Usage:
// var myPromise = makeAsync(new Promise());
// TODO: test this decorator

function makeAsync (promise) {

	// capture the original then() from the promise's front-end API
	var prevThen = (promise.promise || promise.safe || promise).then;

	// this function will wrap a function in a 0msec setTimeout
	// and run a preparation function when it is invoked
	function makeAsync (func, prep) {
		return function () {
			prep && prep();
			var args = arguments;
			setTimeout(function () {
				func.apply(promise, args);
			}, 0);
		};
	}

	// this is the preparation function
	// it makes our ref to the original then() async
	function finalize () {
		prevThen = makeAsync(prevThen);
	}

	// wrap all of our methods

	// Note: resolve() and reject() will get overwritten once the promise is
	// completed, but that's ok since we no longer need them to be async.
	promise.resolve = makeAsync(promise.resolve, finalize);
	promise.reject = makeAsync(promise.reject, finalize);
	promise.progress && (promise.progress = makeAsync(promise.progress));

	// initially, then() will just call the original then()
	promise.then = function () { prevThen.apply(this, arguments); };

	return promise;

}
