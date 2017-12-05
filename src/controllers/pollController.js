import db from "../config/db.js";
import generateID from "../config/IDGenerator";

exports.GETlistOfAllPolls = async (req, res) => {
  try {
    const baseSnapshot = db.ref("polls/").once("value");

    const pollsSnapshot = await baseSnapshot;

    const response = pollsSnapshot.val();

    if (!response) {
      res.status(404).json({ response, status: "Error 404 Not Found" });
      console.log("Synchronization failed");
    } else {
      res.status(200).json(response);
      console.log("Synchronization succeeded");
    }
  } catch (error) {
    res.status(404).send(`ERROR ::: ${error}`);
    console.log(`ERROR ::: ${error}`);
  }
};

exports.GETpollID = async (req, res) => {
  try {
    const pollsSnapshot = await db.ref(`polls/${req.params.id}`).once("value");
    const response = pollsSnapshot.val();
    if (!response) {
      res.status(404).json({ response, status: "Error 404 Not Found" });
      console.log("Synchronization failed");
    } else {
      res.status(200).json({ response, status: "Synchronization succeeded" });
      console.log("Synchronization succeeded");
    }
  } catch (error) {
    res.status(404).send(`ERROR ::: ${error}`);
    console.log(`ERROR ::: ${error}`);
  }
};

exports.create = function(req, res) {
  let uid = generateID(5);
  let dz = new Date().toString();
  console.log("generateID", uid);
  db
    .ref(`polls/${uid}`)
    .set({
      answers: {
        [uid + "_1"]: {
          ans: "This1",
          cou: "2"
        },
        [uid + "_2"]: {
          ans: "This2",
          cou: "2"
        }
      },
      question: "Го цілу ніч програмувати?",
      type: "this is type",
      timestamp: dz
    })
    .then(function() {
      res.status(200);
      console.log("Synchronization succeeded");
    })
    .catch(function(error) {
      res.status(404).send("Error ::: Not ::: Found.");
      console.log("Synchronization failed");
    });
  res.json({
    message: "hooray! welcome to our api!"
  });
};

exports.POSTCreatePoll = (req, res) => {
  let uid = generateID(5);

  let createDate = new Date().toString();

  const { type, question, answers } = req.body;

  let newAnswers = answers.reduce((previousValue, currentItem, index) => {
    previousValue["ans" + index] = {
      answer: currentItem,
      counter: 0
    };
    return previousValue;
  }, {});

  db.ref(`polls/${uid}`).set(
    {
      question: question,
      answers: newAnswers,
      type: type,
      timestamp: createDate
    },
    error => {
      if (error) {
        res.status(500).send(`ERROR ::: ${error}`);
      } else {
        res.status(201).send(`Poll created, your poll id: ${uid}`);
      }
    }
  );
};

exports.PUTPollAnswers = async (req, res) => {
  try {
    const baseSnapshot = db.ref(
      `polls/${req.params.id}/answers/${req.params.ansid}`
    );
    const valSnapshot = baseSnapshot.once("value");

    const pollsSnapshot = await valSnapshot;

    const response = pollsSnapshot.val();

    if (!response) {
      res.status(404).json({
        response,
        status: "Error 404 Not Found"
      });
      console.log("Synchronization failed");
    } else {
      const updatedPollSnapshot = db
        .ref(`polls/${req.params.id}/answers/${req.params.ansid}`)
        .once("value");

      baseSnapshot.update({
        counter: response.counter + 1
      });

      const updatedPoll = await updatedPollSnapshot;

      const updatedResponse = updatedPoll.val();

      res
        .status(200)
        .json({ updatedResponse, status: "Poll updated successfully" });
      console.log("Synchronization succeeded");
    }
  } catch (error) {
    res.status(404).send(`ERROR ::: ${error}`);
    console.log(`ERROR ::: ${error}`);
  }
};
