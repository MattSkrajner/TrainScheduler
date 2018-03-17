$(document).ready(function() {
// Initialize Firebase & Added Firebase
  var config = {
    apiKey: "AIzaSyB07GGduZx18XX7Hou_J9fkS5Ts_z_pc-Y",
    authDomain: "train-scheduler-hw-skrajner.firebaseapp.com",
    databaseURL: "https://train-scheduler-hw-skrajner.firebaseio.com",
    projectId: "train-scheduler-hw-skrajner",
    storageBucket: "",
    messagingSenderId: "180696702978"
  };
  firebase.initializeApp(config);
 
 var dataRef = firebase.database();

 $("#submit-btn").on("click", function(event) {
     event.preventDefault();
    
     // declare variables and validate the inputs
     var name = $("#name").val().trim();
     var destination = $("#destination").val().trim();
     var firstTrain = $("#firstTrain").val().trim();
     var frequency = $("#frequency").val().trim();

     // after clicking submit, fields are emptied out

     $("#name").val("");
     $("#destination").val("");
     $("#firstTrain").val("");
     $("#frequency").val("");

     //push data to firebase

     dataRef.ref().push({
         name: name,
         destination: destination,
         time: firstTrain,
         frequency: frequency
     });
 });

 dataRef.ref().on("child_added", function(childSnapshot) {

     var name = childSnapshot.val().name;
     var destination = childSnapshot.val().destination;
     var frequency = childSnapshot.val().frequency;
     var time = childSnapshot.val().time;
     var key = childSnapshot.key;

    // Use Moment to calculate next arrival and minutes away
     var firstTrainConverted = moment(time, "hh:mm").subtract(1, "years");

     // empty () brings current time
     var currentTime = moment();

     // current time displays on jumbotron

     $("#currentTime").html("Current Time: " + moment(currentTime).format("hh:mm"));

     //find the difference between the first train time and the current time

     var timeDifference = moment().diff(moment(firstTrainConverted), "minutes");
     var timeRemainder = timeDifference % frequency;

     //find the minutes until the next train

     var nextTrainMin = frequency - timeRemainder;

     //find the time of the next train arrival

     var nextTrainAdd = moment().add(nextTrainMin, "minutes");
     var nextTrainArr = moment(nextTrainAdd).format("hh:mm");

    // add info to the train scedule table with prepend

     $("#schedule").prepend("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrainArr + "</td><td>" + nextTrainMin + "</td><tr>");


 }, function(err) {
     console.log(err);
 });

});

  