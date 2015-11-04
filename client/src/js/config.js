module.exports = {

    // @if NODE_ENV='development'
	hostAPI: 'http://localhost:8000/',
	socketAPI: 'http://localhost:9000/',
    // @endif

    // @if NODE_ENV='production'
	hostAPI: 'http://businessshark.ossystem.com.ua/',
	socketAPI: 'http://businessshark.ossystem.com.ua/',
    // @endif

	headerToken: 'x-access-token',

	reconnectionDelay: 5000,
	reconnectionAttempts: 12,

	debug: false
};
