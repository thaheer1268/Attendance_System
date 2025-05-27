
document.getElementById("dateDisplay").textContent = new Date().toLocaleDateString();


const studentListContainer = document.getElementById("studentList");
const studentSection = document.getElementById("studentListSection");

let students = [];
let attendanceStarted = false;
let lastAttendanceTime = null;

updateLastAttendanceTime();
function updateLastAttendanceTime() {
  const timeElement = document.getElementById("lastAttendanceTime");
  if (lastAttendanceTime) {
    const date = new Date(lastAttendanceTime);
    timeElement.textContent = date.toLocaleString();
  } else {
    timeElement.textContent = "--";
  }
}

async function saveToFile() {
  const data = {
    attendanceStarted,
    students,
    lastAttendanceTime
  };

  try {
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await window.showSaveFilePicker({
          types: [{
            description: 'Attendance Data',
            accept: {'application/json': ['.json']}
          }],
          suggestedName: 'attendance.json'
        });
        
        const writable = await handle.createWritable();
        await writable.write(JSON.stringify(data, null, 2));
        await writable.close();
        alert('Data saved to attendance.json successfully!');
        return;
      } catch (err) {
        console.log('data not saved properly:', err);
      }
    }

  
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance.json';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('File downloaded as attendance.json');
    }, 100);
    
  } catch (error) {
    console.error('Error saving file:', error);
    alert('Failed to save file: ' + error.message);
  }
}

function loadFromFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = event => {
      try {
        const data = JSON.parse(event.target.result);
        students = data.students || [];
        attendanceStarted = data.attendanceStarted || false;
        lastAttendanceTime = data.lastAttendanceTime || null;
        
        if (attendanceStarted) {
          document.getElementById("attendanceStatus").textContent = "Yes";
          studentSection.style.display = "block";
        } else {
          document.getElementById("attendanceStatus").textContent = "No";
          studentSection.style.display = "none";
        }
        
        updateLastAttendanceTime();
        renderStudents();
        updateCounts();
        alert('Data loaded successfully!');
      } catch (error) {
        alert('Error loading file: ' + error.message);
      }
    };
    
    reader.readAsText(file);
  };
  
  input.click();
}

// Student management functions
function addStudent() {
  const name = prompt("Enter student name:");
  if (name) {
    students.push({
      name,
      status: 'absent', // default status
      timestamp: null // initially no timestamp
    });
    renderStudents();
    updateCounts();
  }
}

function startAttendance() {
  attendanceStarted = true;
  lastAttendanceTime = new Date().toISOString();
  document.getElementById("attendanceStatus").textContent = "Yes";
  studentSection.style.display = "block";
  updateLastAttendanceTime();
  renderStudents();
  updateCounts();
}

function renderStudents() {
  studentListContainer.innerHTML = "";
  students.forEach((student, index) => {
    const div = document.createElement("div");
    div.className = "student-item";
    
    // Format timestamp if it exists
    const timeText = student.timestamp ? 
      new Date(student.timestamp).toLocaleString() : 
      "Not marked";
    
    div.innerHTML = `
      <div class="student-info">
        <span class="student-name">${student.name}</span>
        <span class="student-time">${timeText}</span>
      </div>
      <div class="status-btns">
        <button class="present-btn" onclick="updateStatus(${index}, 'present')">Present</button>
        <button class="absent-btn" onclick="updateStatus(${index}, 'absent')">Absent</button>
        <button class="late-btn" onclick="updateStatus(${index}, 'late')">Late</button>
        <button class="remove-btn" onclick="removeStudent(${index})">Remove</button>
      </div>
    `;
    studentListContainer.appendChild(div);
  });
}

function updateStatus(index, status) {
  students[index].status = status;
  students[index].timestamp = new Date().toISOString();
  lastAttendanceTime = new Date().toISOString();
  updateLastAttendanceTime();
  renderStudents();
  updateCounts();
}

function removeStudent(index) {
  if (confirm(`Are you sure you want to remove ${students[index].name}?`)) {
    students.splice(index, 1);
    renderStudents();
    updateCounts();
  }
}

function updateCounts() {
  const present = students.filter(s => s.status === 'present').length;
  const absent = students.filter(s => s.status === 'absent').length;
  const late = students.filter(s => s.status === 'late').length;
  document.getElementById("presentCount").textContent = present;
  document.getElementById("absentCount").textContent = absent;
  document.getElementById("lateCount").textContent = late;
}