const {AccessToken} = require('agora-access-token')
const {Token, Priviledges} = AccessToken

// expire timestamp, 0 indicates never expire - note a key is valid for 24 hours maximum
let expireTimestamp = 0;

class ClientToken{

	createToken(appID, appCertificate, channel, uid){
		try{

			let key = new Token(appID, appCertificate, channel.toString(), uid);
			key.addPriviledge(Priviledges.kJoinChannel, expireTimestamp);

			return key.build();

		} catch(err){
			console.log(err)
		}
	}

}

module.exports = new ClientToken();
