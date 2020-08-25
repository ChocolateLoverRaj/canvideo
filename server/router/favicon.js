//Serve a variety of icon files for many devices and browsers.

//Dependencies
//Npm Modules
import { join } from 'path';

//My Modules
import serverPath from "../server-path.js";

//Serve function
const serve = router => {
    const iconsPath = join(serverPath, "../icons/res/");

    //favicon.ico
    router.get("/favicon.ico", (req, res) => {
        res.sendFile(join(iconsPath, "./favicon.ico"));
    });

    //Apple
    router.get("/apple-touch-icon.png", (req, res) => {
        res.sendFile(join(iconsPath, "./apple-touch-icon.png"));
    });

    //Png Icons
    router.get("/favicon-32x32.png", (req, res) => {
        res.sendFile(join(iconsPath, "./favicon-32x32.png"));
    });
    router.get("/favicon-16x16.png", (req, res) => {
        res.sendFile(join(iconsPath, "./favicon-16x16.png"));
    });

    //Android
    router.get("/site.webmanifest", (req, res) => {
        res.sendFile(join(iconsPath, "./site.webmanifest"));
    });
    router.get("/android-chrome-192x192.png", (req, res) => {
        res.sendFile(join(iconsPath, "./android-chrome-192x192.png"));
    });
    router.get("/android-chrome-512x512.png", (req, res) => {
        res.sendFile(join(iconsPath, "./android-chrome-512x512.png"));
    });

    //Safari
    router.get("/safari-pinned-tab.svg", (req, res) => {
        res.sendFile(join(iconsPath, "./safari-pinned-tab.svg"));
    });

    //Microsoft
    router.get("/browserconfig.xml", (req, res) => {
        res.sendFile(join(iconsPath, "./browserconfig.xml"));
    });
    router.get("/mstile-150x150.png", (req, res) => {
        res.sendFile(join(iconsPath, "./mstile-150x150.png"));
    });
};

//Export the serve function
export default serve;