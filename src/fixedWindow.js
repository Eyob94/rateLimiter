import redis from "redis";

const client = redis.createClient();
await client.connect();
const RATE_LIMIT = 4;
const TIME_WINDOW = 60;

export const fixedWindowRateLimiter = async (req, res, next) => {
	const ip = req.clientIp;
	const requests = await client.hGet(`rates:${ip}`, "requests");
	if (!requests) {
		const startTime = Date.now();
		await client.hSet(`rates:${ip}`, "start", startTime);
		await client.hSet(`rates:${ip}`, "requests", 1);
		await client.expire(`rates:${ip}`, TIME_WINDOW);
	} else {
		if (requests >= RATE_LIMIT) {
			res.setHeader("Retry-after", "2s");
			return res.status(429).send("Too many requests brother");
		}
		await client.hSet(`rates:${ip}`, "requests", parseInt(requests) + 1);
		next();
	}
};
