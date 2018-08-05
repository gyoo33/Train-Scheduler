document.
// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyBLbM7L6NqAf8UnSe1vBXHDFrLv2L3dOJI",
    authDomain: "train-scheduler-7037c.firebaseapp.com",
    databaseURL: "https://train-scheduler-7037c.firebaseio.com",
    projectId: "train-scheduler-7037c",
    storageBucket: "train-scheduler-7037c.appspot.com",
    messagingSenderId: "998252071295"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainFirst = $("#firstTrain-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      first: trainFirst,
      frequency: trainFrequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.first);
    console.log(newTrain.frequency);
  
    alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#firstTrain-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFirst = childSnapshot.val().first;
    var trainFrequency = childSnapshot.val().frequency;
  
    // Train Info
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainFirst);
    console.log(trainFrequency);
    
    // First Time (pushed back to make sure it comes before current time)
    var firstTimeConverted = moment(trainFirst, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var nextTrainG = moment(nextTrain).format("hh:mm A");
    console.log("ARRIVAL TIME: " + nextTrainG);

    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDestination),
      $("<td>").text(trainFrequency),
      $("<td>").text(nextTrainG),
      $("<td>").text(tMinutesTillTrain)
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);

}, function(errorObject){
        console.log("Read failed: " + errorObject.code)
    }
);
