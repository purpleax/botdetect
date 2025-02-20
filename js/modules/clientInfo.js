export class ClientInfoModule {
    collect() {
        try {
            return {
                userAgent: navigator.userAgent || 'Not available',
                platform: navigator.platform || 'Not available',
                screenResolution: `${window.screen.width}x${window.screen.height}` || 'Not available',
                colorDepth: window.screen.colorDepth || 'Not available',
                deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
                language: navigator.language || 'Not available',
                cookiesEnabled: navigator.cookieEnabled || 'Not available',
                doNotTrack: navigator.doNotTrack || 'Not available',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Not available',
                touchSupport: 'ontouchstart' in window ? 'Yes' : 'No',
                plugins: Array.from(navigator.plugins).map(p => p.name) || [],
                webdriver: navigator.webdriver || 'Not available',
            };
        } catch (error) {
            console.error('Error collecting client info:', error);
            return {
                error: 'Failed to collect client info',
                errorMessage: error.message
            };
        }
    }
}
