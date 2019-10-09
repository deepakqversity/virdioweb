class Response {

	resp(res, code, data){
		let respData = {
			responseCode: 200,
			responseStatus: 1,
			responseMessage: 'success',
			responseData: {},
			errorData: {}
		};

		if(code == 200){
			respData.responseData = data;
		} else {
			respData.responseCode = code;
			respData.responseStatus = 0;
			respData.responseMessage = 'failed';
			respData.errorData = data;

		}
		return res.status(code).send(respData);
	}
}
module.exports = new Response();