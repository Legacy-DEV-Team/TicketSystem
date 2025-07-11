import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { SignJWT, jwtVerify, generateKeyPair } from 'jose';



export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
  type: 'access' | 'refresh';
}

export class AuthService {
  private static instance: AuthService;
  private jwtPrivateKey: Uint8Array | null = null;
  private jwtPublicKey: Uint8Array | null = null;
  private encryptionKey: Buffer | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async initialize(masterKey?: string) {
    if (!this.jwtPrivateKey || !this.jwtPublicKey) {
      await this.generateJWTKeys();
    }
    
    if (!this.encryptionKey) {
      this.encryptionKey = masterKey 
        ? crypto.scryptSync(masterKey, 'salt', 32)
        : crypto.randomBytes(32);
    }
  }

  private async generateJWTKeys() {
    const { privateKey, publicKey } = await generateKeyPair('EdDSA', {
      crv: 'Ed25519'
    });
    
    this.jwtPrivateKey = new Uint8Array(await crypto.subtle.exportKey('raw', privateKey as crypto.webcrypto.CryptoKey));
    this.jwtPublicKey = new Uint8Array(await crypto.subtle.exportKey('raw', publicKey as crypto.webcrypto.CryptoKey));
  }

  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      timeCost: 2,
      memoryCost: 65536,
      parallelism: 2,
      saltLength: 32
    });
  }

  async verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, password);
    } catch (error) {
      return false;
    }
  }

  encryptToken(token: string): string {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipher('aes-256-gcm', this.encryptionKey);
    cipher.setAAD(Buffer.from('token'));
    
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  decryptToken(encryptedToken: string): string {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }

    const parts = encryptedToken.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted token format');
    }

    const [, authTagHex, encrypted] = parts;
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipher('aes-256-gcm', this.encryptionKey);
    decipher.setAAD(Buffer.from('token'));
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  async generateTokens(userId: string): Promise<AuthTokens> {
    if (!this.jwtPrivateKey) {
      throw new Error('JWT keys not initialized');
    }

    const now = Math.floor(Date.now() / 1000);
    const accessTokenExp = now + (15 * 60);
    const refreshTokenExp = now + (7 * 24 * 60 * 60);

    const accessToken = await new SignJWT({
      sub: userId,
      iat: now,
      exp: accessTokenExp,
      type: 'access'
    })
      .setProtectedHeader({ alg: 'EdDSA' })
      .sign(this.jwtPrivateKey);

    const refreshToken = await new SignJWT({
      sub: userId,
      iat: now,
      exp: refreshTokenExp,
      type: 'refresh'
    })
      .setProtectedHeader({ alg: 'EdDSA' })
      .sign(this.jwtPrivateKey);

    return {
      accessToken: this.encryptToken(accessToken),
      refreshToken: this.encryptToken(refreshToken),
      expiresIn: 15 * 60
    };
  }

  async verifyToken(encryptedToken: string, type: 'access' | 'refresh' = 'access'): Promise<TokenPayload> {
    if (!this.jwtPublicKey) {
      throw new Error('JWT keys not initialized');
    }

    try {
      const token = this.decryptToken(encryptedToken);
      
      const { payload } = await jwtVerify(token, this.jwtPublicKey, {
        algorithms: ['EdDSA']
      });

      const tokenPayload = payload as unknown as TokenPayload;
      
      if (tokenPayload.type !== type) {
        throw new Error('Invalid token type');
      }

      if (tokenPayload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired');
      }

      return tokenPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async refreshTokens(encryptedRefreshToken: string): Promise<AuthTokens> {
    const payload = await this.verifyToken(encryptedRefreshToken, 'refresh');
    return this.generateTokens(payload.sub);
  }

  getJWTKeys(): { privateKey: string; publicKey: string } | null {
    if (!this.jwtPrivateKey || !this.jwtPublicKey) {
      return null;
    }

    return {
      privateKey: Buffer.from(this.jwtPrivateKey).toString('base64'),
      publicKey: Buffer.from(this.jwtPublicKey).toString('base64')
    };
  }

  setJWTKeys(privateKey: string, publicKey: string) {
    this.jwtPrivateKey = new Uint8Array(Buffer.from(privateKey, 'base64'));
    this.jwtPublicKey = new Uint8Array(Buffer.from(publicKey, 'base64'));
  }

  getMasterKey(): string | null {
    return this.encryptionKey ? this.encryptionKey.toString('base64') : null;
  }

  setMasterKey(masterKey: string) {
    this.encryptionKey = Buffer.from(masterKey, 'base64');
  }
}