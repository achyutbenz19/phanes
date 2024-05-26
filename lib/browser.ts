import puppeteer, { Browser } from "puppeteer";
import os from "os";
import path from "path";

let browser: Browser;

const getUserDataDir = () => {
  switch (os.platform()) {
    case "win32":
      return path.join(
        os.homedir(),
        "AppData",
        "Local",
        "Google",
        "Chrome",
        "User Data",
      );
    case "darwin":
      return path.join(
        os.homedir(),
        "Library",
        "Application Support",
        "Google",
        "Chrome",
      );
    case "linux":
      return path.join(os.homedir(), ".config", "google-chrome");
    default:
      throw new Error("Unsupported OS");
  }
};

export const getBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: false,
      userDataDir: getUserDataDir(),
    });
  }
  return browser;
};
