const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital,
  getVacCenters,
} = require("../controllers/hospitals");

const router = express.Router();
const appointmentRouter = require("./appointments");

router.route("/vacCenters").get(getVacCenters);

router.use("/:hospitalId/appointments", appointmentRouter);
router
  .route("/")
  .get(getHospitals)
  .post(protect, authorize("admin"), createHospital);
router
  .route("/:id")
  .get(getHospital)
  .put(protect, authorize("admin"), updateHospital)
  .delete(protect, authorize("admin"), deleteHospital);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *   Hospital:
 *    type: object
 *    required:
 *      - name
 *      - address
 *    properties:
 *      id:
 *        type: string
 *        format: uuid
 *        description: The auto-generated id of the hospital
 *        example: 60f1a9a0f0b4f60b94f7e1b1
 *      ลำดับ:
 *        type: string
 *        description: Ordinal number of the hospital
 *      name:
 *        type: string
 *        description: hospital name
 *      address:
 *        type: string
 *        description: House No., Street, Road
 *      district:
 *        type: string
 *        description: District
 *      province:
 *        type: string
 *        description: Province
 *      postalCode:
 *        type: string
 *        description: 5 digit postal code
 *      tel:
 *        type: string
 *        description: Telephone number
 *      region:
 *        type: string
 *        description: Region
 *    example:
 *      id: 60f1a9a0f0b4f60b94f7e1b1
 *      ลำดับ: 1
 *      name: โรงพยาบาลสมเด็จพระยุพราช
 *      address: ถนนพระราม ๒ แขวงบางมด เขตทุ่งครุ กรุงเทพมหานคร 10140
 *      district: บางมด
 *      province: กรุงเทพมหานคร
 *      postalCode: 10140
 *      tel: 02-1234567
 *      region: กทม.
 */

/**
 * @swagger
 * tags:
 *  name: Hospitals
 *  description: Hospital management API
 */

/**
 * @swagger
 * /hospitals:
 *  get:
 *    summary: Returns the list of all the hospitals
 *    tags: [Hospitals]
 *    responses:
 *      200:
 *        description: The list of the hospitals
 *        content:
 *          application/json:
 *             schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Hospital'
 */

/**
 * @swagger
 * /hospital/{id}:
 *  get:
 *    summary: Get the hospital by id
 *    tags: [Hospitals]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The hospital id
 *    responses:
 *      200:
 *        description: The hospital description by id
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Hospital'
 *      404:
 *        description: The hospital was not found
 */

/**
 * @swagger
 * /hospital:
 *  post:
 *    summary: Create a new hospital
 *    tags: [Hospitals]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Hospital'
 *    responses:
 *      200:
 *        description: The hospital was successfully created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Hospital'
 *      500:
 *        description: Some server error
 */

/**
 * @swagger
 * /hospital/{id}:
 *  put:
 *    summary: Update the hospital by the id
 *    tags: [Hospitals]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The hospital id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Hospital'
 *    responses:
 *      200:
 *        description: The hospital was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Hospital'
 *      404:
 *        description: The hospital was not found
 *      500:
 *        description: Some server error
 */

/**
 * @swagger
 * /hospital/{id}:
 *    delete:
 *      summary: Remove the hospital by id
 *      tags: [Hospitals]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The hospital id
 *      responses:
 *        200:
 *          description: The hospital was deleted
 *        404:
 *          description: The hospital was not found
 */
