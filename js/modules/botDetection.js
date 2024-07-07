import { BrowserFingerprintModule } from './browserFingerprint.js';

export class BotDetectionModule {
    constructor(weights, config) {
        this.weights = weights;
        this.config = config;
        this.browserFingerprint = new BrowserFingerprintModule();
    }

    performChecks(clientInfo) {
        const browserCheck = this.browserFingerprint.detectBrowser();
        const checks = {
            webdriver: {
                result: !clientInfo.webdriver,
                weight: this.weights.webdriver.weight,
                critical: this.weights.webdriver.critical
            },
            webdriverExtended: {
                result: this.checkWebdriverExtended(),
                weight: this.weights.webdriverExtended.weight,
                critical: this.weights.webdriverExtended.critical
            },
            pluginsLength: {
                result: clientInfo.plugins.length > 0,
                weight: this.weights.pluginsLength.weight,
                critical: this.weights.pluginsLength.critical
            },
            languagesLength: {
                result: navigator.languages.length > 1,
                weight: this.weights.languagesLength.weight,
                critical: this.weights.languagesLength.critical
            },
            webGL: {
                result: this.checkWebGL(),
                weight: this.weights.webGL.weight,
                critical: this.weights.webGL.critical
            },
            canvas: {
                result: this.checkCanvas(),
                weight: this.weights.canvas.weight,
                critical: this.weights.canvas.critical
            },
            cookiesEnabled: {
                result: clientInfo.cookiesEnabled,
                weight: this.weights.cookiesEnabled.weight,
                critical: this.weights.cookiesEnabled.critical
            },
            screenResolution: {
                result: this.checkScreenResolution(clientInfo.screenResolution),
                weight: this.weights.screenResolution.weight,
                critical: this.weights.screenResolution.critical
            },
            browserFingerprint: {
                result: browserCheck.reportedBrowser === browserCheck.actualBrowser,
                weight: this.weights.browserFingerprint.weight,
                critical: this.weights.browserFingerprint.critical
            }
        };

        if (this.config.forceFail) {
            Object.keys(checks).forEach(key => {
                checks[key].result = false;
            });
        }

        return checks;
    }

    checkWebdriverExtended() {
        const seleniumProps = ['_selenium', '_Selenium_IDE_Recorder', 'callSelenium', 'calledSelenium', '_WEBDRIVER_ELEM_CACHE', 'ChromeDriverw'];
        const hasSeleniumProps = seleniumProps.some(prop => prop in window);
        const documentElementHasAttribute = document.documentElement.getAttribute('webdriver') !== null;
        const hasWebdriverEvaluateScript = 'webdriver' in window && 'executeScript' in window.webdriver;
        return !(hasSeleniumProps || documentElementHasAttribute || hasWebdriverEvaluateScript);
    }

    checkWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch(e) {
            return false;
        }
    }

    checkCanvas() {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext && canvas.getContext('2d'));
    }

    checkScreenResolution(resolution) {
        const [width, height] = resolution.split('x').map(Number);
        return width >= 800 && height >= 600;
    }

    isSuspicious(checks) {
        let weightedScore = 0;
        let totalWeight = 0;
        let criticalFailure = false;

        for (const check of Object.values(checks)) {
            if (!check.result) {
                weightedScore += check.weight;
                if (check.critical) criticalFailure = true;
            }
            totalWeight += check.weight;
        }

        const normalizedScore = weightedScore / totalWeight;
        return criticalFailure || normalizedScore >= this.config.botScoreThreshold;
    }
}
