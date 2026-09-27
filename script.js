function isInteger(value) {
  return /^-?\d+$/.test(value.trim());
}

function showResult(message, className) {
  const result = document.getElementById("result");
  result.textContent = message;
  result.className = "result " + className;
}

const submitButton = document.querySelector('#prime-form button[type="submit"]');

async function initPyodide() {
  const pyodide = await loadPyodide();
  const response = await fetch("prime.py");
  const code = await response.text();
  pyodide.runPython(code);
  return pyodide;
}

const pyodideReady = initPyodide().then(function (pyodide) {
  submitButton.disabled = false;
  submitButton.textContent = "Check";
  return pyodide;
});

document.getElementById("prime-form").addEventListener("submit", async function (e) {
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
  const pyodide = await pyodideReady;

  const isPrimeFn = pyodide.globals.get("is_prime");
  const getDivisorsFn = pyodide.globals.get("get_divisors");

  const primeResult = isPrimeFn(num);
  const divisorsPy = getDivisorsFn(num);
  const divisors = divisorsPy.toJs();
  divisorsPy.destroy();

  const divisorInfo = "(약수 " + divisors.length + "개: " + divisors.join(", ") + ")";

  if (primeResult) {
    showResult(num + "은(는) 소수입니다.\n" + divisorInfo, "prime");
  } else {
    showResult(num + "은(는) 소수가 아닙니다.\n" + divisorInfo, "not-prime");

    const card = document.querySelector(".card");
    card.classList.remove("shake-vertical");
    void card.offsetWidth;
    card.classList.add("shake-vertical");
  }
});
