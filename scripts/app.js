document.addEventListener('DOMContentLoaded', () => {
  const doctorsContainer = document.querySelector('.doctors-container');
  const boxesContainer = document.querySelector('.boxes-container');
  const createBtn = document.getElementById('create');
  const copyBtn = document.getElementById('copy');
  const output = document.getElementById('output');
  const onCallModal = document.getElementById('on-call-modal');
  const modalOptions = document.getElementById('modal-options');

  // Add the original classes for styling
  doctorsContainer.classList.add('doctors');
  boxesContainer.classList.add('boxes');

  let pendingOnCall = null;

  function showOnCallModal(doctorName, shiftBox) {
    pendingOnCall = { doctorName, shiftBox };
    onCallModal.style.display = 'block';
  }

  function hideOnCallModal() {
    pendingOnCall = null;
    onCallModal.style.display = 'none';
  }

  modalOptions.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON' && pendingOnCall) {
      const time = e.target.dataset.time;
      const { doctorName, shiftBox } = pendingOnCall;

      shiftBox.textContent = `Anesthesiologist On Call: ${doctorName} (${time})`;
      shiftBox.dataset.doctor = doctorName;
      shiftBox.dataset.time = time;

      hideOnCallModal();
    }
  });

  // Create doctor buttons
  doctors.forEach(doc => {
    const docButton = document.createElement('button');
    docButton.classList.add('doctor');
    docButton.draggable = true;
    docButton.textContent = doc.name;
    docButton.style.backgroundColor = doc.color;
    docButton.style.color = doc.textColor;
    docButton.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', doc.name);
    });
    doctorsContainer.appendChild(docButton);
  });

  // Create shift boxes
  shifts.forEach(shift => {
    const shiftBox = document.createElement('div');
    shiftBox.classList.add('box');
    shiftBox.dataset.shift = shift.id;
    shiftBox.textContent = shift.name;
    shiftBox.addEventListener('dragover', e => {
      e.preventDefault();
      shiftBox.classList.add('dragover');
    });

    shiftBox.addEventListener('dragleave', () => {
      shiftBox.classList.remove('dragover');
    });

    shiftBox.addEventListener('drop', e => {
      e.preventDefault();
      shiftBox.classList.remove('dragover');
      const name = e.dataTransfer.getData('text/plain');

      if (shift.id === 'oncall') {
        showOnCallModal(name, shiftBox);
      } else if (shift.id === 'off') {
        // Append doctor to the 'Duty Off' box
        if (shiftBox.dataset.doctors) {
          shiftBox.dataset.doctors += `, ${name}`;
        } else {
          shiftBox.dataset.doctors = name;
        }
        shiftBox.textContent = `Duty Off: ${shiftBox.dataset.doctors}`;
      } else {
        // Replace doctor for other boxes
        shiftBox.textContent = `${shift.name}: ${name}`;
        shiftBox.dataset.doctor = name;
      }
    });
    boxesContainer.appendChild(shiftBox);
  });

  createBtn.addEventListener('click', () => {
    const selectedDay = document.querySelector('input[name="day"]:checked').value;
    const today = new Date();
    const targetDate = selectedDay.includes('today') ? today : new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const dateStr = targetDate.toLocaleDateString('en-IN');

    const confirmationMessage = `Are you sure about the following?\nDay: ${selectedDay.includes('today') ? 'Today' : 'Tomorrow'}\nDate: ${dateStr}`;
    if (!confirm(confirmationMessage)) {
      return;
    }

    let text = `${selectedDay.toUpperCase()}\nDate: ${dateStr}\n`;

    const morning = document.querySelector('[data-shift="morning"]').dataset.doctor;
    const afternoon = document.querySelector('[data-shift="afternoon"]').dataset.doctor;
    const night = document.querySelector('[data-shift="night"]').dataset.doctor;
    const onCallBox = document.querySelector('[data-shift="oncall"]');
    const onCallDoctor = onCallBox.dataset.doctor;
    const onCallTime = onCallBox.dataset.time;
    const off = document.querySelector('[data-shift="off"]').dataset.doctors;
    const hrs24 = document.querySelector('[data-shift="24hrs"]').dataset.doctor;
    const leave = document.querySelector('[data-shift="leave"]').dataset.doctor;

    if (morning) text += `*8 am to 4 pm:* ${morning}\n`;
    if (afternoon) text += `*12 noon to 8 pm:* ${afternoon}\n`;
    if (night) text += `*5 pm to 9 am (night duty):* ${night}\n`;
    if (onCallDoctor) text += `*Anesthetist On Call- ${onCallTime} :* ${onCallDoctor}\n`;
    if (off) text += `*Duty off:* ${off}\n`;
    if (hrs24) text += `*24 hrs Duty(9 am to 9 am):* ${hrs24}\n`;
    if (leave) text += `*Leave:* ${leave}\n`;


    output.textContent = text.trim();
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
});