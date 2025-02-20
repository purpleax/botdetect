export class CoreModule {
    constructor(config) {
        this.config = {
            botScoreThreshold: 0.5,
            powDifficulty: 4,
            powTimeout: 5000,
            debug: false,
            forceFail: false,
            checkWeights: {
                webdriver: { weight: 1.0, critical: false },
                webdriverExtended: { weight: 0.8, critical: true },
                pluginsLength: { weight: 0.3, critical: false },
                languagesLength: { weight: 0.2, critical: false },
                webGL: { weight: 0.4, critical: false },
                canvas: { weight: 0.4, critical: false },
                cookiesEnabled: { weight: 0.3, critical: false },
                asyncTest: { weight: 0.2, critical: false },
                firefoxCheck: { weight: 0.3, critical: false },
                screenResolution: { weight: 0.7, critical: false },
                browserFingerprint: { weight: 0.8, critical: false },
            },
            ...config
        };
        this.detectionResult = 'pending';
    }

    getConfig() { return this.config; }
    getWeights() { return this.config.checkWeights; }
    getDetectionResult() { return this.detectionResult; }
    setDetectionResult(result) { this.detectionResult = result; }
    setDebugMode(debug, forceFail) {
        this.config.debug = debug;
        this.config.forceFail = forceFail;
    }
}
