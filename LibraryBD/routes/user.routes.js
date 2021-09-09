const { authJwt } = require("../middleware");
const controller = require("../controller/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
  
  app.patch("/api/test/updateUser", [authJwt.verifyToken], controller.updateUser);

  app.get("/api/test/users", [authJwt.verifyToken], controller.getAllUsers);

  app.put("/api/test/putAuth/:id", [authJwt.verifyToken], controller.authPut);

  app.get("/api/test/user/:userId/books",[authJwt.verifyToken],controller.getIssuedBooks);
  
  app.get("/api/test/users/lateSubmission",[authJwt.verifyToken],controller.getLateSubmissionList);
  

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};