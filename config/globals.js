
// array of global variables
module.exports = {
    // db: 'mongodb://localhost/comp2068-w2017' // local mongodb
    db: 'mongodb://ybpatel:yopatel56@ds157500.mlab.com:57500/passwordreset',
    facebook:{
        clientID: '659071204278997',
        clientSecret: '30b18f162bb9dc396609ccfcd924b090',
        callbackURL: 'http://localhost:3000/facebook/callback'
    },
    google:
    {
        clientID:'933970860551-87fulqlbkr3ntqcp18r6otct1v2eolfm.apps.googleusercontent.com',
        clientSecret: '_Sezxhr7AK206nY3o9TF3m_j',
        callbackURL: 'http://localhost:3000/google/callback'
    }
};
