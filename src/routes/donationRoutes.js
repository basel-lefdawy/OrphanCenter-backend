const express = require("express");

const publicRouter = express.Router();
const adminRouter = express.Router();

const donationController = require(
  "../controllers/donationController"
);

publicRouter.post(
  "/",
  donationController.create
);

publicRouter.post(
  "/webhook",
  express.json(),
  donationController.webhook
);

adminRouter.get(
  "/",
  donationController.getAll
);

adminRouter.get(
  "/:id",
  donationController.getOne
);

adminRouter.patch(
  "/:id",
  donationController.update
);

adminRouter.delete(
  "/:id",
  donationController.delete
);

module.exports = {
  publicRouter,
  adminRouter,
};
