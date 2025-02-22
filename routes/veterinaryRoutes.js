import express from "express";
import { createVeterinary, findVeterinary, editVeterinary, deleteVeterinary } from "../controllers/VeterinaryController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/veterinary/create', checkAuth, createVeterinary);
router.get('/veterinary/:id', checkAuth, findVeterinary);
router.patch('/veterinary/:id', checkAuth, editVeterinary);
router.delete('/veterinary/:id', checkAuth, deleteVeterinary);

export default router;