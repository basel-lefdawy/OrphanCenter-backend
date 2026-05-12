const express = require("express");

const router = express.Router();

const donationController = require(
  "../controllers/donationController"
);

router.post(
  "/",
  donationController.create
);

router.get(
  "/admin/donations",
  donationController.getAll
);

router.get(
  "/admin/donations/:id",
  donationController.getOne
);

router.patch(
  "/admin/donations/:id",
  donationController.update
);

router.delete(
  "/admin/donations/:id",
  donationController.delete
);

router.post(
  "/webhook",
  express.json(),
  donationController.webhook
);

module.exports = router;