// This is a decorator for a tiny promise to make it cancelable. Usage:
// var myPromise = makeCancelable(new Promise());

function makeCancelable (promise) {

	// add the function to the front-end API, if it's separate
	(promise.safe ? promise.safe : promise).cancel = function cancel () {
		try {
			// reject this promise
			promise.reject(new Error('Promise canceled.'));
		}
		catch(ex) {
			// if promise threw, it must have already been completed
			throw new Error('Cannot cancel a completed promise.');
		}
	};

	return promise;

}
