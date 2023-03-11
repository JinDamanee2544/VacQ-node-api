const Hospital = require("../models/Hospital");

// GET /api/v1/hospitals
exports.getHospitals = async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };
  console.log(reqQuery);

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Hospital.find(JSON.parse(queryStr)).populate("appointments");

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Hospital.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  try {
    const hospitals = await query;

    res
      .status(200)
      .json({ success: true, count: hospitals.length, data: hospitals });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// GET /api/v1/hospitals/:id
exports.getHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(400).json({
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      data: hospital,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
    });
  }
};

// POST /api/v1/hospitals
exports.createHospital = async (req, res, next) => {
  const hospital = await Hospital.create(req.body);
  res.status(201).json({
    success: true,
    data: hospital,
  });
};

// PUT /api/v1/hospitals/:id
exports.updateHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!hospital) {
      return res.status(400).json({
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      data: hospital,
    });
  } catch {
    res.status(400).json({
      success: false,
    });
  }
};

// DELETE /api/v1/hospitals/:id
exports.deleteHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(400).json({
        success: false,
        message: `No hospital with ${req.params.id}`,
      });
    }

    await hospital.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Cannot delete hospital",
    });
  }
};
