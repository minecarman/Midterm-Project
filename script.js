let courses = [];
let students = [];

// Tab navigation
document.querySelectorAll(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"));

        button.classList.add("active");
        document.getElementById(button.getAttribute("data-tab")).classList.add("active");
    });
});

// Add Course
document.getElementById("course-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const courseName = document.getElementById("courseName").value.trim();
    const gradeScale = document.getElementById("gradeScale").value;

    if (courses.some((course) => course.name === courseName)) {
        alert("Course already exists!");
        return;
    }

    courses.push({ name: courseName, gradeScale, students: [] });
    updateCourseList();
    e.target.reset();
});

function updateCourseList() {
    const courseList = document.getElementById("course-list");
    courseList.innerHTML = "";

    courses.forEach((course) => {
        const li = document.createElement("li");
        li.textContent = `${course.name} (Grading Scale: ${course.gradeScale})`;
        courseList.appendChild(li);
    });

    updateDropdowns();
}

// Add Student
document.getElementById("student-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const studentName = document.getElementById("studentName").value.trim();
    const studentId = document.getElementById("number").value.trim();

    if (students.some((student) => student.id === studentId)) {
        alert("Student ID already exists!");
        return;
    }

    students.push({ name: studentName, id: studentId, courses: [] });
    e.target.reset();
    alert("Student added successfully!");
    updateDropdowns();
});

// Add Students to Courses
document.getElementById("assign-student-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const courseName = document.getElementById("select-course").value;
    const studentId = document.getElementById("select-student").value;
    const midterm = parseFloat(document.getElementById("midterm-grade").value);
    const final = parseFloat(document.getElementById("final-grade").value);

    const course = courses.find((course) => course.name === courseName);
    const student = students.find((student) => student.id === studentId);

    if (!course || !student) {
        alert("Invalid course or student!");
        return;
    }

    if (course.students.some((s) => s.id === studentId)) {
        alert("Student already assigned to this course!");
        return;
    }

    course.students.push({ id: studentId, midterm, final });
    student.courses.push({ name: courseName, midterm, final });
    updateCourseStudentList();
    alert("Student assigned to course successfully!");
    e.target.reset();
});

function updateCourseStudentList() {
    const tableBody = document.getElementById("course-student-list").querySelector("tbody");
    tableBody.innerHTML = "";

    courses.forEach((course) => {
        course.students.forEach((student) => {
            const studentDetails = students.find((s) => s.id === student.id);
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${course.name}</td>
                <td>${studentDetails.name}</td>
                <td>${student.midterm}</td>
                <td>${student.final}</td>
                <td><button onclick="removeStudentFromCourse('${course.name}', '${student.id}')">Remove</button></td>
            `;

            tableBody.appendChild(row);
        });
    });
}

function removeStudentFromCourse(courseName, studentId) {
    const course = courses.find((course) => course.name === courseName);
    course.students = course.students.filter((student) => student.id !== studentId);

    const student = students.find((student) => student.id === studentId);
    student.courses = student.courses.filter((c) => c.name !== courseName);

    updateCourseStudentList();
    alert("Student removed from course!");
}

// List Students
document.getElementById("search-student").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(query));
    updateStudentList(filteredStudents);
});

function updateStudentList(filteredStudents = students) {
    const tableBody = document.getElementById("student-list").querySelector("tbody");
    tableBody.innerHTML = "";

    filteredStudents.forEach((student) => {
        const enrolledCourses = student.courses.map((course) => course.name).join(", ");
        const gpa = calculateGPA(student.courses);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.id}</td>
            <td>${enrolledCourses || "None"}</td>
            <td>${gpa.toFixed(2)}</td>
            <td><button onclick="removeStudent('${student.id}')">Remove</button></td>
        `;

        tableBody.appendChild(row);
    });
}

function calculateGPA(courses) {
    if (!courses.length) return 0;

    let totalPoints = 0;

    courses.forEach(({ midterm, final }) => {
        const total = midterm * 0.4 + final * 0.6;
        totalPoints += total >= 90 ? 4 : total >= 80 ? 3 : total >= 70 ? 2 : total >= 60 ? 1 : 0;
    });

    return totalPoints / courses.length;
}

function removeStudent(studentId) {
    students = students.filter((student) => student.id !== studentId);
    courses.forEach((course) => {
        course.students = course.students.filter((student) => student.id !== studentId);
    });

    updateCourseStudentList();
    updateStudentList();
    alert("Student removed successfully!");
}

function updateDropdowns() {
    const courseDropdown = document.getElementById("select-course");
    const studentDropdown = document.getElementById("select-student");

    courseDropdown.innerHTML = courses.map((course) => `<option value="${course.name}">${course.name}</option>`).join("");
    studentDropdown.innerHTML = students.map((student) => `<option value="${student.id}">${student.name}</option>`).join("");
}

updateDropdowns();