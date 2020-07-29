import { Router } from "@types/express-serve-static-core";

declare async function createRouter(): Promise<Router>;

export default createRouter;