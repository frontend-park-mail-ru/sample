// наименование для нашего хранилища кэша
const CACHE_NAME = 'lesson-6';
// ссылки на кэшируемые файлы
const cacheUrls = [
	'/',
	'index.html',
	'main.css',
	'main.js',
	'components/Profile/Profile.js',
	'components/Profile/Profile.css',
	'modules/ajax.js',
];

this.addEventListener('install', function(event) {
	// задержим обработку события
	// если произойдёт ошибка, serviceWorker не установится
	event.waitUntil(
		// находим в глобальном хранилище Cache-объект с нашим именем
		// если такого не существует, то он будет создан
		caches.open(CACHE_NAME)
		.then(function(cache) {
			// загружаем в наш cache необходимые файлы
			return cache.addAll(cacheUrls);
		})
	);
});

this.addEventListener('fetch', function(event) {

	event.respondWith(
		// ищем запрашиваемый ресурс в хранилище кэша
		caches.match(event.request).then(function(cachedResponse) {

			// выдаём кэш, если он есть
			if (cachedResponse && !navigator.onLine) {
				return cachedResponse;
			}

			// иначе запрашиваем из сети как обычно
			return fetch(event.request);
		})
	);
});
