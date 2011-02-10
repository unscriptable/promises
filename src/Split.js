// This promise is split into a back-end and front-end api.
// It's a bit more robust than tiny.js's Promise because:
// 1. It implements a front-end cancel() method.
// 2. It doesn't modify its front-end API when completed.
// 3. Outside code can't manipulate the resolved value (each
//    then() call has a protected reference to the resolved value).
// 4. It implements an onProgress handler.

function Promise () {

	var self = this;

	this._thens = [];

	// this is the front-end API. Hand this off to outside code:
	this.promise = {

		then: function (onResolve, onReject, onProgress) {
			// capture calls to then()
			self._then(onResolve, onReject, onProgress);
			return this;
		},

		// This promise implements a cancel() front end API that calls all
		// of the onReject() callbacks (aka a "cancelable promise").
		cancel: function (reason) {
			self._cancel(reason);
			return this;
		}

	};

}

(function () {

Promise.prototype = {

	/* This is the "back end" API. */

	// resolve(resolvedValue): The resolve() method is called when a promise
	// is resolved (duh). The resolved value (if any) is passed by the
	// resolver to this method. All waiting onResolve callbacks are called
	// and any future ones are, too, each being passed the resolved value.
	resolve: function (val) { this._complete('resolve', val); },

	// reject(exception): The reject() method is called when a promise cannot
	// be resolved. Typically, you'd pass an exception as the single 
	// parameter, but any other argument, including none at all, is 
	// acceptable. All waiting and all future onReject callbacks are called 
	// when reject() is called and are passed the exception parameter.
	reject: function (ex) { this._complete('reject', ex); },

	// progress(data): The progress() method is the back end API to signal
	// a progress "event". It has a single parameter. The contents of this 
	// parameter could be just about anything and is specific to your
	// implementation.
	progress: function (data) {
		this._notify('progress', data);
	},

	/* "Private" methods. */

	_then: function (res, rej, prog) {
		// capture calls to then()
		this._thens.push({ resolve: res, reject: rej, progress: prog });
	},

	_cancel: function (reason) {
		this.reject(new Error(reason || 'Promise canceled.'));
	},

	_complete: function (which, arg) {
		// switch over to sync then()
		this._then = which === 'resolve' ?
			function (resolve, reject) { resolve && resolve(protect(arg)); } :
			function (resolve, reject) { reject && reject(arg); };
		// disallow multiple calls to resolve or reject
		this.resolve = this.reject = this._cancel =
			function () { throw new Error('Promise already completed.'); };
		// complete all waiting (async) then()s
		this._notify(which, arg);
		delete this._thens;
	},

	_notify: function (which, arg) {
		// notify all waiting (async) then()s
		var aThen, i = 0;
		while (aThen = this._thens[i++]) {
			aThen[which] && aThen[which](protect(arg)); 
		}
	}


};

// this is a Crockford/Cornford beget
function F () {}
function protect (obj) {
	F.prototype = obj;
	var safe = new F();
	delete F.prototype;
	return safe;
}

}());
