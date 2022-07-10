const Person = function (name, children) {
	this.name = ko.observable(name);
	this.children = ko.observableArray(children || []);
};

const PeopleModel = function () {
	this.people = ko.observableArray([
		new Person("Bob", [
			new Person("Jan"),
			new Person("Don", [
				new Person("Ted"),
				new Person("Ben", [
					new Person("Joe", [
						new Person("Ali"),
						new Person("Ken")
					])
				]),
				new Person("Doug")
			])
		]),
		new Person("Ann", [
			new Person("Eve"),
			new Person("Hal")
		])
	]);

	this.addChild = function (name, parentArray) {
		parentArray.push(new Person(name));
	};

	this.doSomething = function(formElement) {
		let context = ko.contextFor(document.getElementById('people'))
		let str = JSON.stringify(ko.toJS(context.$data), undefined, 4);
		output(syntaxHighlight(str))
		print_recursive(context.$data.people())
	}
};

ko.applyBindings(new PeopleModel());

let people_element = document.getElementById('people')
let save_btn = document.getElementById('save_data')

people_element.addEventListener('click', function (ev) {
	let context = ko.contextFor(ev.target)
	let	parentArray = context.$parent.people || context.$parent.children;

	if(ev.target.classList.contains('remove')){
		parentArray.remove(context.$data);
	}

	if(ev.target.classList.contains('add')){
		let childName = "",
		parentArray = context.$data.people || context.$data.children;
		context.$root.addChild(childName, parentArray);
	}

	return false;

})


function print_recursive(people) {
	for (const person of people) {
		console.log(person.name())
		if(person.children() ){
			print_recursive(person.children())
		}
	}
}

function output(inp) {
	document.body.appendChild(document.createElement('pre')).innerHTML = inp;
}


function syntaxHighlight(json) {
	json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
		let cls = 'number';
		if (/^"/.test(match)) {
			if (/:$/.test(match)) {
				cls = 'key';
			} else {
				cls = 'string';
			}
		} else if (/true|false/.test(match)) {
			cls = 'boolean';
		} else if (/null/.test(match)) {
			cls = 'null';
		}
		return '<span class="' + cls + '">' + match + '</span>';
	});
}