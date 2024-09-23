let counter = 0;
let recognizing = false;
let recognition;
let selectedPhrase = "سبحان الله"; // Default phrase

// Get the phrase from the select menu
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
  recognition.interimResults = true; // Enable interim results for live stream
  recognition.lang = "ar-SA"; // Arabic (Saudi Arabia)

  recognition.onstart = () => {
    recognizing = true;
    document.getElementById("toggleButton").textContent = "Pause";
    document.getElementById("toggleButton").classList.remove("bg-green-500");
    document.getElementById("toggleButton").classList.add("bg-yellow-500");

    // Show the flashing "Listening..." indicator
    document.getElementById("listeningIndicator").classList.remove("hidden");

    console.log("Voice recognition started.");
  };

  recognition.onresult = (event) => {
    let liveTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      liveTranscript += event.results[i][0].transcript;
    }

    // Display the live transcript on the screen
    document.getElementById("liveTranscript").textContent = liveTranscript;

    // Check if the final result matches the selected phrase
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
  };

  recognition.onend = () => {
    console.log("Voice recognition ended.");
  };

  recognition.start();
}

function pauseRecognition() {
  if (recognizing) {
    recognition.stop();
    recognizing = false;
    document.getElementById("toggleButton").textContent = "Start";
    document.getElementById("toggleButton").classList.remove("bg-yellow-500");
    document.getElementById("toggleButton").classList.add("bg-green-500");

    // Hide the flashing "Listening..." indicator
    document.getElementById("listeningIndicator").classList.add("hidden");

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
