(function() {

    var app = angular.module('contactApp');

    app.component('searchContacts', {
        controller: SearchController,
		controllerAs: 'sc',
		templateUrl: 'SearchContacts/searchContacts.html',
    });

    SearchController.$inject = ['$state'];

    function SearchController($state) {

        let sc = this;

        sc.searchValue = '';

        sc.search = function() {

            $state.go('search', { query: sc.searchValue });

            sc.searchValue = '';
        }
    }
})();