// modules/ui.js

export class UIModule {
    displayInfo(info) {
        const infoDiv = document.getElementById('info');
        if (!infoDiv) {
            console.error('info div not found');
            return;
        }
        infoDiv.innerHTML = '<h2>Collected Information:</h2>';
        for (const [key, value] of Object.entries(info)) {
            infoDiv.innerHTML += `<p><strong>${key}:</strong> ${JSON.stringify(value)}</p>`;
        }
    }

    updateBotChecks(checks) {
        const botChecksDiv = document.getElementById('botChecks');
        if (!botChecksDiv) {
            console.error('botChecks div not found');
            return;
        }
        botChecksDiv.innerHTML = '<h2>Bot Detection Checks:</h2>';
        
        for (const [key, value] of Object.entries(checks)) {
            botChecksDiv.innerHTML += `
                <div class="bot-check">
                    <strong>${key}:</strong> 
                    <span class="${value.result ? 'pass' : 'fail'}">${value.result ? 'Pass' : 'Fail'}</span>
                    (Weight: ${value.weight}, Critical: ${value.critical})
                </div>`;
        }
    }

    showCaptcha(captcha) {
        const captchaDiv = document.getElementById('captcha');
        captchaDiv.style.display = 'block';
        document.getElementById('captchaImage').textContent = captcha;
    }

    hideCaptcha() {
        document.getElementById('captcha').style.display = 'none';
    }
}
