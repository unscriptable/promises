// Another tiny promise using all "privileged" methods (a Crockfordism
// for saying all of the methods are created in the constructor.)
// This was modified slightly from a gist by Brian Cavalier:
// https://gist.github.com/814318
function Promise() {
	var callbacks = [],
		promise = {
			resolve: resolve,
			reject: reject,
			then: then,
			safe: {
				then: function safeThen(resolve, reject) {
					promise.then(resolve, reject);
					return this;
				}
			}
		};

	function complete(type, result) {
		promise.then = type === 'reject'
			? function(resolve, reject) { reject(result); return this; }
			: function(resolve)         { resolve(result); return this; };

		promise.resolve = promise.reject = function() { throw new Error("Promise already completed"); };

		var i = 0, cb;
		while(cb = callbacks[i++]) { cb[type] && cb[type](result); }

		callbacks = null;
	}

	function resolve(result) {
		complete('resolve', result);
	}
	function reject(err) {
		complete('reject', err);
	}
	function then(resolve, reject) {
		callbacks.push({ resolve: resolve, reject: reject });
	}

	return promise;
}
