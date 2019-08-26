const {AccessToken} = require('agora-access-token')
const {Token, Priviledges} = AccessToken

// expire timestamp, 0 indicates never expire - note a key is valid for 24 hours maximum
let expireTimestamp = 0;

class ClientToken{

	createToken(appID, appCertificate, channel, uid){

		let key = new Token(appID, appCertificate, channel, uid);
		key.addPriviledge(Priviledges.kJoinChannel, expireTimestamp);

		let token = key.build();
		return token;
	}

}

module.exports = new ClientToken();
