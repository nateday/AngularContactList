(function () {

	var app = angular.module('contactApp');

	app.component('contactDetail', {
		controller: ContactDetail,
		controllerAs: 'cd',
		templateUrl: 'ContactDetail/contactDetail.html',
		bindings: {
		}
	});

	app.controller('contactDetailModalController', ContactDetailModalController);

	ContactDetail.$inject = ['$state', '$stateParams', '$firebaseObject','$uibModal'];
	ContactDetailModalController.$inject = ['$stateParams', '$firebaseObject', '$uibModalInstance'];

	function ContactDetail($state, $stateParams, $firebaseObject, $uibModal) {

		var cd = this;
		var contactId = $stateParams.id;
		cd.contacts = [];

		cd.delete = function () {
			cd.contact.$remove();
			$state.go('dashboard', { category: cd.category });
		}

		cd.contactDetail = function() {

			let modal = $uibModal.open({
				controller: 'contactDetailModalController',
				controllerAs: 'dmc',
				templateUrl: 'contactDetailModal.html'
			});

			modal.result.then(
				function(contact) {
					
					cd.contact.firstName = contact.firstName;
					cd.contact.lastName = contact.lastName;
					cd.contact.phone = contact.phone;

					cd.contact.$save();
				},
				function() {
					//cancel
				}
			);
		}

		cd.$onInit = function () {

			var ref = firebase.database().ref().child('contacts').child(contactId);

			cd.contact = $firebaseObject(ref);

			cd.contact.$loaded()
				.then(function (data) {
					cd.category = cd.contact.category;
					console.log(cd.category);
				})
				.catch(function (error) {
					console.error("Error:", error);
				});
		}
	}

	function ContactDetailModalController($stateParams, $firebaseObject, $uibModalInstance) {

		let dmc = this;
		let contactId = $stateParams.id;

		dmc.errors = [];

		dmc.saveContact = function() {
			if(dmc.validate()) {
				$uibModalInstance.close(dmc.contact);
			}
		}

		dmc.cancel = function() {

			$uibModalInstance.dismiss();
		}

		dmc.validate = function() {

			dmc.errors = [];

			if(!dmc.contact.firstName) {
				dmc.errors.push('A first name is required');
			}

			if(!dmc.contact.phone) {
				dmc.errors.push('A phone number is required');
			}

			return dmc.errors.length === 0;
		}

		dmc.$onInit = function() {

			console.log('Contact Id: ', $stateParams);

			var ref = firebase.database().ref().child('contacts').child(contactId);

			dmc.contact = $firebaseObject(ref);

			dmc.contact.$loaded()
				.then(function (data) {
					dmc.category = dmc.contact.category;
					console.log(dmc.category);
				})
				.catch(function (error) {
					console.error("Error:", error);
				});
		}
	}

})();