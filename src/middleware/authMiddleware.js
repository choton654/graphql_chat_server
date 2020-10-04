import jwt from "jsonwebtoken";
import User from "../models/user";

export const createTokens = async (user, refreshSecret) => {
  const createToken = jwt.sign({ user }, process.env.SECRET, {
    expiresIn: "1hr",
  });

  const createRefreshtoken = jwt.sign({ user }, refreshSecret, {
    expiresIn: "7d",
  });

  return [createToken, createRefreshtoken];
};

export const refreshtokens = async (token, refreshtoken) => {
  let userId;

  try {
    const { user } = jwt.decode(refreshtoken);
    userId = user._id;
  } catch (error) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await User.findById(userId);
  // console.log("refresh-user", user);

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
  const token = req.headers["x-token"];
  if (token) {
    try {
      const { user } = jwt.verify(token, process.env.SECRET);
      req.user = user;
    } catch (error) {
      console.log(error);
      const refreshtoken = req.headers["x-refresh-token"];
      const newTokens = await refreshtokens(token, refreshtoken);
      if (newTokens.token && newTokens.refreshToken) {
        res.set("Access-Control-Expose-Headers", "x-token, x-refresh-token");
        res.set("x-token", newTokens.token);
        res.set("x-refresh-token", newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};
