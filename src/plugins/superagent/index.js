import superagent from 'superagent';

/**
 * @Description 接口请求封装 使用superagent发送请求
 * @param {String} url 
 * @param {String} method 
 * @param {Object} params 
 * @param {Object} data 
 * @param {String} cookies 
 * @returns Promise
 */
function ajax(url, method, params, data, cookies) {
	return new Promise(function (resolve, reject) {
		superagent(method, url)
			.query(params)
			.send(data)
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.end(function (err, response) {
				if (err) {
					reject(err)
				}
				resolve(response)
			})
	})
}
export {
	ajax
}
