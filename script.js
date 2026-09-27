function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function isInteger(value) {
  return /^-?\d+$/.test(value.trim());
}

function showResult(message, className) {
  const result = document.getElementById("result");
  result.textContent = message;
  result.className = "result " + className;
}

document.getElementById("prime-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("number-input");
  const value = input.value;

  if (!isInteger(value)) {
    showResult("정수를 입력해주세요", "error");
    input.value = "";
    input.focus();

    const card = document.querySelector(".card");
    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
    return;
  }

  const num = parseInt(value, 10);
  if (isPrime(num)) {
    showResult(num + "은(는) 소수입니다.", "prime");
  } else {
    showResult(num + "은(는) 소수가 아닙니다.", "not-prime");

    const card = document.querySelector(".card");
    card.classList.remove("shake-vertical");
    void card.offsetWidth;
    card.classList.add("shake-vertical");
  }
});
