const createElements = (arr) => {
  const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
  return htmlElements.join(" ");
};

// pronounceWord
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}


// loading animation
const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

// loadlesson
const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all") // promise of response
    .then((res) => res.json()) // promise of json data
    .then((json) => displayLesson(json.data));
};

// removeactive
const removeActive = () => {
  const lessonBtns = document.querySelectorAll(".lesson-btn");
  lessonBtns.forEach((btn) => btn.classList.remove("active"));
};

// levelWord
const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive(); // remove all active class
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");
      displayLevelWorld(data.data);
    });
};

// loadWordDetail
const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
  const detailModal = document.getElementById("details-container");
  detailModal.innerHTML = `
   <div>
            <h2 class="text-2xl font-bold">
              ${word.word} ( <i class="fa-solid fa-microphone-lines"></i> : ${
    word.pronunciation
  })
            </h2>
          </div>
          <div>
            <h2 class="font-bold">meaning</h2>
            <p>${word.meaning}</p>
          </div>
          <div>
            <h2 class="  font-bold">Example</h2>
            <p>${word.sentence}</p>
          </div>
          <div>
            <h2 class="  font-bold">Synonym</h2>
             <div > 
            ${createElements(word.synonyms)}
          </div>
          </div>
 `;
  document.getElementById("word_modal").showModal();
};

// words
const displayLevelWorld = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    wordContainer.innerHTML = ` <div class="text-center col-span-full    rounded-xl py-10 space-y-6 font-bangla">
      <img class="mx-auto" src="assets/alert-error.png" alt="">
        <p class="text-xl font-medium text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="font-bold text-4xl ">নেক্সট Lesson এ যান</h2>
      </div>`;

    manageSpinner(false);
    return;
  }

  words.forEach((word) => {
    const card = document.createElement("div");
    card.innerHTML = `    <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
        <h2 class="font-bold text-2xl">${
          word.word ? word.word : "word not found"
        }</h2>
        <p class="font-semibold">Meaning /Pronunciation </p>
        <div class="text-2xl font-medium font-bangla">${
          word.meaning ? word.meaning : "meaning not found"
        } /${
      word.pronunciation ? word.pronunciation : " pronunciation not found"
    }</div>
        <div class="flex justify-between items-center">
          <button onclick="loadWordDetail(${
            word.id
          })" class="btn bg-[#1a90ff10] hover:bg-[#1a90ff80]"><i class="fa-solid fa-circle-info"></i></button>
          <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1a90ff10] transition hover:bg-[#1a90ff80]"><i class="fa-solid fa-volume-high"></i></button>
        </div>
      </div>`;
    manageSpinner(false);
    wordContainer.append(card);
  });
};

// btn
const displayLesson = (lessons) => {
  // 1. get the container & empty
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";

  // 2. get into evey lessons
  for (let lesson of lessons) {
    // 3. create4 Element

    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `<button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})"  class="btn btn-dash btn-primary lesson-btn " > 
      <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}</button>`;
    // 4. append into  container
    levelContainer.append(btnDiv);
  }
};
loadLessons();

// search
document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const fillterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );
      displayLevelWorld(fillterWords);
    });
});
