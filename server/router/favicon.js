//Serve a variety of icon files for many devices and browsers.

//Dependencies
//Npm Modules
import { join } from 'path';

//My Modules
import serverPath from "../server-path.js";
import options from "./options.js";

//Serve function
const serve = router => {
    const iconsPath = join(serverPath, "../icons/res/");

    //favicon.ico
    router.get("/favicon.ico", (req, res) => {
        res.sendFile(join(iconsPath, "./favicon.ico"), options);
    });

    //Apple
    router.get("/apple-touch-icon.png", (req, res) => {
        res.sendFile(join(iconsPath, "./apple-touch-icon.png"), options);
    });

    //Png Icons
    router.get("/favicon-32x32.png", (req, res) => {
        res.sendFile(join(iconsPath, "./favicon-32x32.png"), options);
    });
    router.get("/favicon-16x16.png", (req, res) => {
        res.sendFile(join(iconsPath, "./favicon-16x16.png"), options);
    });

    //Android
    router.get("/site.webmanifest", (req, res) => {
        res.sendFile(join(iconsPath, "./site.webmanifest"), options);
    });
    router.get("/android-chrome-192x192.png", (req, res) => {
        res.sendFile(join(iconsPath, "./android-chrome-192x192.png"), options);
    });
    router.get("/android-chrome-512x512.png", (req, res) => {
        res.sendFile(join(iconsPath, "./android-chrome-512x512.png"), options);
    });

    //Safari
    router.get("/safari-pinned-tab.svg", (req, res) => {
        res.sendFile(join(iconsPath, "./safari-pinned-tab.svg"), options);
    });

    //Microsoft
    router.get("/browserconfig.xml", (req, res) => {
        res.sendFile(join(iconsPath, "./browserconfig.xml"), options);
    });
    router.get("/mstile-150x150.png", (req, res) => {
        res.sendFile(join(iconsPath, "./mstile-150x150.png"), options);
    });
};

//Export the serve function
export default serve;