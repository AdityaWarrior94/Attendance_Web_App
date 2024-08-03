document.addEventListener('DOMContentLoaded', () => {
  fetch('https://script.google.com/macros/s/AKfycby_YfAU2vvyo_zop3gWvNhwEMj8iQWG0SjoW4xskJM46C_lNuhl5QZSB4B5Rt1p4thC/exec?action=getDropDownData')
    .then(response => response.json())
    .then(data => {
      console.log('Data from Google Sheets:', data);
      populateForm(data);
    })
    .catch(error => console.error('Error:', error));
});

function populateForm(data) {
  // Populate dropdowns using data
  const branchNameSelect = document.getElementById('branch-name');
  const teacherNameSelect = document.getElementById('teacher-name');
  const subjectNameSelect = document.getElementById('subject-name');

  data.branches.forEach(branch => {
    const option = document.createElement('option');
    option.value = branch;
    option.textContent = branch;
    branchNameSelect.appendChild(option);
  });

  data.teachers.forEach(teacher => {
    const option = document.createElement('option');
    option.value = teacher;
    option.textContent = teacher;
    teacherNameSelect.appendChild(option);
  });

  data.subjects.forEach(subject => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    subjectNameSelect.appendChild(option);
  });
}

function handleSubmit(event) {
  event.preventDefault();
  document.getElementById('loader').classList.remove('hidden');
  const form = document.getElementById('student-form');
  const formData = new FormData(form);
  const studentData = [];

  const studentNameElements = document.querySelectorAll('td:nth-child(2)');
  const presentElements = document.querySelectorAll('input[name^="present-"]');
  const quizScoreElements = document.querySelectorAll('input[name^="quiz-score-"]');
  const assignmentGradeElements = document.querySelectorAll('select[name^="assignment-grade-"]');

  studentNameElements.forEach((nameElement, i) => {
    studentData.push({
      studentName: nameElement.textContent,
      present: presentElements[i].checked,
      quizScore: quizScoreElements[i].value,
      assignmentGrade: assignmentGradeElements[i].value
    });
  });

  const formObj = {
    date: formData.get('date'),
    time: formData.get('time'),
    branchName: formData.get('branch-name'),
    batchName: formData.get('batch-name'),
    grade: formData.get('grade'),
    teacherName: formData.get('teacher-name'),
    subjectName: formData.get('subject-name'),
    chapterName: formData.get('chapter-name'),
    subtopicName: formData.get('subtopic-name'),
    studentData: studentData
  };

  fetch('https://script.google.com/macros/s/AKfycby_YfAU2vvyo_zop3gWvNhwEMj8iQWG0SjoW4xskJM46C_lNuhl5QZSB4B5Rt1p4thC/exec?action=submitData', {
    method: 'POST',
    body: JSON.stringify(formObj),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(responseData => {
    handleResponse(responseData);
  })
  .catch(error => {
    handleError(error);
  });
}

function handleResponse(response) {
  document.getElementById('loader').classList.add('hidden');
  const successMessage = document.getElementById('success-message');
  successMessage.textContent = `Form submitted successfully! Topper: ${response.topperName}, Present count: ${response.presentCount}`;
  successMessage.classList.remove('hidden');
  document.getElementById('student-form').reset();
  document.getElementById('student-table').classList.add('hidden');
}

function handleError(error) {
  document.getElementById('loader').classList.add('hidden');
  alert(`Error: ${error.message}`);
}
