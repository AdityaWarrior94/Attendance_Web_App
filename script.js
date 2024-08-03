function doGet() {
  return HtmlService.createHtmlOutputFromFile('index'); // Renders the HTML file named "Index"
}

function submitData(formData) {
  try {
    var sheet = SpreadsheetApp.openById('1-JBOTTfWizQnY4-JFXVPhCbFuWkcqutNMgd-L_NoFak').getSheetByName('AttendanceData');
    var data = formData.students.map(student => [
      new Date().toLocaleDateString(), 
      new Date().toLocaleTimeString(),
      formData.branch, 
      formData.grade, 
      formData.batch, 
      formData.teacher, 
      formData.subject, 
      formData.classType, 
      formData.chapter, 
      formData.subTopic, 
      student.name, 
      student.attendance ? 'Present' : 'Absent', 
      student.speedQuizScore, 
      student.assignmentGrade || 'NULL'
    ]);
    Logger.log(data); // Log the data to ensure it's being processed correctly
    if (data.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, data.length, data[0].length).setValues(data);
    }
    return 'Form Submitted Successfully';
  } catch (e) {
    Logger.log('Error: ' + e.message);
    return 'Error: ' + e.message;
  }
}

function getDropDownData() {
  var sheet = SpreadsheetApp.openById('1-JBOTTfWizQnY4-JFXVPhCbFuWkcqutNMgd-L_NoFak');
  var branches = sheet.getSheetByName('Branches').getRange('A2:A').getValues().flat().filter(String);
  var grades = [...new Set(sheet.getSheetByName('StudentDetails').getRange('B2:B').getValues().flat().filter(String))];
  var batches = sheet.getSheetByName('Batches').getRange('B2:B').getValues().flat().filter(String);
  var teachers = sheet.getSheetByName('Teachers').getRange('A2:A').getValues().flat().filter(String);
  var subjects = sheet.getSheetByName('Subjects').getRange('A2:A').getValues().flat().filter(String);
  var assignmentGrades = sheet.getSheetByName('Assignment Grades').getRange('A2:A').getValues().flat().filter(String);
  
  return {
    branches: branches,
    grades: grades,
    batches: batches,
    teachers: teachers,
    subjects: subjects,
    assignmentGrades: assignmentGrades
  };
}

function getChapters(subject, grade) {
  var sheet = SpreadsheetApp.openById('1-JBOTTfWizQnY4-JFXVPhCbFuWkcqutNMgd-L_NoFak').getSheetByName('Chapters');
  var data = sheet.getDataRange().getValues();
  var chapters = data.filter(row => row[0] == grade && row[1] == subject).map(row => row[2]);
  return chapters;
}

function getStudents(batch) {
  var sheet = SpreadsheetApp.openById('1-JBOTTfWizQnY4-JFXVPhCbFuWkcqutNMgd-L_NoFak').getSheetByName('StudentDetails');
  var data = sheet.getDataRange().getValues();
  var students = data.filter(row => row[3] == batch).map(row => ({
    name: row[2],
    attendance: true,
    speedQuizScore: 0,
    assignmentGrade: ''
  }));
  return students;
}

function getData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Copy of Names');
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  
  const branchNames = [...new Set(data.map(row => row[15]))];
  const teacherNames = [...new Set(data.map(row => row[14]))];
  const subjects = [...new Set(data.map(row => row[11]))];

  const students = data.map(row => ({
    branchName: row[15],
    batchName: row[16],
    grade: row[4],
    studentName: row[0]
  }));

  const chapterNames = data.map(row => ({
    subjectName: row[11],
    chapterName: row[12]
  }));

  return {
    branchNames,
    teacherNames,
    subjects,
    students,
    chapterNames
  };
}

function getChaptersBySubject(subjectName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Copy of Names');
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  
  const chapters = [...new Set(data
    .filter(row => row[11] === subjectName)
    .map(row => row[12]))];
  
  return chapters;
}

function submitForm(form) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('FormResponses');
  const lastRow = sheet.getLastRow();
  const studentData = form.studentData;

  const results = studentData.map(student => [
    form.date,
    form.time,
    form.branchName,
    form.batchName,
    form.grade,
    form.teacherName,
    form.subjectName,
    form.chapterName,
    form.subtopicName,
    student.studentName,
    student.present ? 'Present' : 'Absent',
    student.quizScore,
    student.assignmentGrade
  ]);

  sheet.getRange(lastRow + 1, 1, results.length, results[0].length).setValues(results);

  const topper = studentData.reduce((max, student) => (student.quizScore > max.quizScore ? student : max), { quizScore: -1 });
  const presentCount = studentData.filter(student => student.present).length;

  return {
    topperName: topper.studentName,
    presentCount
  };
}
