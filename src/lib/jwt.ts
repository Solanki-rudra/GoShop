import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET as string;

export const signJwt = (payload: object, expiresIn: string | number = '1h') => {
    return jwt.sign(payload, secretKey, { expiresIn });
}

export const verifyJwt = (token: string) => {
    return jwt.verify(token, secretKey);
}