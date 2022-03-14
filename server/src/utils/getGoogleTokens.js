const querystring = require('query-string');
const axios = require('axios');

const getTokens = ({ code, clientId, clientSecret, redirectUri }) => {
  const url = 'https://oauth2.googleapis.com/token';
  console.log(code);
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  };

  return axios
    .post(url, querystring.stringify(values), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      throw new Error(error.message);
    });
};

module.exports = getTokens;
