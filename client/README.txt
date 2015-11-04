Настройки  client/src/js/config.js

/* -- настройки по умолчанию, все запросы уходят на локальный сервер (для разработки)  -- */

	// @if NODE_ENV='development'
	hostAPI: 'http://localhost:8000/',
	socketAPI: 'http://localhost:9000/',
    // @endif

/* -- минимизирует код и все запросы идут на сервер http://businessshark.ossystem.com.ua/  -- */

    // @if NODE_ENV='production'
	hostAPI: 'http://businessshark.ossystem.com.ua/',
	socketAPI: 'http://businessshark.ossystem.com.ua/',
    // @endif

	headerToken: 'x-access-token',

	reconnectionDelay: 5000,
	reconnectionAttempts: 12,

	debug: false


Запускаем клиент (http://localhost:3000/)
cd client/
gulp


Собираем продакшн
cd client/
NODE_ENV='production' gulp web


