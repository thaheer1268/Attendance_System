    document.getElementById("dateDisplay").textContent = new Date().toLocaleDateString();

    const studentListContainer = document.getElementById("studentList");
    const studentSection = document.getElementById("studentListSection");
    let students = [];
    let attendanceStarted = false;

    // Function to save data to JSON file
    function saveToFile() {
      const data = {
        attendanceStarted,
        students
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'attendance_data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Data saved to file successfully!');
    }

    // Function to load data from JSON file
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
            
            if (attendanceStarted) {
              document.getElementById("attendanceStatus").textContent = "Yes";
              studentSection.style.display = "block";
            } else {
              document.getElementById("attendanceStatus").textContent = "No";
              studentSection.style.display = "none";
            }
            
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

    function addStudent() {
      const name = prompt("Enter student name:");
      if (name) {
        students.push({
          name,
          status: 'absent' // default status
        });
        renderStudents();
        updateCounts();
      }
    }

    function startAttendance() {
      attendanceStarted = true;
      document.getElementById("attendanceStatus").textContent = "Yes";
      studentSection.style.display = "block";
      renderStudents();
      updateCounts();
    }

    function renderStudents() {
      studentListContainer.innerHTML = "";
      students.forEach((student, index) => {
        const div = document.createElement("div");
        div.className = "student-item";
        div.innerHTML = `
          <span>${student.name}</span>
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
    async function saveToFile() {
  const data = {
    attendanceStarted,
    students,
    lastUpdated: new Date().toISOString()
  };

  try {
    // Try using the File System Access API (works in modern browsers)
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
        console.log('User canceled save or API not available:', err);
      }
    }

    // Fallback method for browsers without File System Access API
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance.json';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('File downloaded as attendance.json. Please save it in your project folder.');
    }, 100);
    
  } catch (error) {
    console.error('Error saving file:', error);
    alert('Failed to save file: ' + error.message);
  }
}