// src/lib/validation.ts
export const validateEmail = (email: string): boolean => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  };
  
  export const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };
  
  export const validateName = (name: string): boolean => {
    return name.length >= 2;
  };
  
  export const getPasswordStrength = (password: string): {
    score: number;
    feedback: string;
  } => {
    let score = 0;
    const feedback = [];
  
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("Password should be at least 8 characters long");
    }
  
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Include at least one uppercase letter");
    }
  
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Include at least one lowercase letter");
    }
  
    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Include at least one number");
    }
  
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Include at least one special character");
    }
  
    return {
      score,
      feedback: feedback.join(", "),
    };
  };