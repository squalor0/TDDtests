// Helper function to run tests for a specific field
function runFieldTests(fieldName, tests) {
    // Set up static values for other fields to avoid invalid state
    function setStaticValues(excludedField = null) {
        const fields = {
            "firstName": "John",
            "surname": "Doe",
            "email": "example@domain.com",
            "age": "31",
            "dobDay": "15",
            "dobMonth": "6",
            "dobYear": "1993",
            "country": "United Kingdom",
            "countryCode": "+44",
            "phoneNumber": "1234567890",
            "terms": true
        };

        // Loops through all fields and assigns values, except the excluded field
        Object.keys(fields).forEach(field => {
            if (field !== excludedField) {
                const element = document.getElementById(field);
                if (element.type === "checkbox") {
                    element.checked = fields[field];
                } else {
                    element.value = fields[field];
                }
            }
        });
    }

    // A helper function to test a single input and log the result
    function testFieldInput(fieldName, input, expectedValid, description) {
        // Set static values for all other fields
        setStaticValues(fieldName);

        // Set the specific input for the field being tested
        const fieldElement = document.getElementById(fieldName);
        if (fieldElement) fieldElement.value = input;

        // Clear any previous errors
        const errorEl = document.getElementById(`${fieldName}Error`);
        if (errorEl) errorEl.textContent = "";

        // Call the existing validation function
        checkField(fieldName);

        // Determine if valid by checking fieldStatus or by absence of error message
        const isValid = fieldStatus[fieldName];

        // Log the result
        const result = (isValid === expectedValid) ? "PASS" : "FAIL";
        console.log(`${description} (${fieldName}): ${result}`);
    }

    // Run all tests for the specified field
    tests.forEach(test => testFieldInput(fieldName, test.input, test.expectedValid, test.description));
}

// Test suite for validating the "First Name" field 
function runFirstNameTests() {
    const firstNameTests = [
        { input: "", expectedValid: false, description: "Empty input" },
        { input: "   ", expectedValid: false, description: "Whitespace only" },
        { input: "John   Paul", expectedValid: false, description: "Multiple consecutive spaces" },
        { input: "John3", expectedValid: false, description: "Contains a digit" },
        { input: "John!", expectedValid: false, description: "Contains a special character" },
        { input: "Jóhn", expectedValid: false, description: "Non-English accented letter" },
        { input: "J  ohn", expectedValid: false, description: "Incorrect spacing pattern" },
        { input: "John", expectedValid: true, description: "Valid simple name" }
    ];
    runFieldTests("firstName", firstNameTests);
}

// Test suite for validating the "Surname" field
function runSurnameTests() {
    const surnameTests = [
        { input: "", expectedValid: false, description: "Empty input" },
        { input: "   ", expectedValid: false, description: "Whitespace only" },
        { input: "Smith", expectedValid: true, description: "Valid simple surname" },
        { input: "Smith3", expectedValid: false, description: "Invalid surname with a number at the end" },
        { input: "Smith 3", expectedValid: true, description: "Valid surname with space and number at the end" },
        { input: "Smith John", expectedValid: true, description: "Valid double-barrel surname with a space" },
        { input: "Smith-John", expectedValid: false, description: "Invalid surname with a hyphen" },
        { input: "Sm!th", expectedValid: false, description: "Contains special character" },
        { input: "123Smith", expectedValid: false, description: "Starts with numbers" }
    ];
    runFieldTests("surname", surnameTests);
}

// Test suite for validating the "Email" field
function runEmailTests() {
    const emailTests = [
        { input: "", expectedValid: false, description: "Empty email" },
        { input: "invalid", expectedValid: false, description: "Invalid email format" },
        { input: "example@domain.com", expectedValid: true, description: "Valid email" }
    ];
    runFieldTests("email", emailTests);
}

// Test suite for validating Date of Birth and Age fields
function runDOBTests() {
    const dobTests = [
        { input: { dobDay: "15", dobMonth: "6", dobYear: "1993", age: "31" }, expectedValid: true, description: "Valid date and age" },
        { input: { dobDay: "", dobMonth: "6", dobYear: "1993", age: "30" }, expectedValid: false, description: "Empty day" },
        { input: { dobDay: "32", dobMonth: "6", dobYear: "1993", age: "30" }, expectedValid: false, description: "Invalid day" },
        { input: { dobDay: "30", dobMonth: "2", dobYear: "2020", age: "4" }, expectedValid: false, description: "Invalid date (Feb 30)" },
        { input: { dobDay: "29", dobMonth: "2", dobYear: "2021", age: "3" }, expectedValid: false, description: "Invalid leap year date" },
        { input: { dobDay: "29", dobMonth: "2", dobYear: "2020", age: "4" }, expectedValid: true, description: "Valid leap year date" },
        { input: { dobDay: "15", dobMonth: "6", dobYear: "1993", age: "30" }, expectedValid: false, description: "Age does not match DOB" }
    ];

    runFieldTestsForDOB(dobTests);
}

// Helper function for testing Date of Birth
function runFieldTestsForDOB(tests) {
    function setDOBInputs(inputs) {
        Object.entries(inputs).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) element.value = value;
        });
    }

    function testDOBInput(inputs, expectedValid, description) {
        setDOBInputs(inputs);

        // Clear errors
        document.querySelectorAll(".error").forEach(el => (el.textContent = ""));

        // Validate DOB and Age
        const isValid = validateDOBandAge();

        // Log results
        const result = isValid === expectedValid ? "PASS" : "FAIL";
        console.log(`${description}: ${result}`);
    }

    tests.forEach(test => testDOBInput(test.input, test.expectedValid, test.description));
}

// Test suite for validating Country and Country Code fields
function runCountryAndCodeTests() {
    const countryAndCodeTests = [
        {
            input: { country: "United Kingdom", countryCode: "+44" },
            expectedValid: true,
            description: "Valid country and code (UK)"
        },
        {
            input: { country: "Germany", countryCode: "+44" },
            expectedValid: false,
            description: "Mismatched country and code"
        },
        {
            input: { country: "Invalid Country", countryCode: "+1" },
            expectedValid: false,
            description: "Non-existent country with valid code"
        },
        {
            input: { country: "United Kingdom", countryCode: "+1" },
            expectedValid: false,
            description: "Valid country with mismatched code"
        },
        {
            input: { country: "", countryCode: "+44" },
            expectedValid: false,
            description: "Empty country with valid code"
        },
        {
            input: { country: "United Kingdom", countryCode: "" },
            expectedValid: false,
            description: "Valid country with empty code"
        },
        {
            input: { country: "", countryCode: "" },
            expectedValid: false,
            description: "Empty country and code"
        }
    ];

    runFieldTestsForCountryAndCode(countryAndCodeTests);
}

// Helper function for testing Country and Country Code
function runFieldTestsForCountryAndCode(tests) {
    function setCountryAndCodeInputs(inputs) {
        const countryInput = document.getElementById("country");
        const countryCodeInput = document.getElementById("countryCode");
    
        if (countryInput) {
            countryInput.value = inputs.country || ""; // Ensure empty string if not provided
        }
        if (countryCodeInput) {
            countryCodeInput.value = inputs.countryCode || ""; // Ensure empty string if not provided
        }
    }   

    tests.forEach(test => {
        setCountryAndCodeInputs(test.input);
        const isValid = validateCountryAndCode() === "";
        console.log(`${test.description}: ${isValid === test.expectedValid ? "PASS" : "FAIL"}`);
    });
    
}

// Test suite for validating Phone Number field
function runPhoneNumberTests() {
    const phoneNumberTests = [
        { input: "", expectedValid: false, description: "Empty input" },
        { input: "123", expectedValid: false, description: "Too short" },
        { input: "0123456789", expectedValid: false, description: "Starts with zero" },
        { input: "123456789012345", expectedValid: true, description: "Valid long number within 15 digits" },
        { input: "1234567890123456", expectedValid: false, description: "Exceeds 15 digits" },
        { input: "abcdefg", expectedValid: false, description: "Contains letters" },
        { input: "123-456-7890", expectedValid: false, description: "Contains special characters (hyphens)" },
        { input: "1234567890", expectedValid: true, description: "Valid 10-digit phone number" }
    ];

    runFieldTests("phoneNumber", phoneNumberTests);
}

// Test suite for "Reveal Secrets" functionality
function runRevealSecretsTests() {
    const revealSecretsTests = [
        {
            input: { secretsChecked: true, file: false }, // Simulates no file uploaded
            expectedValid: false,
            description: "Reveal Secrets checked but no file uploaded"
        },
        {
            input: { secretsChecked: true, file: true }, // Simulates a file uploaded
            expectedValid: true,
            description: "Reveal Secrets checked and file uploaded"
        },
        {
            input: { secretsChecked: false, file: false },
            expectedValid: true,
            description: "Reveal Secrets not checked and no file uploaded"
        },
        {
            input: { secretsChecked: false, file: true },
            expectedValid: true,
            description: "Reveal Secrets not checked but file uploaded (optional)"
        }
    ];

    revealSecretsTests.forEach(function (test) {
        // Set up the test inputs
        const secretsCheckbox = document.getElementById("secrets");
        const fileInput = document.getElementById("file");

        if (secretsCheckbox) {
            secretsCheckbox.checked = test.input.secretsChecked;
            toggleSecrets(); // Update UI visibility
        }

        // Simulate file upload by checking if the file input is required
        if (fileInput) {
            fileInput.required = test.input.secretsChecked; // Set required if secretsChecked
        }

        // Validate the fields
        const isFileRequired = secretsCheckbox.checked;
        const fileValid = isFileRequired ? test.input.file : true;

        // Log the result
        const isValid = fileValid;
        const result = isValid === test.expectedValid ? "PASS" : "FAIL";
        console.log(`${test.description}: ${result}`);
    });
}

// Test suite for validating Terms and Conditions
function runTermsTests() {
    const termsTests = [
        {
            input: { termsChecked: false },
            expectedValid: false,
            description: "Terms not checked"
        },
        {
            input: { termsChecked: true },
            expectedValid: true,
            description: "Terms checked"
        }
    ];

    termsTests.forEach(function (test) {
        // Set up the test input
        const termsCheckbox = document.getElementById("terms");

        if (termsCheckbox) {
            termsCheckbox.checked = test.input.termsChecked;
            validateTerms(); // Call the validation function for terms
        }

        // Validate the terms checkbox
        const isValid = fieldStatus.terms;
        const result = isValid === test.expectedValid ? "PASS" : "FAIL";

        console.log(`${test.description}: ${result}`);
    });
}

// Updated function to handle tests for all fields
function runAllTests() {
    console.log("Starting All Tests...");
    runFirstNameTests();
    runSurnameTests();
    runEmailTests();
    runDOBTests();
    runCountryAndCodeTests();
    runPhoneNumberTests();
    runRevealSecretsTests();
    runTermsTests();
    console.log("All Tests Completed.");
}

// Call test runners after the page and validation code is loaded
window.addEventListener("DOMContentLoaded", () => {
    runAllTests();
});
