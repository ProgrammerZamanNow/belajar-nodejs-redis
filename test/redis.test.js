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

});
