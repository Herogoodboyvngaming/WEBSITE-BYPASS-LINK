// ======================== CONFIG ========================
const API_LIST = [
  "https://api.bypass.vip/bypass?url=",
  "https://bypass.link/api?bypass=",
  "https://keybypass.net/api?url=",
  "https://bypass.city/api?url=",
  "https://all-bypass-api.vercel.app/?url="
];

// ======================== ELEMENTS ========================
const input = document.getElementById("linkInput");
const bypassBtn = document.getElementById("bypassBtn");
const resultDiv = document.getElementById("result");
const resultText = document.getElementById("resultText");
const copyBtn = document.getElementById("copyBtn");
const infoBtn = document.getElementById("infoBtn");
const modal = document.getElementById("infoModal");
const closeModal = document.querySelector(".close");

// ======================== BYPASS FUNCTION ========================
async function bypassLink() {
  let url = input.value.trim();

  // Chưa nhập link
  if (!url) {
    resultText.innerHTML = `<span style="color:#ffcc00; font-weight:bold;">Bạn chưa nhập liên kết!</span><br><br>Vui lòng dán liên kết cần bypass vào ô trên và ấn nút "BYPASS VIP NGAY".`;
    resultDiv.classList.add("show");
    resultText.style.color = "#ffcc00";
    return;
  }

  // Thêm https nếu thiếu
  if (!url.match(/^https?:\/\//i)) {
    url = "https://" + url;
  }

  // Từ chối link4m
  if (url.toLowerCase().includes("link4m.com")) {
    resultText.innerHTML = `<span style="color:#ff4444; font-weight:bold;">Link4m.com KHÔNG ĐƯỢC HỖ TRỢ</span><br><br>Hãy dùng link khác nhé!`;
    resultDiv.classList.add("show");
    resultText.style.color = "#ff4444";
    return;
  }

  // Loading state
  resultText.textContent = "Đang bypass VIP... chờ chút nhé";
  resultDiv.classList.add("show");
  resultText.style.color = "#fff";
  bypassBtn.disabled = true;
  bypassBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ĐANG XỬ LÝ...';

  let success = false;
  let finalLink = null;

  // Thử từng API
  for (const apiBase of API_LIST) {
    try {
      const apiUrl = apiBase + encodeURIComponent(url);
      const response = await fetch(apiUrl, {
        headers: { "User-Agent": "BypassVIP-Tool/2026" },
        mode: "cors"
      });

      if (!response.ok) continue;

      const data = await response.json();

      finalLink = data.result || data.destination || data.bypassedlink || 
                  data.url || data.direct || data.link || data.bypass || null;

      if (finalLink && finalLink.startsWith("http")) {
        success = true;
        break;
      }
    } catch (err) {
      console.log(`API ${apiBase} fail`, err);
    }
  }

  // Kết quả
  if (success && finalLink) {
    resultText.innerHTML = `<a href="\( {finalLink}" target="_blank" rel="noopener noreferrer" style="color:#4dff91; text-decoration:underline; font-weight:bold; word-break:break-all;"> \){finalLink}</a>`;
    resultText.style.color = "";
  } else {
    resultText.textContent = "Không bypass được link này... Có thể link không hỗ trợ hoặc API tạm quá tải. Thử link khác nhé!";
    resultText.style.color = "#ffcccc";
  }

  // Reset button
  bypassBtn.disabled = false;
  bypassBtn.innerHTML = '<i class="fas fa-rocket"></i> BYPASS VIP NGAY';
}

// ======================== COPY FUNCTION ========================
function copyResult() {
  const linkElement = resultText.querySelector("a");
  const text = linkElement ? linkElement.href : resultText.textContent.trim();

  if (text && text.includes("http")) {
    navigator.clipboard.writeText(text)
      .then(() => alert("Đã copy link gốc thành công!"))
      .catch(() => alert("Copy thất bại, bạn copy thủ công nhé!"));
  } else {
    alert("Chưa có link hợp lệ để copy!");
  }
}

// ======================== MODAL INFO ========================
function openInfoModal() {
  modal.style.display = "block";
}

function closeInfoModal() {
  modal.style.display = "none";
}

// ======================== EVENT LISTENERS ========================
bypassBtn.addEventListener("click", bypassLink);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") bypassLink();
});
copyBtn.addEventListener("click", copyResult);
infoBtn.addEventListener("click", openInfoModal);
closeModal.addEventListener("click", closeInfoModal);

// Đóng modal khi click bên ngoài
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeInfoModal();
  }
});
