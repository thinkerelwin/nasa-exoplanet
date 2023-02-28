import express, { Request, Response, NextFunction, Express } from "express";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import helmet from "helmet";
import passport, { Profile } from "passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import cookieSession from "cookie-session";

import api from "./routes/v1/api";

declare global {
  namespace Express {
    interface User {
      id: string | undefined;
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  COOKIE_DEFAULT_KEY: process.env.COOKIE_DEFAULT_KEY,
  COOKIE_OLD_KEY: process.env.COOKIE_OLD_KEY,
};

const configKeys = Object.keys(config) as Array<keyof typeof config>;

configKeys.forEach((key) => {
  if (!config[key]) {
    throw new Error("config have missing values");
  }
});

function verifyCallback(
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback
) {
  done(null, profile);
}

passport.use(
  new Strategy(
    {
      callbackURL: "/auth/google/callback",
      clientID: config.CLIENT_ID!,
      clientSecret: config.CLIENT_SECRET!,
    },
    verifyCallback
  )
);

// Save the session to the cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Read the seesion from the cookie
passport.deserializeUser((id: Express.User, done) => {
  done(null, id);
});

function checkLoggedIn(req: Request, res: Response, next: NextFunction) {
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    return res.status(401).json({
      error: "please log in",
    });
  }
  next();
}

const app = express();

app.use(helmet());
app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_DEFAULT_KEY!, config.COOKIE_OLD_KEY!],
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: "https://localhost:3000",
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", api);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    successRedirect: "/",
    session: true,
  }),
  (req: Request, res: Response) => {
    console.log("Google callback");
  }
);

app.get("/auth/failure", (req: Request, res: Response) => {
  return res.send("Failed to log in!");
});

app.get("/auth/logout", (req: Request, res: Response, next: NextFunction) => {
  // Removes req.user and clears any logged in session
  req.logOut();
  res.redirect("/");
});

app.get("/secret", checkLoggedIn, (req: Request, res: Response) => {
  return res.send("This is the secret");
});

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

export default app;
