const path = require('path');
const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');
class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {nickname, email, password, country, role} = req.body;
            const name = nickname || req.body.name;
            const userData = await userService.registration(name, email, password, country, role);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            console.log(userData);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

   async refresh(req, res) {
  try {
    console.log('cookies:', req.cookies);
    const refreshToken = req.cookies?.refreshToken;
    console.log('refreshToken len:', refreshToken?.length);

    const userData = tokenService.validateRefreshToken(refreshToken);
    console.log('userData:', userData);

    const tokenFromDb = await tokenService.findToken(refreshToken);
    console.log('tokenFromDb:', tokenFromDb);

    if (!userData || !tokenFromDb) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const tokens = tokenService.generateTokens({
      id: userData.id,
      email: userData.email,
      role: userData.role
    });
    console.log('generated tokens ok');

    await tokenService.saveToken(userData.id, tokens.refreshToken);
    console.log('saved token ok');

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/refresh',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.json({ accessToken: tokens.accessToken });
  } catch (e) {
    console.error('REFRESH ERROR:', e);
    return res.status(500).json({ message: 'Refresh error' });
  }
}



    async homePage(req, res, next) {
        res.sendFile(path.join(__dirname, "../../src", "index.html"));
    }
    async loginPage(req, res, next) {
        res.sendFile(path.join(__dirname, "../../src", "login.html"));
    }
    async registerPage(req, res, next) {
        res.sendFile(path.join(__dirname, "../../src", "register.html"));
    }
    async adminPage(req, res, next) {
        res.sendFile(path.join(__dirname, "../../src", "admin.html"));
    }
    async leaderboardPage(req, res, next) {     
        res.sendFile(path.join(__dirname, "../../src", "leaderboard.html"));
    }
    async getMe(req, res, next) {
        try {
            // user data attached by authMiddleware
            const user = req.user;
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async profilePage(req, res, next) {
        res.sendFile(path.join(__dirname, "../../src", "profile.html"));
    }
    async submissionPage(req, res, next) {
        res.sendFile(path.join(__dirname, "../../src", "submission.html"));
    }
    async teamRegPage(req, res, next) {
        res.sendFile(path.join(__dirname, "../../src", "team-register.html"));
    }
    async tournamentPage(req, res, next) {
        res.sendFile(path.join(__dirname, "../../src", "tournament.html"));
    }
    async tournamentsPage(req, res, next) {
        res.sendFile(path.join(__dirname, "../../src", "tournaments.html"));
    }
    async announcementsPage(req, res, next) {
        res.sendFile(path.join(__dirname, "../../src", "announcements.html"));
    }
    
}

module.exports = new UserController();
