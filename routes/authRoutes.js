const {Router} = require('express');
const authController = require('../controllers/authController.js');
const { userLoggedIn } = require('../middlewares/authMiddleware.js');
const {sensitiveCacheControl} = require('../middlewares/clearCacheMiddleware.js')

const router = Router();
 

// routes

router.get('/login',userLoggedIn, sensitiveCacheControl , authController.login_get);
router.get('/signup',userLoggedIn,sensitiveCacheControl, authController.signup_get);

router.post('/login', authController.login_post);
router.post('/signup', authController.signup_post);
router.get('/logout', authController.logout_get);

module.exports = router; 