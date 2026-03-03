const express = require('express');
const userController = require('../controllers/user-controller');
const router = express.Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

// original '/registration' kept for compatibility but redirects to '/register'
router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration
);

// primary registration route with validation, matches front-end action
router.post('/register',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration
);

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/refresh', userController.refresh);

// user info
router.get('/me', authMiddleware, userController.getMe);

router.get('', userController.homePage);
router.get('/login', userController.loginPage);
router.get('/register', userController.registerPage);
router.get('/admin', userController.adminPage);
router.get('/leaderboard', userController.leaderboardPage);
// profile page is public; client script will validate token and redirect if necessary
router.get('/profile', userController.profilePage);
router.get('/submission', userController.submissionPage);
router.get('/team-reg', userController.teamRegPage);
router.get('/tournament', userController.tournamentPage);
router.get('/tournaments', userController.tournamentsPage);
router.get('/announcements', userController.announcementsPage);
router.get('/juryRated', userController.juryRatedPage);
router.get('/juryProfile', userController.juryProfilePage); 

module.exports = router
