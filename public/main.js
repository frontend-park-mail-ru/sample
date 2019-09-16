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

function createMenu() {
	application.innerHTML = '';
	Object.keys(menuItems).forEach(function (key) {
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
			body: {email, age, password},
			callback(status, responseText) {
				if (status === 201) {
					createProfile();
					return;
				}

				const {error} = JSON.parse(responseText);
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
			url: '/login',
			body: {email, password},
			callback(status, responseText) {
				if (status === 201) {
					createProfile();
					return;
				}

				const {error} = JSON.parse(responseText);
				alert(error);
			}
		});
	});

	application.appendChild(form);
	application.appendChild(back);
}

function createProfile() {
	application.innerHTML = '';
	AjaxModule.doGet({
		url: '/me',
		body: null,
		callback(status, responseText) {
			let isMe = false;
			if (status === 200) {
				isMe = true;
			}

			if (status === 401) {
				isMe = false;
			}

			if (isMe) {
				try {
					const responseBody = JSON.parse(responseText);
					application.innerHTML = '';
					const profile = new ProfileComponent(application);
					profile.data = responseBody;
					profile.render(RENDER_RULES.STRING);
				} catch (e) {
					return;
				}
			} else {
				alert('АХТУНГ нет авторизации');
				createLogin();
			}
		}
	});
}


const functions = {
	menu: createMenu,
	signup: createSignUp,
	login: createLogin,
	profile: createProfile,
	about: null,
};

application.addEventListener('click', function (evt) {
	const {target} = evt;

	if (target instanceof HTMLAnchorElement) {
		evt.preventDefault();
		functions[target.dataset.section]();
	}
});

createMenu();

