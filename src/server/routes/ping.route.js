const pingRoute = (req, res) => {
    if (req.method === 'GET' && req.url === '/ping') {
		res.writeHead(200)
		res.write('pong')
		return res.end()
	}
}

module.exports = { pingRoute }