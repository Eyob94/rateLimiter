import express from "express";
import requestIp from "request-ip";
import redis from "redis";
import { fixedWindowRateLimiter } from "./fixedWindow.js";

const app = express();
app.use(requestIp.mw());
app.use(fixedWindowRateLimiter);

app.get("/", async (req, res) => {
	return res.send(req.ip);
});

const port = process.argv[2] || 3000;

app.listen(port, () => {
	console.log("🟢Server started...");
});
