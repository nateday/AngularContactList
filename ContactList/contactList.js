(function () {

	var app = angular.module('contactApp');

	app.component('contactList', {
		controller: ContactList,
		controllerAs: 'cl',
		templateUrl: 'ContactList/contactList.html'
	});

	app.controller('addContactModalController', AddContactModalController);

	ContactList.$inject = ['$firebaseArray', '$stateParams', '$uibModal'];
	AddContactModalController.$inject = ['$uibModalInstance'];

	function ContactList($firebaseArray, $stateParams, $uibModal) {

		var cl = this;

		cl.$onInit = function () {

            console.log($stateParams.category);

			cl.category = $stateParams.category || 'Family';
			
			var ref = null;
				
			if (cl.category === 'All') {
				ref = firebase.database().ref().child('contacts');
			}
			else {
				ref = firebase.database().ref().child('contacts')
					.orderByChild('category')
					.equalTo(cl.category);
			}
			
			cl.contacts = $firebaseArray(ref);

			console.log($stateParams);
		}

		cl.addContact = function () {

			let modal = $uibModal.open({
				controller: 'addContactModalController',
				controllerAs: 'cmc',
				templateUrl: 'addContactModal.html'
			});

			modal.result.then(
				function(newContact) {
					if(newContact.firstName) {

						newContact.category = cl.category;

						cl.contacts.$add(angular.copy(newContact));
					}
				},
				function() {
					//cancel
				}
			);
		}

		cl.deleteContact = function (index) {

			var contact = cl.contacts[index];

			cl.contacts.$remove(contact);
		}
	}



	function AddContactModalController($uibModalInstance) {

		let cmc = this;

		cmc.errors = [];
		cmc.newContact = {
			firstName: '',
			lastName: '',
			phone: ''
		};

		cmc.addContact = function() {
			if(cmc.validate()) {
				$uibModalInstance.close(cmc.newContact);
			}
		};

		cmc.cancel = function() {
			$uibModalInstance.dismiss();
		};

		cmc.validate = function() {

			cmc.errors = [];

			if(!cmc.newContact.firstName) {
				cmc.errors.push('A first name is required');
			}

			if(!cmc.newContact.phone) {
				cmc.errors.push('A phone number is required');
			}

			return cmc.errors.length === 0;
		}
	}

})();