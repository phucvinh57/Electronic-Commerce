import { join } from "path";
import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/ajv";
import "@tsed/swagger";
import { config } from "./config/index";
import * as apis from "./controllers/apis/index";
import * as pages from "./controllers/pages/index";
import { CORS_WHITE_LIST } from "@envs";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8081,
  httpsPort: false, // CHANGE
  componentsScan: false,
  mount: {
    "/api": [...Object.values(apis)],
    "/": [...Object.values(pages)]
  },
  swagger: [
    {
      path: "/docs",
      specVersion: "3.0.1"
    }
  ],
  middlewares: [
    cors({
      origin: CORS_WHITE_LIST,
      credentials: true
    }),
    cookieParser(),
    compress({}),
    methodOverride(),
    bodyParser.json(),
    bodyParser.urlencoded({
      extended: true
    })
  ],
  views: {
    root: join(process.cwd(), "../views"),
    extensions: {
      ejs: "ejs"
    }
  },
  exclude: ["**/*.spec.ts"]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;
}
