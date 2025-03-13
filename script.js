/**
 * GPA Calculator - JavaScript Functionality
 * This script provides the interactive functionality for the GPA Calculator,
 * including adding courses, calculating GPA, and managing user interactions.
 */

// Store all courses in this array
let courses = [];

// DOM Elements
const courseForm = document.getElementById('course-form');
const courseNameInput = document.getElementById('course-name');
const gradeSelect = document.getElementById('grade-select');
const creditHoursInput = document.getElementById('credit-hours');
const addCourseBtn = document.getElementById('add-course-btn');
const courseList = document.getElementById('course-list');
const gpaOutput = document.getElementById('gpa-output');

// Initialize the application
document.addEventListener('DOMContentLoaded', initApp);

/**
 * Initialize the application by setting up event listeners
 */
function initApp() {
    // Add course button click event
    addCourseBtn.addEventListener('click', handleAddCourse);
    
    // Enter key press event on form
    courseForm.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddCourse();
        }
    });
    
    // Initial GPA display setup
    updateGpaDisplay();
}

/**
 * Handle the process of adding a new course
 */
function handleAddCourse() {
    // Validate inputs
    if (!validateInputs()) {
        return;
    }
    
    // Get input values
    const courseName = courseNameInput.value.trim() || 'N/A';
    const gradeValue = parseFloat(gradeSelect.value);
    const gradeText = gradeSelect.options[gradeSelect.selectedIndex].text.split(' ')[0]; // Gets the letter grade (A, B+, etc.)
    const creditHours = parseFloat(creditHoursInput.value);
    
    // Create new course object
    const newCourse = {
        id: Date.now(), // Unique ID using timestamp
        name: courseName,
        grade: gradeValue,
        gradeText: gradeText,
        credits: creditHours
    };
    
    // Add to courses array
    courses.push(newCourse);
    
    // Update UI
    renderCourseList();
    updateGpaDisplay();
    clearInputs();
    
    // Scroll to the newly added course
    scrollToBottom();
    
    // Add a subtle flash animation to the GPA display
    animateGpaUpdate();
}

/**
 * Validate user inputs before adding a course
 * @returns {boolean} - Whether inputs are valid
 */
function validateInputs() {
    // Check if grade is selected
    if (!gradeSelect.value) {
        alert('Please select a grade.');
        gradeSelect.focus();
        return false;
    }
    
    // Check if credit hours is a positive number
    const credits = parseFloat(creditHoursInput.value);
    if (isNaN(credits) || credits <= 0) {
        alert('Please enter a positive number for credit hours.');
        creditHoursInput.focus();
        return false;
    }
    
    return true;
}

/**
 * Clear input fields after adding a course
 */
function clearInputs() {
    courseNameInput.value = '';
    gradeSelect.selectedIndex = 0;
    creditHoursInput.value = '';
    courseNameInput.focus();
}

/**
 * Render the course list table
 */
function renderCourseList() {
    // Clear the current table content
    courseList.innerHTML = '';
    
    // Show empty message if no courses
    if (courses.length === 0) {
        courseList.innerHTML = `
            <tr class="empty-message">
                <td colspan="4">No courses added yet. Use the form above to add courses.</td>
            </tr>
        `;
        return;
    }
    
    // Add each course to the table
    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.name}</td>
            <td>${course.gradeText}</td>
            <td>${course.credits}</td>
            <td>
                <button class="delete-btn" data-id="${course.id}">
                    Delete
                </button>
            </td>
        `;
        courseList.appendChild(row);
        
        // Add animation class for fade-in effect
        setTimeout(() => {
            row.classList.add('visible');
        }, 10);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            deleteCourse(this.getAttribute('data-id'));
        });
    });
}

/**
 * Delete a course from the list
 * @param {string} id - The ID of the course to delete
 */
function deleteCourse(id) {
    // Find index of course with matching ID
    const courseIndex = courses.findIndex(course => course.id == id);
    
    if (courseIndex !== -1) {
        // Remove the course from the array
        courses.splice(courseIndex, 1);
        
        // Update UI
        renderCourseList();
        updateGpaDisplay();
        
        // Animate GPA update
        animateGpaUpdate();
    }
}

/**
 * Calculate the current GPA based on courses
 * @returns {number} - The calculated GPA
 */
function calculateGpa() {
    if (courses.length === 0) {
        return 0.0;
    }
    
    let totalQualityPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(course => {
        totalQualityPoints += course.grade * course.credits;
        totalCredits += course.credits;
    });
    
    return totalCredits > 0 ? (totalQualityPoints / totalCredits).toFixed(2) : 0.0;
}

/**
 * Update the GPA display in the UI
 */
function updateGpaDisplay() {
    const gpa = calculateGpa();
    
    if (courses.length === 0) {
        gpaOutput.innerHTML = `<p>Add courses to calculate your GPA</p>`;
        gpaOutput.classList.remove('calculated');
    } else {
        gpaOutput.innerHTML = `
            <p>Your current GPA is: <strong>${gpa}</strong></p>
            <p class="total-credits">Total Credits: ${getTotalCredits()}</p>
        `;
        gpaOutput.classList.add('calculated');
    }
}

/**
 * Get the total credits from all courses
 * @returns {number} - Sum of all credits
 */
function getTotalCredits() {
    return courses.reduce((sum, course) => sum + course.credits, 0);
}

/**
 * Add a subtle animation to the GPA display when updated
 */
function animateGpaUpdate() {
    gpaOutput.classList.add('updating');
    setTimeout(() => {
        gpaOutput.classList.remove('updating');
    }, 300);
}

/**
 * Scroll to the bottom of the course list or GPA display
 */
function scrollToBottom() {
    if (courses.length > 4) {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }
}
