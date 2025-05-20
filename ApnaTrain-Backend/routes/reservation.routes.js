const express=require ('express');
const router=express.Router();
const {
bookTicket,
getUserReservations,
cancelReservation

}=require('../controllers/reservation.controller.js')

const protect=require('../middlewares/auth.middleware.js')
const authroizeRoles=require('../middlewares/role.middleware.js')


router.post('/book', protect, bookTicket);
router.get('/myreservations', protect, getUserReservations);
router.delete('/cancel/:id', protect, cancelReservation);
router.get('/all', protect, authorizeRoles('admin'), getAllReservations);

module.exports = router;