document.addEventListener("DOMContentLoaded", () => {
    fetch("words.json")
        .then((response) => response.json())
        .then((flashcards) => {
            const flashcardsContainer = document.getElementById("flashcards");

            flashcards.forEach((card) => {
                const flashcardDiv = document.createElement("div");
                flashcardDiv.className = "flashcard";

                const wordDiv = document.createElement("div");
                wordDiv.className = "word";
                wordDiv.textContent = card.word;

                const definitionDiv = document.createElement("div");
                definitionDiv.className = "definition";
                definitionDiv.textContent = card.definition;

                const sentenceDiv = document.createElement("div");
                sentenceDiv.className = "sentence";
                sentenceDiv.textContent =
                    card.sentence || "No sentence available"; // Gap qo'shilgan bo'lishi kerak

                const sentenceTranslationDiv = document.createElement("div");
                sentenceTranslationDiv.className = "sentence-translation";
                sentenceTranslationDiv.textContent =
                    card.sentence_translation || "No translation available"; // Tarjima qo'shilgan bo'lishi kerak

                const audioIcon = document.createElement("span");
                audioIcon.className = "audio-icon";
                audioIcon.textContent = "🔊";

                flashcardDiv.appendChild(wordDiv);
                flashcardDiv.appendChild(definitionDiv);
                flashcardDiv.appendChild(sentenceDiv);
                flashcardDiv.appendChild(sentenceTranslationDiv);
                flashcardDiv.appendChild(audioIcon);

                // Kartani bosganda so'zni o'qish
                flashcardDiv.addEventListener("click", () => {
                    readAloud(card.word); // So'zni o'qish
                });

                // Audio iconni bosganda gapni o'qish
                audioIcon.addEventListener("click", (event) => {
                    event.stopPropagation(); // Audio icon bosilganda karta o'qilmasin
                    readAloud(card.sentence || card.word); // Gapni o'qish
                });

                flashcardsContainer.appendChild(flashcardDiv);
            });
        })
        .catch((error) => console.error("Error loading words.json:", error));
});

// So'z va gapni o'qish funksiyasi
function readAloud(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
}

function readAloud(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();

    // Google Translate ovoziga eng yaqin ovozni tanlash
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

// Ovozni yuklash (bir oz kutish kerak bo'lishi mumkin)
speechSynthesis.onvoiceschanged = () => {
    readAloud("Hello, this is a test voice!");
};
