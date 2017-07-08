module.exports = logout;

var trueResponse = {
    statusCode: 302,
    headers: {
        'content-type': 'application/json',
        'location': ''
    },
    body: {
        status: 'OK'
    }
}

function logout (req, res) {

    res.clearCookie("mynewbiesso");
    res.redirect('/space/create');

}

