let currentIndex = 0;
const itemsPerLoad = 10;
let totalItems = 0;
let voicesLoaded = false;
const toggler = document.getElementById("toggle");

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    const isDarkModeEnabled = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkmode", isDarkModeEnabled);
}

toggler.addEventListener("click", toggleDarkMode);

window.addEventListener("load", () => {
    const isDarkModeEnabled = localStorage.getItem("darkmode");

    if (isDarkModeEnabled === "true") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }

    loadVoicesOnce();

    fetch("words.json")
        .then((response) => response.json())
        .then((json) => {
            totalItems = json.length;
            loadMoreItems(json);

            const container = document.querySelector(".container");
            container.addEventListener("scroll", () => {
                if (
                    container.scrollTop + container.clientHeight >=
                    container.scrollHeight - 50
                ) {
                    loadMoreItems(json);
                }
            });
        });
});

function loadMoreItems(data) {
    const flashcards = document.getElementById("flashcards");
    const itemsToLoad = data.slice(currentIndex, currentIndex + itemsPerLoad);

    removeEventListeners();

    itemsToLoad.forEach((item) => {
        const flashcardHTML = `
            <span class="flashcard">
                <div class="word loading">${item.word}</div>
                <div class="definition loading">${item.definition}</div>
                <div class="sentence loading">${item.sentence}</div>
                <div class="sentenceTR loading">${item.sentenceTR}</div>
                <div class="audio-icon loading" data-word="${item.word}" data-sentence="${item.sentence}">🔊</div>
            </span>
        `;
        flashcards.insertAdjacentHTML("beforeend", flashcardHTML);
    });

    setTimeout(() => {
        document.querySelectorAll(".loading").forEach((el) => {
            el.classList.remove("loading");
        });
    }, 1000);

    currentIndex += itemsPerLoad;

    addEventListeners();
}

function readAloud(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();

    const selectedVoice = voices.find(
        (voice) =>
            voice.name.includes("Google") || voice.name.includes("English")
    );

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    } else {
        console.log("Google ovozi topilmadi, default ovoz ishlatiladi.");
    }

    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
}

function addEventListeners() {
    document.querySelectorAll(".flashcard").forEach((flashcard) => {
        flashcard.addEventListener("click", () => {
            const word = flashcard.querySelector(".word").textContent;
            readAloud(word);
        });
    });

    document.querySelectorAll(".audio-icon").forEach((audioIcon) => {
        audioIcon.addEventListener("click", (event) => {
            event.stopPropagation();
            const sentence = audioIcon.getAttribute("data-sentence");
            const word = audioIcon.getAttribute("data-word");
            readAloud(sentence || word);
        });
    });
}

function removeEventListeners() {
    document.querySelectorAll(".flashcard").forEach((flashcard) => {
        flashcard.replaceWith(flashcard.cloneNode(true));
    });

    document.querySelectorAll(".audio-icon").forEach((audioIcon) => {
        audioIcon.replaceWith(audioIcon.cloneNode(true));
    });
}

function loadVoicesOnce() {
    if (!voicesLoaded) {
        speechSynthesis.getVoices();
        voicesLoaded = true;
        console.log("Ovozlar bir marta yuklandi.");
    }
}

speechSynthesis.onvoiceschanged = () => {
    loadVoicesOnce();
};
