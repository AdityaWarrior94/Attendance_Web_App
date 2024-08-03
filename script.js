// script.js
let studentsData;
let chapterData;
let batchNames = new Map();
let gradeNames = new Map();
let chapterNames = new Map();

function fetchData() {
  // This function will be replaced with static data or an AJAX call
}

function populateForm(data) {
  studentsData = data.students;
  chapterData = data.chapterNames;
  const branchNameSelect = document.getElementById('branch-name');
  const teacherNameSelect = document.getElementById('teacher-name');
  const subjectNameSelect = document.getElementById('subject-name');

  data.branchNames.forEach(branch => {
    const option = document.createElement('option');
    option.value = branch;
    option.textContent = branch;
    branchNameSelect.appendChild(option);
  });

  data.teacherNames.forEach(teacher => {
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

  // Initialize batch and grade names map
  data.students.forEach(student => {
    if (!batchNames.has(student.branchName)) {
      batchNames.set(student.branchName, new Set());
    }
    batchNames.get(student.branchName).add(student.batchName);

    if (!gradeNames.has(student.batchName)) {
      gradeNames.set(student.batchName, new Set());
    }
    gradeNames.get(student.batchName).add(student.grade);
  });

  // Initialize chapter names map
  data.chapterNames.forEach(chapter => {
    if (!chapterNames.has(chapter.subjectName)) {
      chapterNames.set(chapter.subjectName, new Set());
    }
    chapterNames.get(chapter.subjectName).add(chapter.chapterName);
  });
}

function populateBatchNames() {
  const branchName = document.getElementById('branch-name').value;
  const batchNameSelect = document.getElementById('batch-name');
  batchNameSelect.innerHTML = '<option value="">Select Batch</option>';

  if (batchNames.has(branchName)) {
    batchNames.get(branchName).forEach(batch => {
      const option = document.createElement('option');
      option.value = batch;
      option.textContent = batch;
      batchNameSelect.appendChild(option);
    });
  }
}

function populateGradeNames() {
  const batchName = document.getElementById('batch-name').value;
  const gradeNameSelect = document.getElementById('grade');
  gradeNameSelect.innerHTML = '<option value="">Select Grade</option>';

  if (gradeNames.has(batchName)) {
    gradeNames.get(batchName).forEach(grade => {
      const option = document.createElement('option');
      option.value = grade;
      option.textContent = grade;
      gradeNameSelect.appendChild(option);
    });
  }

  filterStudents(); // Call filterStudents here
}

function populateChapterNames() {
  const subjectName = document.getElementById('subject-name').value;
  const chapterNameSelect = document.getElementById('chapter-name');
  chapterNameSelect.innerHTML = '<option value="">Select Chapter</option>';

  if (chapterNames.has(subjectName)) {
    chapterNames.get(subjectName).forEach(chapter => {
      const option = document.createElement('option');
      option.value = chapter;
      option.textContent = chapter;
      chapterNameSelect.appendChild(option);
    });
  }
}

function filterStudents() {
  const batchName = document.getElementById('batch-name').value;

  const filteredStudents = studentsData.filter(student => 
    student.batchName === batchName
  );

  const studentTableBody = document.getElementById('student-table-body');
  studentTableBody.innerHTML = '';

  filteredStudents.forEach((student, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.studentName}</td>
      <td><input type="checkbox" name="present-${index}"></td>
      <td><input type="number" name="quiz-score-${index}" min="0" max="100"></td>
      <td>
        <select name="assignment-grade-${index}">
          <option value="AC">AC</option>
          <option value="BA">BA</option>
          <option value="BB">BB</option>
          <option value="BC">BC</option>
          <option value="CA">CA</option>
          <option value="CB">CB</option>
          <option value="CC">CC</option>
          <option value="DD">DD</option>
        </select>
      </td>
    `;
    studentTableBody.appendChild(row);
  });

  document.getElementById('student-table').classList.remove('hidden');
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
      assignmentGrade: assignmentGradeElements[i].value // Ensure this is gathered correctly
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

  // Submit the form data (currently using google.script.run)
  // You might need to replace this with a static data submission method
  handleResponse(formObj);
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

document.addEventListener('DOMContentLoaded', fetchData);

// Set current date and time
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('date');
  const timeInput = document.getElementById('time');
  const now = new Date();

  // Set date input value to today's date in yyyy-mm-dd format
  dateInput.value = now.toISOString().split('T')[0];

  // Set time input value to current time in hh:mm format
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  timeInput.value = `${hours}:${minutes}`;
});
