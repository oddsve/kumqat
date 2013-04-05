angular.module('mongolab', ['ngResource']).
    factory('Sak', function($resource) {
        var Sak = $resource('https://api.mongolab.com/api/1/databases' +
            '/kumqat-test/collections/saker/:id',
            { apiKey: 'b_-FHW2TYqcz-04irTg9prtHoKwLpYf1' },
            { update: { method: 'PUT' } }
        );

        Sak.prototype.update = function() {
            return Sak.update({id: this._id.$oid},
                angular.extend({}, this, {_id:undefined}));
        };

        return Sak;
    });