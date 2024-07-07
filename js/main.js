import { CoreModule } from './modules/core.js';
import { ClientInfoModule } from './modules/clientInfo.js';
import { BotDetectionModule } from './modules/botDetection.js';
import { ChallengeModule } from './modules/challenge.js';
import { UIModule } from './modules/ui.js';

const BotDetector = (function() {
    let core, clientInfo, botDetection, challenge, ui;

    function init(config) {
        core = new CoreModule(config);
        clientInfo = new ClientInfoModule();
        ui = new UIModule();
        challenge = new ChallengeModule(core.getConfig(), ui);
        botDetection = new BotDetectionModule(core.getWeights(), core.getConfig());

        runDetection();
    }

    async function runDetection() {
        const info = clientInfo.collect();
        ui.displayInfo(info);

        const checks = botDetection.performChecks(info);
        ui.updateBotChecks(checks);

        if (botDetection.isSuspicious(checks)) {
            const powSuccess = await challenge.runPoW();
            if (!powSuccess) {
                const captchaSuccess = await challenge.runCaptcha();
                if (captchaSuccess) {
                    core.setDetectionResult('passed');
                } else {
                    core.setDetectionResult('failed');
                }
            } else {
                core.setDetectionResult('passed');
            }
        } else {
            core.setDetectionResult('passed');
        }

        if (core.getConfig().debug) {
            console.log('Debug Mode: ON');
            console.log('Client Info:', info);
            console.log('Bot Checks:', checks);
            console.log('Detection Result:', core.getDetectionResult());
        }
    }

    return {
        init: init,
        getDetectionResult: () => core.getDetectionResult(),
        setDebugMode: (debug, forceFail) => {
            core.setDebugMode(debug, forceFail);
            console.log(`Debug Mode: ${debug ? 'ON' : 'OFF'}, Force Fail: ${forceFail ? 'ON' : 'OFF'}`);
            runDetection();
        }
    };
})();

export default BotDetector;
