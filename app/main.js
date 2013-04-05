angular.module('auth',[]).
    factory('$erAutentisert', function(){
        return function(userid){
            var regEx =/kumqatBrukernavn=(.*?)(;|$)/g;
            var match = regEx.exec(document.cookie);

            if (match) return true
            else return false;
        }


    });


angular.module('kumqat', ['mongolab','auth']).
    config(function($routeProvider) {
        $routeProvider.
            when('/', {
                controller:sakerController,
                templateUrl:'app/templates/saksliste.html'
            }).
            when('/sak/:sakid',{
                controller:sakController,
                templateUrl:'app/templates/sak.html'
            }).
            when('/logginn',{
                controller:logginnController,
                templateUrl:'app/templates/logginn.html'
            }).
            otherwise({redirectTo:'/'});
    }).
    run(function($erAutentisert,$location){
        if(!$erAutentisert()){
            var targetPath = $location.path();
            document.cookie = 'kumqatDeferer=' + targetPath + "; path=/";
            $location.path('/logginn');
        }
    });

function logginnController($scope, $location){
    $scope.logginn = function(){
        document.cookie = 'kumqatBrukernavn='+$scope.brukernavn + "; path=/";

        var regEx =/kumqatDeferer=(.*?)(;|$)/g;
        var match = regEx.exec(document.cookie);

        if (match) $location.path(match[1]);
        else $location.path('/');
    };

}

function sakController($scope, $location, $routeParams, Sak){
    Sak.get({id:$routeParams.sakid},function(sak){
       $scope.sak = sak;
    });

    $scope.lagre = function(){
        $scope.sak.update();
    }
}

function sakerController($scope, Sak){
    $scope.saker = Sak.query();

    $scope.nySakSkjemaVisibilitet = false;

    $scope.visNySakSkjema = function(){
        $scope.nySakSkjemaVisibilitet = true;
    }

    $scope.leggInnNySak = function(){
        var nySak = new Sak();
        nySak.tittel = $scope.nySakstittel;
        nySak.beskrivelse = $scope.nySaksbeskrivelse;
        nySak.$save();
        $scope.saker.push({tittel:$scope.nySakstittel,beskrivelse:$scope.nySaksbeskrivelse});

        $scope.nySakSkjemaVisibilitet = false;
        $scope.nySakstittel = "";
        $scope.nySaksbeskrivelse = "";
    }
}




