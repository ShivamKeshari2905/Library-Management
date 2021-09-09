const db = require("../models");
const Book = db.books;
const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.updateUser = (req, res) => {
  const userId = req.body.id;
  const book = req.body.book;
  const bookId = book._id;
  let query = { $push: { borrows: book } };
  console.log("----------------- inserting a book", bookId, book);
  try {
    User.findByIdAndUpdate({ _id: userId }, query).exec((err, user) => {
      if (err) {
        console.log("error occured", err);
        res.status(500).send(err);
      }
      if (user) {
        console.log("sucess in user", user);
        return res.status(200).send(user);
      }
    });
  } catch (err) {
    console.log("exception via updating", err);
    res.status(500).send(err);
  }
};

exports.getAllUsers = (req, res) => {
  console.log("reached");
  User.find()
    .then((data) => {
      console.log("reached to", data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retrieving users.",
      });
    });
};

exports.authPut = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;
  console.log(id, req.body);

  User.findByIdAndUpdate(id, req.body, { userFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User!`,
        });
      } else res.send({ message: "auth was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating in user",
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  User.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete user with id=${id}. Maybe user was not found!`,
        });
      } else {
        res.send({
          message: "user was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete user with id=" + id,
      });
    });
};

exports.getIssuedBooks = (req, res) => {
  console.log("req", req.params.userId);
  User.findOne({ _id: req.params.userId })
    .select({ borrows: 1 })
    .populate({
      path: "borrows",
      populate: {
        path: "_id",
        model: Book,
      },
    })
    .exec(function (err, books) {
      if (err) {
        console.log(err);
        res.status(404).send({
          message: "could not find books",
        });
      } else {
        console.log("found books", books);
        res.status(200).send(books);
      }
    });
};

exports.getLateSubmissionList = (req, res) => {
  console.log("Inside Late Submission Fn");

  let start = new Date();
  start.setHours(0, 0, 0, 0);

  const matchingStage = {
    $match: {
      "borrows.submissiondate": {
        $gte: start,
      },
    },
  };

  const unwindStage = {
    $unwind: "$borrows",
  };
  const projectionStage = {
    $project: {
      email: 1,
      username: 1,
      mobile: 1,
      borrows: {
        $filter: {
          input: "$borrows",
          as: "item",
          cond: {
            $gte: [new Date(), "$$item.submissiondate"],
          },
        },
      },
    },
  };

  const populationStage = {
    $lookup: {
      from: "books",
      localField: "borrows._id",
      foreignField: "_id",
      as: "borrows.book",
    },
  };

  const deprojectionStage = {
    $project: {
      "borrows._id": 0,
      "borrows.book.borrower": 0,
      "borrows.book.createdAt": 0,
      "borrows.book.updatedAt": 0,
      "borrows.book.category": 0,
      "borrows.book.quantity": 0,
    },
  };

  User.aggregate([
  //projectionStage
    projectionStage, unwindStage, populationStage, deprojectionStage
  ])
    .then((data) => {
      console.log("aggregate response", JSON.stringify(data));
      res.status(200).send(data);
    })
    .catch((err) => {
        console.log("aggregate error", err);
        res.status(500).send(err);
    });
};
