import jwt from 'jsonwebtoken';
import User from '../models/user';

export const createTokens = async (user, refreshSecret) => {
  const createToken = jwt.sign({ id: user._id }, process.env.SECRET, {
    expiresIn: '1hr',
  });

  const createRefreshtoken = jwt.sign({ id: user._id }, refreshSecret, {
    expiresIn: '7d',
  });

  return [createToken, createRefreshtoken];
};

export const refreshtokens = async (token, refreshtoken) => {
  let userId;

  try {
    const { id } = jwt.decode(refreshtoken);
    userId = id;
  } catch (error) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await User.findById(userId);

  if (!user) {
    return {};
  }

  const refreshSecret = user.password + process.env.SECRET2;

  try {
    jwt.verify(refreshtoken, refreshSecret);
  } catch (error) {
    return {};
  }

  const [newToken, newRefreshtoken] = await createTokens(user, refreshSecret);

  return {
    token: newToken,
    refreshtoken: newRefreshtoken,
    user,
  };
};

export const auth = async (req, res, next) => {
  const token = req.headers.token ? req.headers.token : '';
  console.log('token', token);
  if (token) {
    try {
      jwt.verify(token, process.env.SECRET, (err, decode) => {
        if (err) {
          console.error(err);
        }
        console.log(decode);
        req.userId = decode.id;
      });
    } catch (error) {
      const refreshtoken = req.headers.refreshtoken
        ? req.headers.refreshtoken
        : '';
      const newTokens = await refreshtokens(token, refreshtoken);
      if (newTokens.token && newTokens.refreshToken) {
        res.setHeader('token', newTokens.token);
        res.setHeader('refreshtoken', newTokens.refreshToken);
      }
      req.userId = newTokens.user._id;
    }
  }
  next();
};
