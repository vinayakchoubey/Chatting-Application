import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER_CLIENT_ID",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER_CLIENT_SECRET",
            callbackURL: process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/auth/google/callback` : "https://chatting-application-ye45.onrender.com/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                let user = await User.findOne({ email });

                if (user) {
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        // If the user wasn't verified before, Google verifies email
                        if (!user.isVerified) user.isVerified = true;
                        await user.save();
                    }
                    return done(null, user);
                } else {
                    user = new User({
                        fullName: profile.displayName,
                        email: email,
                        googleId: profile.id,
                        profilePic: profile.photos[0].value,
                        password: "", // No password for google users
                        isVerified: true,
                    });
                    await user.save();
                    return done(null, user);
                }
            } catch (error) {
                return done(error, null);
            }
        }
    )
);
