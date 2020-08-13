import { Router } from "express-serve-static-core";

declare function createRouter(): Promise<Router>;

export default createRouter;