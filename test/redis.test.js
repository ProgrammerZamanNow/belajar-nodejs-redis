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

    it('should support sorted set', async () => {
        await redis.zadd("names", 100, "Eko")
        await redis.zadd("names", 85, "Budi")
        await redis.zadd("names", 95, "Joko")

        expect(await redis.zcard("names")).toBe(3)

        const names = await redis.zrange("names", 0, -1)
        expect(names).toEqual(["Budi", "Joko", "Eko"])

        expect(await redis.zpopmax("names")).toEqual(["Eko", "100"])
        expect(await redis.zpopmax("names")).toEqual(["Joko", "95"])
        expect(await redis.zpopmax("names")).toEqual(["Budi", "85"])

        await redis.del("names")
    });

    it('should support hash', async () => {
        await redis.hset("user:1", {
            "id": "1",
            "name": "Eko",
            "email": "eko@example.com"
        })

        const user = await redis.hgetall("user:1")

        expect(user).toEqual({
            "id": "1",
            "name": "Eko",
            "email": "eko@example.com"
        })

        await redis.del("user:1")
    });

    it('should support geo point', async () => {
        await redis.geoadd("sellers", 106.822673, -6.177616, "Toko A")
        await redis.geoadd("sellers", 106.820646, -6.175366, "Toko B")

        const distance = await redis.geodist("sellers", "Toko A", "Toko B", "KM")
        expect(distance).toBe(String(0.3361))

        const result = await redis.geosearch("sellers", "fromlonlat", 106.822443, -6.176966, "byradius", 5, "km")
        expect(result).toEqual(["Toko A", "Toko B"])
    });

    it('should support hyper log log', async () => {
        await redis.pfadd("visitors", "eko", "kurniawan", "khannedy")
        await redis.pfadd("visitors", "eko", "budi", "joko")
        await redis.pfadd("visitors", "rully", "budi", "joko")

        const total = await redis.pfcount("visitors")
        expect(total).toBe(6)
    });

    it('should support pipeline', async () => {
        const pipeline = redis.pipeline()

        pipeline.setex("name", 2, "Eko")
        pipeline.setex("address", 2, "Indonesia")

        await pipeline.exec()

        expect(await redis.get("name")).toBe("Eko")
        expect(await redis.get("address")).toBe("Indonesia")
    });

});
