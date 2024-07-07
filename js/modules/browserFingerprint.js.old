export class BrowserFingerprintModule {
    detectBrowser() {
        const ua = navigator.userAgent;
        let browserName = "unknown";
        
        if (ua.match(/chrome|chromium|crios/i)) {
            browserName = "chrome";
        } else if (ua.match(/firefox|fxios/i)) {
            browserName = "firefox";
        } else if (ua.match(/safari/i)) {
            browserName = "safari";
        }
        
        return {
            reportedBrowser: browserName,
            actualBrowser: this.fingerprint()
        };
    }

    fingerprint() {
        if (this.isChrome()) {
            return "chrome";
        } else if (this.isFirefox()) {
            return "firefox";
        } else if (this.isSafari()) {
            return "safari";
        }
        return "unknown";
    }

    isChrome() {
        return (
            window.chrome !== undefined &&
            window.chrome.runtime !== undefined
        );
    }

    isFirefox() {
        return (
            typeof InstallTrigger !== 'undefined'
        );
    }

    isSafari() {
        return (
            /constructor/i.test(window.HTMLElement) ||
            (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))
        );
    }
}
