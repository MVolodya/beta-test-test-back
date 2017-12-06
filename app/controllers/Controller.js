Votest
  .controller('Controller', function($scope, $http){
    var myPieChart;
    var socket = io('http://178.210.131.158:3000');
    var url = 'http://178.210.131.158:3000/api/'
    var finalRequest = {'type': 'pie', 'question': 'Нода це круто?', 'answers': ['Так','Ні', 'ХЗ', 'Сумніваюся']};
    var finalJson = JSON.stringify(finalRequest);

    var ctx = document.getElementById("myChartt").getContext('2d'),
        colors = [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)' 
        ];

    $scope.createPoll = function (){
      $http({ 
        method: 'POST', 
        url: url + 'create',
        data: finalJson
      });
    }

    $scope.vote = function (i){
      var key = document.getElementById("Key").value;
      let vote = {vote: i};
      $http({ 
        method: 'PUT', 
        url: url + 'poll/'+key+'/ans'+i,
        data: JSON.stringify(vote)
      })
      .then(function(response){
          console.log(response.data);
          socket.emit('vote');
        });
    }

    $scope.getAnswers = function (){
      // var key = document.getElementById("Key").value;
      // $http({ 
      //   method: 'GET', 
      //   url: 'http://127.0.0.1:8000/getAnswers/' + key
      // })
      //   .then(function(response){
      //     socket.emit('vote');
      //   });
    }

    $scope.getPoll = function (){
      var key = document.getElementById("Key").value;
      $http({ 
        method: 'GET', 
        url: url + 'poll/' + key,
      })
        .then(function(response){
          var obj = response.data.response,
              data = [],
              answers = [];
          for (let key in obj.answers) {
            data.push(obj.answers[key].counter)
          };
          for (let key in obj.answers) {
            answers.push(obj.answers[key].answer)
          };
          $scope.questionTitle = obj.question;
          var data = {
            datasets: [{
              data: data,
              backgroundColor: colors
            }],
            labels: answers
          };
          myPieChart = new Chart(ctx,{
            type: obj.type,
            data: data
          });
          console.log(myPieChart);
          socket.emit('join', {room: key });
        });
    }

    socket.on('update', function (obj) {
      console.log(myPieChart.data.datasets[0].data)
      var newData = [];
      for (let key in obj) {
        newData.push(obj[key].counter)
      };
      myPieChart.data.datasets[0].data = newData;
      myPieChart.update();
    });

  });