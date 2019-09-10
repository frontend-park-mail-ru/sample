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

function ajax(method, url, body = null, callback) {
	const xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.withCredentials = true;

	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState !== 4) return;

		callback(xhr.status, xhr.responseText);
	});

	if (body) {
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf8');
		xhr.send(JSON.stringify(body));
		return;
	}

	xhr.send();
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

		ajax('POST', '/signup', {email, age, password}, function (status, responseText) {
			if (status === 201) {
				createProfile();
				return;
			}

			const {error} = JSON.parse(responseText);
			alert(error);
		})
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

		ajax(
			'POST',
			'/login',
			{email, password},
			function (status, response) {
				if (status === 200) {
					createProfile();
				} else {
					const {error} = JSON.parse(response);
					alert(error);
				}
			}
		)

	});

	application.appendChild(form);
	application.appendChild(back);
}

function createProfile() {
	application.innerHTML = '';
	ajax('GET', '/me', null, function (status, responseText) {
		let isMe = false;
		if (status === 200) {
			isMe = true;
		}

		if (status === 401) {
			isMe = false;
		}

		if (isMe) {
			const responseBody = JSON.parse(responseText);

			application.innerHTML = '';

			const span = document.createElement('span');
			span.textContent = `Мне ${responseBody.age} и я крутой на ${responseBody.score} очков`;

			application.appendChild(span);
		} else {
			alert('АХТУНГ нет авторизации');
			createLogin();
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

