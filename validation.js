// Fields to validate
const fields = [
    "firstName", "surname", "email", "age",
    "dobDay", "dobMonth", "dobYear", "country",
    "countryCode", "phoneNumber", "terms"
];

const fieldStatus = {}; // Object to track validation status of each field (true=valid, false=invalid)

// Initialize fieldStatus with false for all fields
function initializeFieldStatus() {
    for (let i = 0; i < fields.length; i++) {
        fieldStatus[fields[i]] = false; // Mark all fields as invalid initially
    }
}

// Event listener for form submission
function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    clearErrors(); // Clear all previous error messages

    // Validate each field
    for (let i = 0; i < fields.length; i++) {
        checkField(fields[i]);
    }

    validateDOBandAge(); // Additional validation for Date of Birth and Age relationship
    validateTerms(); // Ensure terms and conditions checkbox is checked

    // Check if all fields are valid
    let isValid = !Object.values(fieldStatus).includes(false);
    const feedback = document.getElementById("formFeedback");
    feedback.textContent = isValid ? "Form Successfully Sent!" : ""; // Show feedback
}

// Event listener for input events
function handleInputEvent(event) {
    const fieldId = event.target.id; // Get the ID of the input field
    checkField(fieldId); // Validate the specific field

    // Revalidate related fields for Date of Birth and Age if relevant fields are modified
    if (["dobDay", "dobMonth", "dobYear", "age"].includes(fieldId)) {
        validateDOBandAge();
    }

    // Revalidate terms and conditions checkbox if it is changed
    if (fieldId === "terms") {
        validateTerms();
    }
}

// Clear all error messages displayed on the form
function clearErrors() {
    const errors = document.querySelectorAll(".error"); // Select all error message elements
    for (let i = 0; i < errors.length; i++) {
        errors[i].textContent = ""; // Clear the text content of each error message
    }
}

// Display an error message for a specific field
function displayError(id, errorMsg) {
    const errorEl = document.getElementById(id + "Error"); // Find the error message element for the field
    if (errorEl) {
        errorEl.textContent = errorMsg; // Set the error message
    }
}

// Check if all fields are valid
function allFieldsValid() {
    for (const key in fieldStatus) {
        if (fieldStatus.hasOwnProperty(key)) {
            if (fieldStatus[key] === false) {
                return false; // Return false if any field is invalid
            }
        }
    }
    return true; // All fields are valid
}

// Validate the relation of country and country code
function validateCountryAndCode() {
    const country = document.getElementById("country").value.trim().toLowerCase(); // Get country input
    const countryCode = document.getElementById("countryCode").value.trim(); // Get country code input

    if (!country || !countryCode) {
        return "Country and code cannot be empty."; // Error if either is empty
    }

    let match = false; // Flag to check if the country and code match
    for (let i = 0; i < countryData.length; i++) {
        const c = countryData[i];
        if (c.country.toLowerCase() === country && ("+" + c.code) === countryCode) {
            match = true; // Match found
            break;
        }
    }

    if (!match) {
        return "Country and code must match (e.g., United Kingdom and +44)."; // Error if no match
    }
    return ""; // No errors
}

// Validate a single field
function checkField(id) {
    let value = (document.getElementById(id).value || "").trim(); // Get and trim the field value
    let errorMsg = ""; // Initialize error message

    // Define regex patterns for various fields
    const firstNamePattern = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    const surnamePattern = /^[A-Za-z]+(?:\s[A-Za-z]+)*(\s\d+)?$/;
    const emailPattern = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
    const phonePattern = /^[1-9]\d{9,14}$/;
    const countryCodePattern = /^\+\d{1,3}(-\d{1,3})?$/;

    // Validate specific fields based on their ID
    if (id === "firstName") {
        if (!value) {
            errorMsg = "First name is required.";
        } else if (!firstNamePattern.test(value)) {
            errorMsg = "First name must contain only letters and spaces.";
        }
    } else if (id === "surname") {
        if (!value) {
            errorMsg = "Surname is required.";
        } else if (!surnamePattern.test(value)) {
            errorMsg = "Surname can have letters, spaces, and optionally end with a number.";
        }
    } else if (id === "email") {
        if (!value || !emailPattern.test(value)) {
            errorMsg = "Enter a valid email address.";
        }
    } else if (id === "age") {
        let age = parseInt(value, 10);
        if (!age || age < 1 || age > 120) {
            errorMsg = "Age must be between 1 and 120.";
        }
    } else if (id === "country" || id === "countryCode") {
        errorMsg = validateCountryAndCode(); // Validate country and code relationship

        if (id === "countryCode" && (!value || !countryCodePattern.test(value))) {
            errorMsg = "Country code must match the format +12 or +123-456.";
        }
    } else if (id === "phoneNumber") {
        if (!phonePattern.test(value)) {
            errorMsg = "Phone number must be 10 to 15 digits and not start with 0.";
        }
    }

    displayError(id, errorMsg); // Display the error message if any
    fieldStatus[id] = (errorMsg === ""); // Update field status
}

// Validate Date of Birth and Age relationship
function validateDOBandAge() {
    const day = parseInt(document.getElementById("dobDay").value, 10);
    const month = parseInt(document.getElementById("dobMonth").value, 10);
    const year = parseInt(document.getElementById("dobYear").value, 10);
    const age = parseInt(document.getElementById("age").value, 10);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();

    let errorMsg = "";

    // Validate day, month, and year ranges
    const validDay = (day >= 1 && day <= 31);
    const validMonth = (month >= 1 && month <= 12);
    const validYear = (year >= 1900 && year <= currentYear);

    // Check if the date is valid
    const testDate = new Date(year, month - 1, day);
    const isRealDate = testDate.getFullYear() === year &&
                       (testDate.getMonth() + 1) === month &&
                       testDate.getDate() === day;

    const isValidDate = validDay && validMonth && validYear && isRealDate;

    // Calculate the age and check its validity
    const calculatedAge = currentYear - year - ((currentMonth < month || (currentMonth === month && currentDay < day)) ? 1 : 0);
    const validAge = isValidDate && calculatedAge === age;

    // Generate appropriate error message
    if (!validDay) errorMsg = "Invalid day.";
    else if (!validMonth) errorMsg = "Invalid month.";
    else if (!validYear) errorMsg = "Invalid year.";
    else if (!isValidDate) errorMsg = "Invalid date.";
    else if (isValidDate && !validAge) errorMsg = "Age does not match DOB.";

    const dobErrorEl = document.getElementById("dobError");
    if (dobErrorEl) dobErrorEl.textContent = errorMsg;

    // Update field status for DOB and age
    fieldStatus.dobDay = validDay;
    fieldStatus.dobMonth = validMonth;
    fieldStatus.dobYear = validYear;
    fieldStatus.age = validAge;

    return isValidDate && validAge;
}

// Validate the Terms and Conditions checkbox
function validateTerms() {
    const termsChecked = document.getElementById("terms").checked;
    const termsError = document.getElementById("termsError");
    if (!termsChecked) {
        termsError.textContent = "You must agree to the terms and conditions.";
        fieldStatus.terms = false;
    } else {
        termsError.textContent = "";
        fieldStatus.terms = true;
    }
}

// Toggle the visibility of the "Upload Secrets" field
function toggleSecrets() {
    const revealSecrets = document.getElementById('secrets').checked;
    const fileLabel = document.getElementById('fileLabel');
    const fileInput = document.getElementById('file');

    if (revealSecrets) {
        fileLabel.style.display = 'block';
        fileInput.style.display = 'block';
        fileInput.setAttribute('required', 'required');
    } else {
        fileLabel.style.display = 'none';
        fileInput.style.display = 'none';
        fileInput.removeAttribute('required');
        fileInput.value = "";
    }
}

// Initialize fieldStatus and attach event listeners
initializeFieldStatus();

const userForm = document.getElementById("userForm");
if (userForm) {
    userForm.addEventListener("submit", handleSubmit);
}

// Add input event listeners for each field
for (let i = 0; i < fields.length; i++) {
    const input = document.getElementById(fields[i]);
    if (input) {
        input.addEventListener("input", handleInputEvent);
    }
}
