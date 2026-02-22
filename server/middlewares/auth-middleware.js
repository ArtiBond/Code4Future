const tokenService = require('../service/token-service');
const ApiError = require('../exceptions/api-error');

module.exports = function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ApiError.UnauthorizedError());
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return next(ApiError.UnauthorizedError());
        }
        const userData = tokenService.validateAccessToken(token);
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }
        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
}
