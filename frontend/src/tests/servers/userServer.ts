import { rest } from "msw";
import { setupServer } from "msw/node";

import { user1, user2, user3, user4 } from "../data/users";

const userServer = setupServer(
  rest.get("https://api.escuelajs.co/api/v1/users", (req, res, ctx) => {
    return res(ctx.json([user1, user2, user3, user4]));
  }),

  rest.post("https://api.escuelajs.co/api/v1/auth/login", (req, res, ctx) => {
    const result = {
      access_token: "your-access-token",
    };

    return res(ctx.json(result));
  }),

  rest.get("https://api.escuelajs.co/api/v1/auth/profile", (req, res, ctx) => {
    return res(ctx.json(user1));
  })
);

export default userServer;
