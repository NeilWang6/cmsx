package com.apachecms.cmsx.common.security;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.Security;
import java.security.spec.InvalidKeySpecException;
import java.util.Hashtable;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;

public class BaseDesSecurity {

    private static String    Algorithm     = "DES";

    static { 
        Security.addProvider(new com.sun.crypto.provider.SunJCE());
    }
 
    private static Hashtable cipherPairMap = new Hashtable();

    private CipherPair getCipherPair(String rawKey) {
        CipherPair cipherPair = (CipherPair) cipherPairMap.get(rawKey);

        if (cipherPair == null) {
            CipherPair pair = generateCipher(rawKey);
            cipherPairMap.put(rawKey, pair);

            return pair;
        } else {
            return cipherPair;
        }
    }

    public String decode(String text, String key) {
        CipherPair pair = this.getCipherPair(key);
        Cipher cipher = pair.decodeCipher;
        byte[] buff = Base64.decode(text);
        byte[] clearByte;

        synchronized (pair) {
            try {
                clearByte = cipher.doFinal(buff);

                return new String(clearByte, "GBK");
            } catch (IllegalStateException e) {
                throw new RuntimeException(e);
            } catch (IllegalBlockSizeException e) {
                throw new RuntimeException(e);
            } catch (BadPaddingException e) {
                throw new RuntimeException(e);
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public String encode(String text, String key) {
        CipherPair pair = this.getCipherPair(key);
        Cipher cipher = pair.encodeCipher;

        synchronized (pair) {
            try {
                byte[] buff = text.getBytes("GBK");

                return Base64.encodeBytes(cipher.doFinal(buff));
            } catch (IllegalStateException e) {
                throw new RuntimeException(e);
            } catch (IllegalBlockSizeException e) {
                throw new RuntimeException(e);
            } catch (BadPaddingException e) {
                throw new RuntimeException(e);
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException(e);
            }
        }
    }
 
    private CipherPair generateCipher(String rawKey) {
        try {
            DESKeySpec dks = new DESKeySpec(rawKey.getBytes());

            SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(Algorithm);
            SecretKey deskey = keyFactory.generateSecret(dks);
            Cipher encodeCipher = Cipher.getInstance(Algorithm);
            encodeCipher.init(Cipher.ENCRYPT_MODE, deskey);

            Cipher decodeCipher = Cipher.getInstance(Algorithm);
            decodeCipher.init(Cipher.DECRYPT_MODE, deskey);

            CipherPair pair = new CipherPair(encodeCipher, decodeCipher);

            return pair;
        } catch (InvalidKeyException e) {
            throw new RuntimeException(e);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        } catch (InvalidKeySpecException e) {
            throw new RuntimeException(e);
        } catch (NoSuchPaddingException e) {
            throw new RuntimeException(e);
        }
    }

    class CipherPair {

        public Cipher encodeCipher;
        public Cipher decodeCipher;

        public CipherPair(Cipher encodeCipher, Cipher decodeCipher){
            this.encodeCipher = encodeCipher;
            this.decodeCipher = decodeCipher;
        }
    }
}