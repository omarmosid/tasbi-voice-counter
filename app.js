let counter = 0;
let recognizing = false;
let recognition;
let selectedPhrase = "سبحان الله"; // Default phrase
let restartRecognitionTimeout;

const phraseSelect = document.getElementById("phraseSelect");
phraseSelect.addEventListener("change", () => {
  selectedPhrase = phraseSelect.value.trim().toLowerCase();
});

document
  .getElementById("toggleButton")
  .addEventListener("click", toggleRecognition);
document.getElementById("resetButton").addEventListener("click", resetCounter);

function toggleRecognition() {
  if (!recognizing) {
    startRecognition();
  } else {
    pauseRecognition();
  }
}

function startRecognition() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Sorry, your browser does not support speech recognition.");
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "ar-SA"; // Arabic (Saudi Arabia)

  recognition.onstart = () => {
    recognizing = true;
    document.getElementById("toggleButton").textContent = "Pause";
    document.getElementById("toggleButton").classList.remove("bg-green-500");
    document.getElementById("toggleButton").classList.add("bg-yellow-500");
    document.getElementById("listeningIndicator").classList.remove("hidden");
    console.log("Voice recognition started.");
  };

  recognition.onresult = (event) => {
    let liveTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      liveTranscript += event.results[i][0].transcript;
    }
    document.getElementById("liveTranscript").textContent = liveTranscript;

    if (event.results[event.resultIndex].isFinal) {
      const transcript = event.results[event.resultIndex][0].transcript
        .trim()
        .toLowerCase();
      console.log("Final result:", transcript);

      if (transcript === selectedPhrase && recognizing) {
        incrementCounter();
      }
    }
  };

  recognition.onerror = (event) => {
    console.error("Error occurred in recognition:", event.error);
    alert("Sorry, your browser does not support speech recognition.");
    restartRecognition();
  };

  recognition.onend = () => {
    console.log("Recognition ended, restarting...");
    if (recognizing) {
      restartRecognition();
    }
  };

  recognition.start();
}

function restartRecognition() {
  clearTimeout(restartRecognitionTimeout);
  restartRecognitionTimeout = setTimeout(() => {
    recognition.start();
  }, 500); // Delay before restarting recognition
}

function pauseRecognition() {
  if (recognizing) {
    recognizing = false;
    recognition.stop();
    document.getElementById("toggleButton").textContent = "Start";
    document.getElementById("toggleButton").classList.remove("bg-yellow-500");
    document.getElementById("toggleButton").classList.add("bg-green-500");
    document.getElementById("listeningIndicator").classList.add("hidden");
    clearTimeout(restartRecognitionTimeout);
    console.log("Voice recognition paused.");
  }
}

function incrementCounter() {
  counter += 1;
  document.getElementById("counter").textContent = counter;
}

function resetCounter() {
  counter = 0;
  document.getElementById("counter").textContent = counter;
}
