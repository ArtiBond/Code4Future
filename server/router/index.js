const express = require('express');
const userController = require('../controllers/user-controller');
const router = express.Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/register', userController.registration);
router.get('/refresh', userController.refresh);



router.get('', userController.homePage);
router.get('/login', userController.loginPage);
router.get('/register', userController.registerPage);
router.get('/admin', userController.adminPage);
router.get('/leaderboard', userController.leaderboardPage);
router.get('/profile', userController.profilePage);
router.get('/submission', userController.submissionPage);
router.get('/team-reg', userController.teamRegPage);
router.get('/tournament', userController.tournamentPage);
router.get('/tournaments', userController.tournamentsPage);
router.get('/announcements', userController.announcementsPage);

module.exports = router
