const form = document.getElementById("choiceForm");
const namaInput = document.getElementById("nama");
const jumlahInput = document.getElementById("jumlahPilihan");
const emailInput = document.getElementById("email");
const opsiContainer = document.getElementById("opsiContainer");
const previewContainer = document.getElementById("previewContainer");
const output = document.getElementById("output");

let pilihan = [];

function setError(id, message) {
  document.getElementById(id).textContent = message;
}

function clearErrors() {
  ["namaError", "jumlahError", "emailError"].forEach((id) => setError(id, ""));
}

function validasiJumlah() {
  const jumlah = Number(jumlahInput.value);
  const valid = Number.isSafeInteger(jumlah) && jumlah >= 1;

  setError("jumlahError", valid ? "" : "Masukkan bilangan bulat minimal 1.");
  return valid;
}

function buatKolomPilihan() {
  clearErrors();

  if (!validasiJumlah()) {
    jumlahInput.focus();
    return;
  }

  opsiContainer.replaceChildren();
  previewContainer.replaceChildren();
  output.hidden = true;
  pilihan = [];

  for (let nomor = 1; nomor <= Number(jumlahInput.value); nomor += 1) {
    const wrapper = document.createElement("div");
    wrapper.className = "option-input-row";

    const label = document.createElement("label");
    label.htmlFor = `pilihan-${nomor}`;
    label.textContent = `Pilihan ke-${nomor}`;

    const input = document.createElement("input");
    input.id = `pilihan-${nomor}`;
    input.type = "text";
    input.className = "option-input";
    input.placeholder = `Masukkan teks pilihan ke-${nomor}`;
    input.required = true;

    wrapper.append(label, input);
    opsiContainer.appendChild(wrapper);
  }
}

function ambilPilihan() {
  const inputs = [...opsiContainer.querySelectorAll(".option-input")];
  const values = inputs.map((input) => input.value.trim());

  if (inputs.length === 0) {
    alert("Buat kolom pilihan terlebih dahulu.");
    return null;
  }

  if (values.some((value) => value === "")) {
    alert("Isi semua teks pilihan sebelum melanjutkan.");
    inputs[values.findIndex((value) => value === "")].focus();
    return null;
  }

  return values;
}

function buatKelompokPilihan(title, type, name, values) {
  const group = document.createElement("div");
  group.className = "preview-group";

  const heading = document.createElement("h3");
  heading.textContent = title;
  group.appendChild(heading);

  if (type === "select") {
    const select = document.createElement("select");
    select.id = "pilihanDropdown";
    select.setAttribute("aria-label", "Pilih satu opsi dari dropdown");

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Pilih salah satu";
    select.appendChild(placeholder);

    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });

    group.appendChild(select);
    return group;
  }

  const list = document.createElement("div");
  list.className = "choice-list";

  values.forEach((value, index) => {
    const label = document.createElement("label");
    label.className = "choice-item";

    const input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.value = value;
    input.id = `${name}-${index + 1}`;

    const text = document.createElement("span");
    text.textContent = value;

    label.append(input, text);
    list.appendChild(label);
  });

  group.appendChild(list);
  return group;
}

function tampilkanPilihan() {
  const values = ambilPilihan();
  if (!values) return false;

  pilihan = values;
  previewContainer.replaceChildren(
    buatKelompokPilihan("Dropdown", "select", "", pilihan),
    buatKelompokPilihan("Checkbox", "checkbox", "pilihanCheckbox", pilihan),
    buatKelompokPilihan("Radio button", "radio", "pilihanRadio", pilihan)
  );
  output.hidden = true;
  return true;
}

document.getElementById("buatOpsi").addEventListener("click", buatKolomPilihan);
document.getElementById("tampilkanOpsi").addEventListener("click", tampilkanPilihan);

jumlahInput.addEventListener("input", () => {
  if (jumlahInput.value !== "") validasiJumlah();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const nama = namaInput.value.trim();
  const email = emailInput.value.trim();
  let valid = true;

  if (!nama) {
    setError("namaError", "Nama wajib diisi.");
    namaInput.focus();
    valid = false;
  }

  if (!validasiJumlah()) {
    if (valid) jumlahInput.focus();
    valid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Format email tidak valid. Silakan masukkan ulang email Anda.");
    setError("emailError", "Email harus menggunakan format nama@domain.com.");
    emailInput.value = "";
    emailInput.focus();
    valid = false;
  }

  if (!valid) return;

  if (previewContainer.childElementCount === 0 && !tampilkanPilihan()) return;
  const currentValues = ambilPilihan();
  if (!currentValues) return;
  pilihan = currentValues;

  const dropdownValue = document.getElementById("pilihanDropdown").value;
  const checkboxValues = [...form.querySelectorAll('input[name="pilihanCheckbox"]:checked')]
    .map((input) => input.value);
  const radioValue = form.querySelector('input[name="pilihanRadio"]:checked')?.value || "Belum dipilih";

  const outputTitle = document.createElement("h3");
  outputTitle.textContent = "Output JavaScript";
  const outputRows = [
    ["Nama", nama],
    ["Email", email],
    ["Jumlah pilihan", String(pilihan.length)],
    ["Array pilihan", JSON.stringify(pilihan)],
    ["Pilihan dropdown", dropdownValue || "Belum dipilih"],
    ["Pilihan checkbox", checkboxValues.join(", ") || "Belum dipilih"],
    ["Pilihan radio", radioValue]
  ];

  output.replaceChildren(outputTitle);
  outputRows.forEach(([label, value]) => {
    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    paragraph.append(strong, document.createTextNode(value));
    output.appendChild(paragraph);
  });

  output.hidden = false;
});

buatKolomPilihan();
