const { google } = require('googleapis');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const decode = require('jwt-decode');

const {
  SERVER_ROOT_URI,
  GOOGLE_CLIENT_ID,
  JWT_SECRET,
  GOOGLE_CLIENT_SECRET,
  COOKIE_NAME,
  UI_ROOT_URI,
} = require('../config/config');
const getTokens = require('../utils/getGoogleTokens');
const { getUserEmail } = require('../users/getUsers');
const AppError = require('../utils/AppError');

//get the url for frontend (google login modal)
exports.getUrl = (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,

    'http://localhost:3000/auth/google'
  );

  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes, // If you only need one scope you can pass it as string
  });
  //console.log(url);
  res.send(url);
};

exports.getAuthUser = async (req, res, next) => {
  // const oauth2Client = new google.auth.OAuth2(
  //   GOOGLE_CLIENT_ID,
  //   GOOGLE_CLIENT_SECRET,

  //   'http://localhost:3000/auth/google'
  // );
  const code = req.query.code;
  console.log(code);
  let data;

  data = await getTokens({
    code,
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: `${SERVER_ROOT_URI}/auth/google`,
  });
  const content = {
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    refresh_token: data.refresh_token,
    grant_type: 'refresh_token',
  };

  console.log(data);
  // console.log(id_token);
  // console.log(refresh_token);
  // console.log('ace', access_token);
  // Fetch the user's profile with the access token and bearer

  // compare Date.now and exp date of the token

  console.log(Date.now());
  const decodedValue = decode(data.id_token);
  console.log(decodedValue.exp * 1000);
  const exp_date = decodedValue.exp * 1000;
  console.log(new Date(exp_date));
  const refresh_date = (decodedValue.exp - 500) * 1000;
  console.log(refresh_date);
  console.log(new Date(refresh_date));

  if (Date.now() > refresh_date) {
    data = await axios.post(
      'https://www.googleapis.com/oauth2/v4/token',
      content
    );
  }
  console.log(data);

  //use conditional operator.if >exp refresh access token else use same token

  googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${data.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${data.id_token}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch user`);
      throw new Error(error.message);
    });

  console.log(googleUser);

  try {
    const getUserData = await getUserEmail(googleUser.email);
    if (getUserData.length === 0) {
      return next(new AppError('You cannot login '));
    }
    //console.log(getUserData);
    const token = jwt.sign(googleUser, JWT_SECRET);

    res.cookie(COOKIE_NAME, token, {
      maxAge: 900000,
      httpOnly: true,
      secure: false,
    });

    res.redirect(UI_ROOT_URI);
    // console.log(token);
    // res.status(200).json(token);
  } catch (err) {
    res.send(err.message);
  }
};

exports.getMe = (req, res) => {
  try {
    const cookies = req.header('x-auth-token');
    console.log(cookies);
    const decoded = jwt.verify(cookies, JWT_SECRET);
    res.status(200).json(decoded);
  } catch (err) {
    console.log(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    const cookies = req.header('x-auth-token');
    // console.log(cookies);
    if (!cookies) {
      return next(new AppError('You are not logged in'));
    }
    const decoded = jwt.verify(cookies, JWT_SECRET);
    const getUserData = await getUserEmail(decoded.email);
    if (getUserData.length === 0) {
      return next(new AppError('You cannot login '));
    }
    req.user = getUserData[0];
    console.log(getUserData[0]);
    next();
  } catch (err) {
    res.send(err.message);
  }
};

exports.restrictTo =
  (...roles) =>
  async (req, res, next) => {
    console.log(roles);
    console.log(req.user.roles);
    if (!roles.includes(req.user.roles)) {
      return next(new AppError('You do not have access', 403));
    }
    next();
  };
