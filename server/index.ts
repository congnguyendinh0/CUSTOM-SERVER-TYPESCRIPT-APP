require("isomorphic-fetch");
import { config } from "dotenv";
import Application from "koa";
import shopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import session from "koa-session";
import proxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import next from "next";
import koaBody from "koa-body";
import { any } from "prop-types";
import Router from "koa-router";
import Axios, { AxiosResponse } from "axios";

config();

const port = parseInt(process.env.PORT || "4040", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET_KEY }: any = process.env;
const handle = app.getRequestHandler();
const router: Router<any, {}> = new Router<any, {}>();

router.use(koaBody());

/**
 * ROUTEN
 */
router.get("/", (ctx, next) => {
  ctx.redirect("/index");
});

router.get("/api/getBlogs", async (ctx, next) => {
  ctx.accepts("application/json");

  await Axios({
    method: "GET",
    headers: {
      "X-Shopify-Access-Token":
        ctx.cookies.get("accessToken") || ctx.get("x-shopify-access-token")
    },
    url: `https://${ctx.cookies.get("shopOrigin")}/admin/api/2019-10/blogs.json`
  })
    .then((res: AxiosResponse<any>) => {
      console.log(res);
      return (ctx.body = res.data); // returns blogs[blog]
    })
    .catch((err: any) => {
      console.log(err);
      return next();
    });
});

app.prepare().then(() => {
  const server = new Application();
  server.keys = [SHOPIFY_API_SECRET_KEY];
  server
    .use(session(server))
    .use(router.routes())
    .use(router.allowedMethods())
    .use(
      shopifyAuth({
        apiKey: SHOPIFY_API_KEY,
        secret: SHOPIFY_API_SECRET_KEY,
        scopes: [
          "write_products",
          "read_products",
          "write_orders",
          "read_orders",
          "read_content",
          "write_content",
          "read_themes",
          "write_themes",
          "unauthenticated_read_product_listings",
          "unauthenticated_read_product_tags",
          "unauthenticated_read_content"
        ],
        afterAuth(ctx) {
          const { shop, accessToken }: any = ctx.session;
          console.log(shop, accessToken);
          ctx.body = { accessToken: accessToken };
          ctx.cookies.set("shopOrigin", shop, { httpOnly: false });
          ctx.cookies.set("accessToken", accessToken, { httpOnly: false });
          ctx.redirect("/index");
        }
      })
    );
  server.use(proxy({ version: ApiVersion.October19 }));
  server.use(verifyRequest());
  server.use(async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });
  server.listen(port, () => {
    console.log(`Server is listening on Port: ${port}`);
  });
});
