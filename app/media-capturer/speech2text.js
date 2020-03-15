// Starts continuous speech recognition.
const fs = require('fs');
const SpeechSDK = require('microsoft-cognitiveservices-speech-sdk');

const key = process.env.SPEECH_SERVICE_SUBSCRIPTION_KEY;
const region = process.env.SPEECH_SERVICE_REGION;

export function speech2text(filePath, time, handleSpeechText) {
    let textResult = '';
    // create the push stream we need for the speech sdk.
    let pushStream = SpeechSDK.AudioInputStream.createPushStream();

    // open the file and push it to the push stream.
    fs.createReadStream(filePath).on('data', (arrayBuffer) => {
        pushStream.write(arrayBuffer.slice());
    }).on('end', () => {
        pushStream.close();
    });

    // // If an audio file was specified, use it.
    // // Using continuous recognition allows multiple phrases to be recognized from a single use authorization.
    // let audioConfig = SpeechSDK.AudioConfig.fromWavFileInput(audioFile);

    let speechConfig;
    if (!key || !region) {
        alert('Please provide your Azure speech subscription key or region!');
        return;
    } else {
        speechConfig = SpeechSDK.SpeechConfig.fromSubscription(key, region);
    }

    // now create the audio-config pointing to our stream and
    // the speech config specifying the language.
    let audioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream);

    speechConfig.speechRecognitionLanguage = "en-US";
    let reco = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    // Before beginning speech recognition, setup the callbacks to be invoked when an event occurs.

    // The event recognized signals that a final recognition result is received.
    // This is the final event that a phrase has been recognized.
    // For continuous recognition, you will get one recognized event for each phrase recognized.
    reco.recognized = (s, e) => {
        // Indicates that recognizable speech was not detected, and that recognition is done.
        if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
            let noMatchDetail = SpeechSDK.NoMatchDetails.fromResult(e.result);
            console.log("(recognized)  Reason: " + SpeechSDK.ResultReason[e.result.reason] + " NoMatchReason: " + SpeechSDK.NoMatchReason[noMatchDetail.reason]);
        } else {
            console.log("(recognized)  Reason: " + SpeechSDK.ResultReason[e.result.reason] + " Text: " + e.result.text);
        }

        textResult += e.result.text + ' ';
    };

    // The event signals that the service has stopped processing speech.
    // https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognitioncanceledeventargs?view=azure-node-latest
    // This can happen for two broad classes of reasons.
    // 1. An error is encountered.
    //    In this case the .errorDetails property will contain a textual representation of the error.
    // 2. No additional audio is available.
    //    Caused by the input stream being closed or reaching the end of an audio file.

    // Signals that the speech service has detected that speech has stopped.
    reco.speechEndDetected = (s, e) => {
        // Updates the recognized speech to collection
        handleSpeechText(textResult, time);
        // Stops recognition and disposes of resources.
        reco.stopContinuousRecognitionAsync(
            () => {
                reco.close();
                reco = undefined;
            },
            (err) => {
                reco.close();
                reco = undefined;
            });
    };

    // Starts recognition
    reco.startContinuousRecognitionAsync();
}