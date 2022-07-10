const Person = function (name, children) {
	this.name = ko.observable(name);
	this.children = ko.observableArray(children || []);
};

const PeopleModel = function () {
	this.people = ko.observableArray([]);

	this.addChild = function (name, parentArray) {
		parentArray.push(new Person(name));
	};

	this.addPerson =  function (person) {
		this.people.push(new Person("", []))
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

save_btn.addEventListener('click', function (ev) {
	let context = ko.contextFor(document.getElementById('people'))
	let str = JSON.stringify(ko.toJS(context.$data), undefined, 4);
	output(syntaxHighlight(str))
	// print_recursive(context.$data.people())

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
	let pre_tag = document.createElement('pre')
	pre_tag.id = 'pre_tag'
	pre_tag.innerHTML = inp

	let existing_pretag = document.getElementById('pre_tag')
	if(existing_pretag !== null){
		document.getElementById('json_data').removeChild(existing_pretag)
	}
	document.getElementById('json_data').appendChild(pre_tag);
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