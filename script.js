
const tarotCards = [
  {
    name: "The Fool",
    symbol: "✧",
    meaning: "ภาพรวม: เริ่มต้นสิ่งใหม่ เปิดใจให้โอกาสและเรียนรู้จากประสบการณ์"
  },
  {
    name: "The Lovers",
    symbol: "♡",
    meaning: "ความรัก: ให้ความสำคัญกับความเข้าใจ ความซื่อสัตย์ และการสื่อสาร"
  },
  {
    name: "The Star",
    symbol: "☆",
    meaning: "การเรียน: อย่าหมดหวัง ความพยายามอย่างสม่ำเสมอจะช่วยให้คุณก้าวหน้า"
  },
  {
    name: "The Sun",
    symbol: "☀",
    meaning: "การงาน: มองหาโอกาสใหม่ เชื่อมั่นในความสามารถและลงมือทำอย่างตั้งใจ"
  },
  {
    name: "The Magician",
    symbol: "✦",
    meaning: "คุณมีศักยภาพที่จะเริ่มต้นสิ่งที่ตั้งใจ วางแผนและใช้ทักษะที่มีให้เต็มที่"
  },
  {
    name: "The Hermit",
    symbol: "☾",
    meaning: "ใช้เวลาทบทวนตัวเอง อย่ารีบร้อนตัดสินใจเมื่อข้อมูลยังไม่ครบ"
  }
];

const drawButton = document.getElementById("drawButton");
const historyButton = document.getElementById("historyButton");

let currentReading = null;

// Fisher-Yates Shuffle: สุ่มสับลำดับไพ่
function shuffleCards(cards) {
  const shuffled = [...cards];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] =
      [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

// Recursion: เรียกฟังก์ชันซ้ำเพื่อเลือกไพ่
function selectCards(cards, count, index = 0) {
  if (count === 0 || index >= cards.length) {
    return [];
  }

  return [
    cards[index],
    ...selectCards(cards, count - 1, index + 1)
  ];
}

// เปิดไพ่และแสดงคำทำนาย
drawButton.addEventListener("click", function () {
  const topic = document.getElementById("topic").value;

  const shuffled = shuffleCards(tarotCards);
  const selected = selectCards(shuffled, 1);
  const card = selected[0];

  currentReading = {
    topic: topic,
    name: card.name,
    symbol: card.symbol,
    meaning: card.meaning,
    date: new Date().toLocaleString("th-TH")
  };

  document.getElementById("cardSymbol").textContent =
    card.symbol;

  document.getElementById("cardName").textContent =
    card.name;

  document.getElementById("cardMeaning").textContent =
    "หัวข้อ: " + topic + " — " + card.meaning;
});

// อ่านประวัติจาก localStorage
function getHistory() {
  try {
    return JSON.parse(
      localStorage.getItem("tarotHistory") || "[]"
    );
  } catch {
    return [];
  }
}

// บันทึกผลการเปิดไพ่
function saveReading(reading) {
  const history = getHistory();

  history.unshift(reading);

  localStorage.setItem(
    "tarotHistory",
    JSON.stringify(history.slice(0, 10))
  );
}

// แสดงประวัติการดูดวง
historyButton.addEventListener("click", function () {
  const history = getHistory();
  const list = document.getElementById("historyList");

  list.replaceChildren();

  if (history.length === 0) {
    const item = document.createElement("li");
    item.textContent = "ยังไม่มีประวัติ กรุณาเปิดไพ่ก่อน";
    list.appendChild(item);
    return;
  }

  history.forEach(function (reading) {
    const item = document.createElement("li");

    item.textContent =
      reading.topic + " — " +
      reading.name + " (" + reading.date + ")";

    list.appendChild(item);
  });
});

// บันทึกอัตโนมัติทุกครั้งที่เปิดไพ่
drawButton.addEventListener("click", function () {
  if (currentReading) {
    saveReading(currentReading);
  }
});

