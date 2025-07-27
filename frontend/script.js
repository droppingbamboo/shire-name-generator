let namesData = {};

async function loadNames() {
  const res = await fetch('/names');
  namesData = await res.json();
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadNames();

  document.getElementById('generate').addEventListener('click', () => {
    const firstType = document.getElementById('firstType').value;
    const lastSource = document.getElementById('lastSource').value;

    const first = randomName(namesData[firstType]);
    const last = randomName(namesData[lastSource]);

    document.getElementById('result').textContent = `${first} ${last}`;
  });
});

function randomName(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
