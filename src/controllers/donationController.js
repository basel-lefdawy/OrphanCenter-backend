const DonationService = require(
  "../services/donationService"
);

exports.create = async (req, res) => {
  try {
    const result =
      await DonationService.create(
        req.body
      );

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const donations =
      await DonationService.getAll();

    res.json(donations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getOne = async (req, res) => {
  try {
    const donation =
      await DonationService.getOne(
        req.params.id
      );

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }

    res.json(donation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const donation =
      await DonationService.update(
        req.params.id,
        req.body
      );

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }

    res.json(donation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted =
      await DonationService.delete(
        req.params.id
      );

    if (!deleted) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.webhook = async (req, res) => {
  try {
    const event = req.body;

    if (
      event.type ===
      "payment_intent.succeeded"
    ) {
      const paymentIntent =
        event.data.object;

      await DonationService.markAsPaid(
        paymentIntent.id
      );
    }

    res.json({
      received: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};