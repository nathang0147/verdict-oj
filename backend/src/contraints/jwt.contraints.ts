import * as path from "node:path";
import * as fs from "fs";
import * as crypto from 'node:crypto';

function checkExistFolder(name: string){
    const checkPath = path.join(__dirname, `../../${name}`);

    //check if folder exist
    //if not exist, create folder using fs.mkdir
    if (!fs.existsSync(checkPath)) {
        try {
            fs.mkdirSync(checkPath);
            console.log(`Folder created: ${checkPath}`);
        } catch (err) {
            console.error(`Error creating folder: ${checkPath}`, err);
        }
    }
}

function getAccessTokenKeyPair(){
    checkExistFolder('secure');

    const accessTokenPrivateKeyPath = path.join(
        __dirname,
        '../../secure/accessTokenPrivate.key'
    );
    const accessTokenPublicKeyPath = path.join(
        __dirname,
        '../../secure/accessTokenPublic.key'
    );

    //check if file key exist or not
    const accessTokenPrivateKeyExists = fs.existsSync(accessTokenPrivateKeyPath)
    const accessTokenPublicKeyExists = fs.existsSync(accessTokenPublicKeyPath)

    //if not exist, create file using fs.writeFile
    if(!accessTokenPrivateKeyExists || !accessTokenPublicKeyExists){

        //'rsa' the algorithm for generating the key pair, the other popular is RSA, RSA-PSS, DSA, EC, Ed25519, Ed448, X25519, X448,DH
        const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048, //the length of the key by bits, recommended to use at least 4096 bits but for testing purpose 2048 bits is enough

            publicKeyEncoding: {
                type: 'spki', // SubjectPublicKeyInfo -> the type of the public key
                format: 'pem' // Privacy Enhanced Mail -> the format of the key
            },

            privateKeyEncoding: {
                type: 'pkcs8',// Private-Key Information Syntax Standard -> the type of the private key
                format: 'pem'
            }
        });


        try {
            fs.writeFileSync(accessTokenPrivateKeyPath, privateKey);
            fs.writeFileSync(accessTokenPublicKeyPath, publicKey);
            console.log(`Key files created: ${accessTokenPrivateKeyPath}, ${accessTokenPublicKeyPath}`);
        } catch (err) {
            console.error(`Error writing key files: ${accessTokenPrivateKeyPath}, ${accessTokenPublicKeyPath}`, err);
        }
    }

    //read secret key from file
    const accessTokenPrivateKey = fs.readFileSync(accessTokenPrivateKeyPath, 'utf8');
    const accessTokenPublicKey = fs.readFileSync(accessTokenPublicKeyPath, 'utf8');

    if (!accessTokenPublicKey || !accessTokenPrivateKey) {
        console.error('Key access files are empty');
    }


    return {accessTokenPrivateKey, accessTokenPublicKey};
}

function getRefreshTokenKeyPair(){
    checkExistFolder('secure');

    const refreshTokenPrivateKeyPath = path.join(
        __dirname,
        '../../secure/refreshTokenPrivate.key'
    );
    const refreshTokenPublicKeyPath = path.join(
        __dirname,
        '../../secure/refreshTokenPublic.key'
    );

    //check if file key exist or not
    const refreshTokenPrivateKeyExists = fs.existsSync(refreshTokenPrivateKeyPath)
    const refreshTokenPublicKeyExists = fs.existsSync(refreshTokenPublicKeyPath)

    //if not exist, create file using fs.writeFile
    if(!refreshTokenPrivateKeyExists || !refreshTokenPublicKeyExists){
        const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        try {
            fs.writeFileSync(refreshTokenPrivateKeyPath, privateKey);
            fs.writeFileSync(refreshTokenPublicKeyPath, publicKey);
            console.log(`Key files created: ${refreshTokenPrivateKeyPath}, ${refreshTokenPublicKeyPath}`);
        } catch (err) {
            console.error(`Error writing key files: ${refreshTokenPrivateKeyPath}, ${refreshTokenPublicKeyPath}`, err);
        }
    }

    //read secret key from file
    const refreshTokenPrivateKey = fs.readFileSync(refreshTokenPrivateKeyPath, 'utf8');
    const refreshTokenPublicKey = fs.readFileSync(refreshTokenPublicKeyPath, 'utf8');

    if (!refreshTokenPrivateKey || !refreshTokenPublicKey) {
        console.error('Key Refresh files are empty');
    }

    return {refreshTokenPrivateKey, refreshTokenPublicKey};
}

export const {accessTokenPrivateKey, accessTokenPublicKey} = getAccessTokenKeyPair();
export const {refreshTokenPrivateKey, refreshTokenPublicKey} = getRefreshTokenKeyPair();