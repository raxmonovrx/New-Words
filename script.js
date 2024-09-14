document.addEventListener("DOMContentLoaded", () => {
    const loader = document.querySelector(".containerAnime");
    const container = document.querySelector(".container");
    const progress = document.querySelector(".progress");
    const noise = document.querySelector(".noise");

    // Sahifa to'liq yuklanganidan keyin 2 sekund davomida loaderni ko'rsatish
    window.addEventListener("load", function () {
        setTimeout(() => {
            loader.style.display = "none"; // Loaderni yashirish
            container.style.display = "block"; // Containerni ko'rsatish
        }, 1000); // 2 sekund
    });

    // JSON faylini yuklash
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
                    card.sentence || "No sentence available";

                const sentenceTranslationDiv = document.createElement("div");
                sentenceTranslationDiv.className = "sentence-translation";
                sentenceTranslationDiv.textContent =
                    card.sentence_translation || "No translation available";

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
