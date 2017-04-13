(function () {

    var app = angular.module('contactApp');

    app.component('searchResults', {
        controller: SearchResultsController,
        controllerAs: 'src',
        templateUrl: 'SearchResults/searchResults.html',
    });

    SearchResultsController.$inject = ['$stateParams', '$firebaseArray'];

    function SearchResultsController($stateParams, $firebaseArray) {

        let src = this;
        let ref = null;

        src.contacts = [];
        src.contactList = [];
        src.query = $stateParams.query;

        src.$onInit = function () {

            ref = firebase.database().ref().child('contacts');
            src.contacts = $firebaseArray(ref);

            src.contacts.$loaded()
                .then(function (data) {
                    if (src.query) {

                        src.contactList = src.contacts.filter((contact) => {

                            return contact.firstName.toUpperCase().includes(src.query.toUpperCase()) ||
                                contact.lastName.toUpperCase().includes(src.query.toUpperCase());
                        });
                    }
                })
                .catch(function (error) {
                    console.error("Error:", error);
                });
        }
    }
})();