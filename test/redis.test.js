import Redis from "ioredis";

describe('belajar nodejs redis', () => {

    /**
     * @type Redis
     */
    let redis = null;

    beforeEach(async () => {
        redis = new Redis({
            host: "localhost",
            port: 6379,
            db: 0
        })
    });

    afterEach(async () => {
        await redis.quit();
    })

    it('should can ping', async () => {
        const pong = await redis.ping()
        expect(pong).toBe('PONG');
    });

    it('should support string', async () => {
        await redis.setex("name", 2, "Eko");
        let name = await redis.get("name");
        expect(name).toBe("Eko");

        await new Promise(resolve => setTimeout(resolve, 3000))
        name = await redis.get("name");
        expect(name).toBeNull();
    });

    it('should support list', async () => {
        await redis.rpush("names", "Eko")
        await redis.rpush("names", "Kurniawan")
        await redis.rpush("names", "Khannedy")

        expect(await redis.llen("names")).toBe(3)

        const names = await redis.lrange("names", 0, -1)
        expect(names).toEqual(["Eko", "Kurniawan", "Khannedy"])

        expect(await redis.lpop("names")).toBe("Eko")
        expect(await redis.rpop("names")).toBe("Khannedy")

        expect(await redis.llen("names")).toBe(1)

        await redis.del("names")
    });

    it('should support set', async () => {
        await redis.sadd("names", "Eko")
        await redis.sadd("names", "Eko")
        await redis.sadd("names", "Kurniawan")
        await redis.sadd("names", "Kurniawan")
        await redis.sadd("names", "Khannedy")
        await redis.sadd("names", "Khannedy")

        expect(await redis.scard("names")).toBe(3)

        const names = await redis.smembers("names")
        expect(names).toEqual(["Eko", "Kurniawan", "Khannedy"])

        await redis.del("names")
    });

});
