export const RENDER_RULES = {
	DOM: 'dom',
	STRING: 'stringstring',
};

export class ProfileComponent {
	constructor(parent = document.body) {
		this._parent = parent;
		this._data = {};
	}

	get data () {
		return this._data;
	}

	set data (dataToSet) {
		this._data = {...dataToSet};
	}

	render(method = RENDER_RULES.DOM) {
		switch(method) {
			case RENDER_RULES.STRING:
				this._renderString();
				break;
			case RENDER_RULES.DOM:
			default:
				this._renderDOM()
		}
	}

	_renderDOM() {
		const span = document.createElement('span');
		span.textContent = `Мне ${this._data.age} и я крутой на ${this._data.score} очков`;
		this._parent.appendChild(span);
	}

	_renderString() {
		this._parent.innerHTML = `
			<span class="ProfileSpan">
			  Мне ${this._data.age} и я крутой на ${this._data.score} очков!!!
			</span>
		`;
	}
}

// export default 1;
