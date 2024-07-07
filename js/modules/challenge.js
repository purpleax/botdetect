export class ChallengeModule {
    constructor(config, uiModule) {
        this.powDifficulty = config.powDifficulty;
        this.powTimeout = config.powTimeout;
        this.uiModule = uiModule;
    }

    runPoW() {
        return new Promise((resolve) => {
            const challenge = this.generatePoWChallenge();
            console.log(`PoW Challenge: ${challenge}`);
            
            let nonce = 0;
            const startTime = Date.now();
            
            const attemptSolution = () => {
                try {
                    if (this.verifyPoWSolution(challenge, nonce.toString())) {
                        console.log(`PoW Solution found: ${nonce}`);
                        resolve(true);
                        return;
                    }
                    nonce++;
                    
                    if (Date.now() - startTime > this.powTimeout) {
                        console.log("PoW Challenge failed: Timeout");
                        resolve(false);
                        return;
                    }

                    setTimeout(attemptSolution, 0);
                } catch (error) {
                    console.error('Error in PoW challenge:', error);
                    resolve(false);
                }
            };

            attemptSolution();
        });
    }

    generatePoWChallenge() {
        return Math.random().toString(36).substring(2, 15);
    }

    verifyPoWSolution(challenge, nonce) {
        const hash = this.sha256(challenge + nonce);
        return hash.startsWith('0'.repeat(this.powDifficulty));
    }

    sha256(ascii) {
        function rightRotate(value, amount) {
            return (value>>>amount) | (value<<(32 - amount));
        };
        
        var mathPow = Math.pow;
        var maxWord = mathPow(2, 32);
        var lengthProperty = 'length'
        var i, j; // Used as a counter across the whole file
        var result = ''

        var words = [];
        var asciiBitLength = ascii[lengthProperty]*8;
        
        var hash = [];
        var k = [];
        var primeCounter = 0;

        var isComposite = {};
        for (var candidate = 2; primeCounter < 64; candidate++) {
            if (!isComposite[candidate]) {
                for (i = 0; i < 313; i += candidate) {
                    isComposite[i] = candidate;
                }
                hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
                k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
            }
        }
        
        ascii += '\x80'
        while (ascii[lengthProperty]%64 - 56) ascii += '\x00'
        for (i = 0; i < ascii[lengthProperty]; i++) {
            j = ascii.charCodeAt(i);
            if (j>>8) return; // ASCII check: only accept characters in range 0-255
            words[i>>2] |= j << ((3 - i)%4)*8;
        }
        words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
        words[words[lengthProperty]] = (asciiBitLength)
        
        for (j = 0; j < words[lengthProperty];) {
            var w = words.slice(j, j += 16);
            var oldHash = hash.slice(0);
            hash = hash.slice(0, 8);
            
            for (i = 0; i < 64; i++) {
                var i2 = i + j;
                var w15 = w[i - 15], w2 = w[i - 2];

                var a = hash[0], e = hash[4];
                var temp1 = hash[7]
                    + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
                    + ((e&hash[5])^((~e)&hash[6]))
                    + k[i]
                    + (w[i] = (i < 16) ? w[i] : (
                            w[i - 16]
                            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3))
                            + w[i - 7]
                            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10))
                        )|0
                    );
                var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
                    + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2]));
                
                hash = [(temp1 + temp2)|0].concat(hash);
                hash[4] = (hash[4] + temp1)|0;
            }
            
            for (i = 0; i < 8; i++) {
                hash[i] = (hash[i] + oldHash[i])|0;
            }
        }
        
        for (i = 0; i < 8; i++) {
            for (j = 3; j + 1; j--) {
                var b = (hash[i]>>(j*8))&255;
                result += ((b < 16) ? 0 : '') + b.toString(16);
            }
        }
        return result;
    }

    runCaptcha() {
        return new Promise((resolve) => {
            const captcha = this.generateCaptcha();
            console.log("CAPTCHA challenge initiated:", captcha);
            
            this.uiModule.showCaptcha(captcha);

            document.getElementById('captchaSubmit').onclick = () => {
                const input = document.getElementById('captchaInput').value.toUpperCase();
                if (input === captcha) {
                    console.log("CAPTCHA verified successfully!");
                    this.uiModule.hideCaptcha();
                    resolve(true);
                } else {
                    console.log("CAPTCHA verification failed.");
                    document.getElementById('captchaError').textContent = "Incorrect CAPTCHA. Please try again.";
                    document.getElementById('captchaInput').value = '';
                    this.uiModule.showCaptcha(this.generateCaptcha());
                }
            };
        });
    }

    generateCaptcha() {
        return Math.random().toString(36).slice(2, 8).toUpperCase();
    }
}
