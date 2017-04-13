(function() {

    var app = angular.module('contactApp');

    app.component('userProfile', {
		controller: UserController,
		controllerAs: 'uc',
		templateUrl: 'UserProfile/userProfile.html'
	});

    app.controller('loginModalController', LoginModalController);

    UserController.$inject = ['$uibModal', '$firebaseAuth'];
    LoginModalController.$inject = ['$uibModalInstance'];

    function UserController($uibModal, $firebaseAuth) {

        let uc = this;
        let auth = $firebaseAuth();

        uc.user = null;

        auth.$onAuthStateChanged(function(firebaseUser) {
            uc.user = firebaseUser;
        });

        uc.login = function() {

            let modal = $uibModal.open({
                controller: 'loginModalController',
                controllerAs: 'lm',
                templateUrl: 'loginModal.html'
            });

            modal.result.then(
                function(credentials) {
                    auth.$signInWithEmailAndPassword(credentials.email, credentials.password)
                        .then(function(firebaseUser) {
                            console.log('Sign in as: ', firebaseUser.uid);
                        })
                        .catch(function(error) {
                            console.log('Authentication failed: ', error);
                        });
                },
                function() {
                    //cancel
                }
            );
        }

        uc.logout = function() {

            auth.$signOut();
            alert('Fine! Leave, Bitch!');
        }
    }

    function LoginModalController($uibModalInstance) {

        let lm = this;

        lm.errors = [];
        lm.credentials = {
            email: '',
            password: ''
        };

        lm.ok = function() {
            if (validate()) {
                $uibModalInstance.close(lm.credentials);
            }
        };

        lm.cancel = function() {
            $uibModalInstance.dismiss();
        };

        function validate() {

            lm.errors = [];

            if(!lm.credentials.email) {
				lm.errors.push('An email address is required');
			}

			if(!lm.credentials.password) {
				lm.errors.push('A pasword is required');
			}

			return lm.errors.length === 0;
        }
    }

    
})();