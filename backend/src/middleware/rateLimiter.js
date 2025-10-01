import ratelimit from '../config/upstash.js' 

const rateLimiter = async (req, res, next) => {

 try {
    const { success } = await ratelimit.limit("my-ip");
    
    if (!success) {
        return res.status(429).json({ message: 'Too many requests, please try again later.' });
    }
    next();
 } catch (error) {
    console.log('Rate limiting error:', error);
    res.status(500).json({ message: 'Internal server error' });
 }


}


export default rateLimiter;