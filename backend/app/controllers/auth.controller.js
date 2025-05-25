const ApiError = require("../api-error");
const authService = require("../services/auth.service");

// Controller function to handle user sign up
exports.signUp = async (req, res, next) => {
  if (!req.body) {
    return next(new ApiError(400, "Content can not be empty!"));
  }

  try {
    const { email, password, firstName, lastName } = req.body;
    const response = await authService.signUp(
      email,
      password,
      firstName,
      lastName
    );
    return res.status(201).json({
      message: "User registered successfully",
      data: response,
    });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error.message || "Some error occurred while signing up the user."
      )
    );
  }
};

// Callback function to verify email after sign up to update user
exports.verifyEmailCallback = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return next(new ApiError(400, "Missing token"));
    }
    await authService.verifyEmailCallback(token);
    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error.message || "Some error occurred while verifying the email."
      )
    );
  }
};

// Controller function to handle user sign in
exports.signIn = async (req, res, next) => {
  if (!req.body) {
    return next(new ApiError(400, "Content can not be empty!"));
  }

  try {
    const { email, password } = req.body;
    const response = await authService.signIn(email, password);
    return res.status(200).json({
      message: "User signed in successfully",
      data: response,
    });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error.message || "Some error occurred while signing in the user."
      )
    );
  }
};
