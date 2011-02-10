// This is a simple example of a usage for javascript 
// promises. It's so simple, you could use the tiny.js
// or tiny2.js implementations.

function imageUploader (src) {
	var promise = new Promise(),
		img = document.createElement('img');
	img.onload = function () { 
		promise.resolve(img); 
	};
	img.onerror = function () { 
		promise.reject(new Error('Image not found: ' + src));
	};
	img.src = src;
	// if you're using tiny2.js, return promise.safe;
	return promise;
}

// example usage:
imageUploader('http://google.com/favicon.ico').then(
	function gotIt (img) {
		document.body.appendChild(img);
	},
	function doh (ex) {
		document.body.appendChild(document.createTextNode(ex.message));
	}
).then(
	function shout (img) {
		alert('see my new ' + img.src + '?');
	}
);

