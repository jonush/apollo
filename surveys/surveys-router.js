const router = require("express").Router();
const restricted = require('../auth/auth-middleware');
const Surveys = require("../surveys/surveys-model");

// GET all surveys
router.get("/", restricted, (req, res) => {
  Surveys.find()
    .then(surveys => {
      res.status(200).json({ data: surveys })
    })
    .catch(err => {
      console.log("GET /", err);
      res.status(500).json({ error: err.message });
    })
});

// GET a survey by id
router.get("/:id", restricted, (req,res) => {
  const { id } = req.params;

  Surveys.findByID(id)
    .then(survey => {
      if(survey) {
        res.status(200).json({ data: survey });
      } else {
        res.status(404).json({ error: `Unable to find survey with id: ${id}` });
      }
    })
    .catch(err => {
      console.log("GET /:id", err);
      res.status(500).json({ error: err.message });
    })
});

// GET all surveys by a leader id
router.get("/topic/:id", restricted, (req,res) => {
  const { id } = req.params;

  Surveys.findByTopicID(id)
    .then(surveys => {
      if(surveys) {
        res.status(200).json({ data: surveys });
      } else {
        res.status(404).json({ error: `Unable to find surveys from Topic ID: ${id}` });
      }
    })
    .catch(err => {
      console.log("GET /topic/:id", err);
      res.status(500).json({ error: err.message });
    })
});

// POST a new survey
router.post("/", restricted, (req, res) => {
  let survey = req.body;

  if(req.body.context === "") {
    res.status(400).json({ error: "Missing survey context" });
  } else {
    Surveys.add(survey)
      .then(newSurvey => {
        res.status(201).json({ data: newSurvey })
      })
      .catch(err => {
        console.log("POST /", err);
        res.status(500).json({ error: "Unable to creat the survey. Please try again." });
      })
  }
});

// EDIT a survey
router.put("/:id", restricted, (req, res) => {
  const { id } = req.params;
  const update = req.body;

  Surveys.findByID(id)
    .then(survey => {
      if(survey) {
        Surveys.edit(update, id)
          .then(updatedSurvey => {
            res.status(200).json({ data: updatedSurvey });
          })
          .catch(err => {
            console.log('PUT /:id', err);
            res.status(400).json({ error: "Unable to update the survey. PLease try again." });
          })
      } else {
        res.status(404).json({ error: `Unable to find a survey with id: ${id}` });
      }
    })
    .catch(err => {
      console.log('PUT /:id', err);
      res.status(500).json({ error: "Error occurred while updating the survey", err });
    })
});

// DELETE a survey
router.delete("/:id", restricted, (req, res) => {
  const  { id } = req.params;

  Surveys.findByID(id)
    .then(survey => {
      console.log(survey);
      Surveys.remove(survey.id)
        .then(removed => {
          console.log(removed);
          res.status(200).json({ message: `The survey with ID: ${id} was successfully deleted.` });
        })
        .catch(err => {
          console.log("DELETE /:id", err);
          res.status(500).json({ error: "There was an error when deleting the issue. Please try again." });
        })
    })
    .catch(err => {
      console.log("DELETE /:id", err);
      res.status(400).json({ error: `The survey with ID: ${id} could not be found.` });
    })
});

module.exports = router;