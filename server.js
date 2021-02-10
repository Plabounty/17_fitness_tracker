const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
let Workout = require("./models");

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false,
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/stats", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/stats.html"));
});

app.get("/exercise", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/exercise.html"));
});

app.post("/api/workouts", async function (req, res) {
  const newWorkout = await Workout.create({excercises:[]})
  console.log(newWorkout);
   res.json(newWorkout);
  // .then(function (newWorkout) {
  //   console.log(newWorkout);
  //   res.json(newWorkout);

  // });
});

app.put("/api/workouts/:id", async function (req, res) {
  const exsistingWorkout = await Workout.findOne({_id:req.params.id});
  let newExercise = {
    type: req.body.type, 
    name: req.body.name,
    duration: req.body.duration
  }
  if(req.body.type === "resistance"){
    newExercise.weight = req.body.weight;
    newExercise.sets = req.body.sets;
    newExercise.reps = req.body.reps;
  } else {
    newExercise.distance = req.body.distance
  }
  exsistingWorkout.exercises.push(newExercise)
  
  exsistingWorkout.save()
   res.json(exsistingWorkout);
});

app.get("/api/workouts/range", range)
app.get("/api/workouts", range)
async function range(req, res){
   res.json(await Workout.find({}));
}
// routes
// app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port http://localhost:${PORT}!`);
});
