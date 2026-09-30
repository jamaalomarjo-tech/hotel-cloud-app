var client = require('../redis.js');

async function cache(req, res, next) {
    const data = await client.get(req.originalUrl);

    if (data !== null) {

        if (req.originalUrl === '/users') {
            return res.render('users', {
                users: JSON.parse(data)
            });
        }

        if (req.originalUrl.startsWith('/users/')) {
            return res.render('userDetails', {
                user: JSON.parse(data),
                username: req.user ? req.user.username : null
            });
        }
if (req.originalUrl === '/hotels') {
    return res.render('hotels', {
        hotels: JSON.parse(data),
        user: req.user,
        username: req.user ? req.user.username : null
    });
}
        if (req.originalUrl.startsWith('/hotels/')) {
            const hotel = JSON.parse(data);
            const userId = req.user?.id ?? 0;
            const username = req.user?.username ?? 0;

            return res.render('hotelDetails', {
                hotel: hotel,
                userId,
                user: req.user,
                username
            });
        }

        res.render('rooms', {
            rooms: JSON.parse(data),
            userId: req.user ? req.user.id : null,
            username: req.user ? req.user.username : null,
            isAdmin: req.user ? req.user.isAdmin : false
        });

    } else {
        next();
    }
}

module.exports = cache;