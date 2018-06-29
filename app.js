var BASE_URL = "http://localhost:8080/";

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider){
    $routeProvider
        .when(
        "/display-records", {
            templateUrl: "views/display-records.html",
            controller: "displayRecordController"
        }).when(
        "/add-record", {
            templateUrl: "views/add-record.html",
            controller: "addRecordController"
        }).when(
        "/update-record/:personId", {
            templateUrl: "views/update-record.html",
            controller: "updateRecordController"
        });
});

app.controller("displayRecordController", function($scope, $http){
    $http({
        method: 'GET',
        url: BASE_URL+'all'
    }).then(function mySuccess(response){
        $scope.people = response.data;  
    });
    $scope.orderByFunction = function(parameter){
        $scope.myOrderBy = parameter;
    }

    $scope.deleteRecord = function(person){
        var deleteStatus = confirm('Are you sure you want to delete this item?');

        if(deleteStatus){
            $http({
                method: "DELETE",
                url: BASE_URL+"delete/"+person.id
            }).then(function success(response){
                response.status == 200?alert("Record deleted successfully."):alert("Some problem occured while deleting.");
                //Removing the data from the array of object
                var index = $scope.people.indexOf(person);
                $scope.people.splice(index, 1);
            }, function error(response){
                alert(response.data.error);
            });
        }
    }
});

app.controller("addRecordController", function($scope, $location, $http){
    $scope.submit = function(){
        var formData = $("#person-form").serializeObject();
        $http({
            method: 'POST',
            url: BASE_URL+'save',
            data: formData,
        }).then(function (response){
            response.data?alert("Record added successfully."):alert("Some problem occured.");
            $location.url('#!add-record');

        });
    }
});

app.controller("updateRecordController", function($scope, $location, $http, $routeParams){
    var personId = $routeParams.personId;
    $http({
        method: 'GET',
        url: BASE_URL+'get/'+personId
    }).then(function mySuccess(response){
        $scope.person = response.data;
    });

    $scope.submit = function(){
        var formData = $("#person-form").serializeObject();
        $http({
            method: 'POST',
            url: BASE_URL+'update/'+personId,
            data: formData,
        }).then(function (response){
            response.data?alert("Record updated successfully."):alert("Some problem occured.");
            return $location.path('#!/display-records');

        });
    }
});
