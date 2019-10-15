import {
	ProfileComponent,
	RENDER_RULES,
} from './components/Profile/Profile.js';
const AjaxModule = globalThis.AjaxModule;

console.log('topkek');

const application = document.getElementById('application');

const menuItems = {
	signup: 'Регистрация',
	login: 'Авторизация',
	profile: 'Профиль',
	about: 'О себе любимом',
};

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js')
		.then((registration) => {
			console.log('ServiceWorker registration', registration);
		})
		.catch((err) => {
			console.error(err);
		});
}

function createMenu() {
	application.innerHTML = '';
	Object.keys(menuItems).forEach(function(key) {
		const menuItem = document.createElement('a');
		menuItem.textContent = menuItems[key];
		menuItem.href = `/${key}`;
		menuItem.dataset.section = key;

		application.appendChild(menuItem);
	});
}

function createSignUp() {
	application.innerHTML = '';
	const form = document.createElement('form');

	const emailInput = document.createElement('input');
	emailInput.type = 'email';
	emailInput.name = 'email';
	emailInput.placeholder = 'Емайл';

	const passwordInput = document.createElement('input');
	passwordInput.type = 'password';
	passwordInput.name = 'password';
	passwordInput.placeholder = 'Пароль';

	const ageInput = document.createElement('input');
	ageInput.type = 'number';
	ageInput.name = 'age';
	ageInput.placeholder = 'Возраст';

	const submitBtn = document.createElement('input');
	submitBtn.type = 'submit';
	submitBtn.value = 'Зарегистрироваться!';

	form.appendChild(emailInput);
	form.appendChild(passwordInput);
	form.appendChild(ageInput);
	form.appendChild(submitBtn);

	form.addEventListener('submit', function(e) {
		e.preventDefault();

		const email = form.elements['email'].value;
		const age = parseInt(form.elements['age'].value);
		const password = form.elements['password'].value;

		AjaxModule.doPost({
			url: '/signup',
			body: {
				email,
				age,
				password
			},
			callback(status, responseText) {
				if (status === 201) {
					createProfile();
					return;
				}

				const {
					error
				} = JSON.parse(responseText);
				alert(error);
			}
		});
	});

	const back = document.createElement('a');
	back.href = '/menu';
	back.textContent = 'Назад';
	back.dataset.section = 'menu';

	application.innerHTML = '';
	application.appendChild(form);
	application.appendChild(back);
}

function createLogin() {
	application.innerHTML = '';
	const form = document.createElement('form');

	const emailInput = document.createElement('input');
	emailInput.type = 'email';
	emailInput.placeholder = 'Емайл';

	const passwordInput = document.createElement('input');
	passwordInput.type = 'password';
	passwordInput.placeholder = 'Пароль';

	const submitBtn = document.createElement('input');
	submitBtn.type = 'submit';
	submitBtn.value = 'Авторизироваться!';

	form.appendChild(emailInput);
	form.appendChild(passwordInput);
	form.appendChild(submitBtn);

	const back = document.createElement('a');
	back.href = '/menu';
	back.textContent = 'Назад';
	back.dataset.section = 'menu';

	form.addEventListener('submit', function(e) {
		e.preventDefault();

		const email = emailInput.value.trim();
		const password = passwordInput.value.trim();

		AjaxModule.doPost({
			url: 'http://localhost:3001/login',
			body: {
				email,
				password
			},
			callback(status, responseText) {
				if (status === 201) {
					createProfile();
					return;
				}

				const {
					error
				} = JSON.parse(responseText);
				alert(error);
			}
		});
	});

	application.appendChild(form);
	application.appendChild(back);
}

function createProfile() {
	application.innerHTML = '';

	fetch('http://localhost:3001/me', {
			method: 'GET',
			credentials: 'include',
		})
		.then(response => {
			if (response.status >= 300) {
				throw new Error(`Неверный статус ${response.status}`);
			}

			return response.json();
		})
		.then(data => {
			console.log('Вернул response.smth()');
			console.dir({
				data
			});

			application.innerHTML = '';
			const profile = new ProfileComponent(application);
			profile.data = data;
			profile.render(RENDER_RULES.STRING);
		})
		.catch(err => {
			console.error(err);
			alert(err.message);

			createLogin();
		});

	// AjaxModule.doPromiseGet('/me', null)
	// 	.then(function (obj) {
	// 		const responseText = obj.responseText;
	//
	// 		const responseBody = JSON.parse(responseText);
	// 		application.innerHTML = '';
	// 		const profile = new ProfileComponent(application);
	// 		profile.data = responseBody;
	// 		profile.render(RENDER_RULES.STRING);
	// 	})
	// 	.catch(function (obj) {
	// 		if (obj instanceof Error) {
	// 			console.error(obj);
	// 			alert('Случилась js ошибка!');
	// 		} else {
	// 			const {status} = obj;
	// 			alert(`Запрос за /me вернул ${status}`);
	// 		}
	//
	// 		createLogin();
	// 	});
}


const functions = {
	menu: createMenu,
	signup: createSignUp,
	login: createLogin,
	profile: createProfile,
	about: null,
};

application.addEventListener('click', function(evt) {
	const {
		target
	} = evt;

	if (target instanceof HTMLAnchorElement) {
		evt.preventDefault();
		functions[target.dataset.section]();
	}
});

createMenu();
