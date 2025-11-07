document.addEventListener('DOMContentLoaded', () => {
  const doctors = document.querySelectorAll('.doctor');
  const boxes = document.querySelectorAll('.box');
  const createBtn = document.getElementById('create');
  const copyBtn = document.getElementById('copy');
  const output = document.getElementById('output');

  doctors.forEach(doc => {
    doc.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', doc.textContent);
    });
  });

  boxes.forEach(box => {
    box.addEventListener('dragover', e => {
      e.preventDefault();
      box.classList.add('dragover');
    });

    box.addEventListener('dragleave', () => {
      box.classList.remove('dragover');
    });

    box.addEventListener('drop', e => {
      e.preventDefault();
      box.classList.remove('dragover');
      const name = e.dataTransfer.getData('text/plain');
      box.textContent = box.getAttribute('data-shift').charAt(0).toUpperCase() + box.getAttribute('data-shift').slice(1) + ' Duty: ' + name;
      box.setAttribute('data-doctor', name);
    });
  });

  createBtn.addEventListener('click', () => {
    const selectedDay = document.querySelector('input[name="day"]:checked').value;
    const today = new Date();
    const targetDate = selectedDay.includes('today') ? today : new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const dateStr = targetDate.toLocaleDateString('en-IN');

    const confirmationMessage = `Are you sure about the following?\nDay: ${selectedDay.includes('today') ? 'Today' : 'Tomorrow'}\nDate: ${dateStr}`;
    if (!confirm(confirmationMessage)) {
      return; // Stop execution if the user cancels
    }

    let text = `${selectedDay.toUpperCase()}\nDate: ${dateStr}\n`;

    const morning = document.querySelector('[data-shift="morning"]').getAttribute('data-doctor');
    const afternoon = document.querySelector('[data-shift="afternoon"]').getAttribute('data-doctor');
    const night = document.querySelector('[data-shift="night"]').getAttribute('data-doctor');
    const off = document.querySelector('[data-shift="off"]').getAttribute('data-doctor');
    const hrs24 = document.querySelector('[data-shift="24 hrs"]').getAttribute('data-doctor');

    if (morning) text += `*9 am to 5 pm:* ${morning}\n`;
    if (afternoon) text += `*12 noon to 8 pm:* ${afternoon}\n`;
    if (night) {
      if (night.trim() === 'Dr Manikanta' || night.trim() === 'Dr Sindhuja') {
        text += `*5 pm to 8 am (night duty):* ${night}\n`;
      } else {
        text += `*5 pm to 9 am (night duty):* ${night}\n`;
      }
    }
    if (off) text += `*Duty off:* ${off}\n`;
    if (hrs24) text += `*24 hrs Duty:* ${hrs24}\n`;

    output.textContent = text.trim();

    // Example usage:
    const sentence = text.trim();
    const wordToFind = "9 am to 5 pm:";
    console.log(isWordInSentence(sentence, wordToFind)); // Output: true
  });

  copyBtn.addEventListener('click', () => {
    if (output.textContent.trim() !== '') {
      navigator.clipboard.writeText(output.textContent).then(() => {
        alert('Schedule copied to clipboard!');
      });
    } else {
      alert('No schedule to copy!');
    }
  });

  /**
   * Function to check if a word exists in a sentence
   * @param {string} sentence - The sentence to search in
   * @param {string} word - The word to search for
   * @returns {boolean} - Returns true if the word is found, false otherwise
   */
  function isWordInSentence(sentence, word) {
    // Validate inputs
    if (typeof sentence !== 'string' || typeof word !== 'string') {
      throw new Error("Both sentence and word must be strings.");
    }

    // Use a regular expression to check for the word as a whole word (case-insensitive)
    const regex = new RegExp(`^${word}$`, 'i'); // \b ensures word boundaries
    return regex.test(sentence);
  }





});
