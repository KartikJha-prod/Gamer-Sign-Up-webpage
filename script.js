const Callsign_Input = document.querySelector('#fname');
const Email_Input = document.querySelector('#email');
const Password_Input = document.querySelector('#password');
const Confirm_Password = document.querySelector('#confirm-password');
const Terms_Checkbox = document.querySelector('#check');
const Init_Btn = document.querySelector('#init-btn');

const Strength_Bars = document.querySelectorAll('.strength');
const Strength_Text = document.querySelector('#strength-text');
const Match_Text = document.querySelector('#match-text');

const Mobile_Ready = document.querySelector('#mobile-ready-count');
const Desktop_Ready = document.querySelector('#desktop-ready-count');
const Operator_Display = document.querySelector('#operator-display-name');

const Check_Callsign = document.querySelector('#check-callsign');
const Check_Email = document.querySelector('#check-email');
const Check_Password = document.querySelector('#check-password');
const Check_Confirm = document.querySelector('#check-confirm');

const Modal = document.querySelector('#review-modal');
const Confirmed_Callsign = document.querySelector('#confirmed-callsign');
const Continue_Login_Btn = document.querySelector('#continue-login-btn');

function cleanCallsign(value) {
  return value
    .replace(/\s+/g, '_')
    .replace(/[^A-Za-z0-9_-]/g, '')
    .slice(0, 20);
}

function updateValidationState() {
  const callsignValid = Callsign_Input.value.length >= 3 && Callsign_Input.value.length <= 20;
  const email = Email_Input.value.trim();
  const emailValid = email.includes('@') && email.includes('.');
  const pwd = Password_Input.value;
  const passwordValid = pwd.length >= 8 && /\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd);
  const confirmValid = Confirm_Password.value !== "" && Confirm_Password.value === pwd;
  const termsValid = Terms_Checkbox.checked;

  Check_Callsign.classList.toggle('is-visible', callsignValid);
  Check_Email.classList.toggle('is-visible', emailValid);
  Check_Password.classList.toggle('is-visible', passwordValid);
  Check_Confirm.classList.toggle('is-visible', confirmValid);

  const readyCount = [callsignValid, emailValid, passwordValid, confirmValid, termsValid].filter(Boolean).length;
  const readyLabel = `${readyCount}/5 READY`;

  if (Mobile_Ready) {
    Mobile_Ready.textContent = readyLabel;
    Mobile_Ready.classList.toggle('is-ready', readyCount === 5);
  }
  if (Desktop_Ready) {
    Desktop_Ready.textContent = readyLabel;
    Desktop_Ready.classList.toggle('is-ready', readyCount === 5);
  }

  if (Operator_Display) {
    Operator_Display.textContent = Callsign_Input.value.length > 0 ? Callsign_Input.value : "UNASSIGNED";
  }

  const allValid = readyCount === 5;
  Init_Btn.disabled = !allValid;
  return allValid;
}

Callsign_Input.addEventListener('input', () => {
  Callsign_Input.value = cleanCallsign(Callsign_Input.value);
  updateValidationState();
});

Email_Input.addEventListener('input', updateValidationState);

Password_Input.addEventListener('input', () => {
  const Password = Password_Input.value;
  const Has_Length = Password.length >= 8;
  const Has_Number = /\d/.test(Password);
  const Has_Special = /[^A-Za-z0-9]/.test(Password);

  let activeBars = 0;
  let missing = [];

  Strength_Text.classList.remove('is-weak', 'is-strong');

  if (Password.length === 0) {
    activeBars = 0;
    Strength_Text.textContent = "ENTER PASSWORD";
  } else {
    activeBars = 1;
    if (Has_Length) activeBars++; else missing.push("8+ CHARS");
    if (Has_Number) activeBars++; else missing.push("NUMBER");
    if (Has_Special) activeBars++; else missing.push("SYMBOL");

    if (missing.length === 0) {
      Strength_Text.textContent = "STRONG";
      Strength_Text.classList.add('is-strong');
    } else {
      Strength_Text.textContent = "ADD " + missing.join(", ");
      Strength_Text.classList.add('is-weak');
    }
  }

  Strength_Bars.forEach((bar, index) => {
    bar.classList.toggle('is-active', index < activeBars);
  });

  checkMatch();
  updateValidationState();
});

function checkMatch() {
  if (Confirm_Password.value === "" || Confirm_Password.value === Password_Input.value) {
    Match_Text.textContent = "";
  } else {
    Match_Text.textContent = "Passwords don't match";
  }
}

Confirm_Password.addEventListener('input', () => {
  checkMatch();
  updateValidationState();
});

Terms_Checkbox.addEventListener('change', updateValidationState);

document.querySelectorAll('.toggle-eye').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetInput = document.getElementById(btn.dataset.target);
    targetInput.type = targetInput.type === "password" ? "text" : "password";
  });
});

Init_Btn.addEventListener('click', () => {
  if (!updateValidationState()) return;

  Confirmed_Callsign.textContent = Callsign_Input.value;
  if (Mobile_Ready) Mobile_Ready.textContent = "PROVISIONED";
  if (Desktop_Ready) Desktop_Ready.textContent = "PROVISIONED";

  Modal.classList.add('is-open');
});

Continue_Login_Btn.addEventListener('click', () => {
  Modal.classList.remove('is-open');
});
