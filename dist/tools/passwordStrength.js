"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordStrength = passwordStrength;
async function passwordStrength(password) {
    let score = 0;
    const checks = [];
    // Length check
    if (password.length >= 8)
        score++;
    if (password.length >= 12)
        score++;
    // Complexity checks
    if (/[A-Z]/.test(password)) {
        score++;
        checks.push("Contains uppercase");
    }
    else {
        checks.push("Missing uppercase");
    }
    if (/[a-z]/.test(password)) {
        score++;
        checks.push("Contains lowercase");
    }
    else {
        checks.push("Missing lowercase");
    }
    if (/[0-9]/.test(password)) {
        score++;
        checks.push("Contains numbers");
    }
    else {
        checks.push("Missing numbers");
    }
    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
        checks.push("Contains special characters");
    }
    else {
        checks.push("Missing special characters");
    }
    let strength = "Weak";
    if (score >= 5)
        strength = "Strong";
    else if (score >= 3)
        strength = "Medium";
    return {
        content: [
            {
                type: "text",
                text: `Password Strength: ${strength} (Score: ${score}/6)\n\nDetails:\n- Length: ${password.length}\n- ${checks.join("\n- ")}`,
            },
        ],
    };
}
