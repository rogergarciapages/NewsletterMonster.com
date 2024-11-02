// src/app/api/signup/route.ts
import { prisma } from "@/lib/prisma-client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const validateEmail = (email: string) => {
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regex.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 8;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, surname, company_name } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json({ 
        error: "Name, email, and password are required" 
      }, { status: 400 });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json({ 
        error: "Invalid email format" 
      }, { status: 400 });
    }

    // Validate password
    if (!validatePassword(password)) {
      return NextResponse.json({ 
        error: "Password must be at least 8 characters long" 
      }, { status: 400 });
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ 
        error: "An account with this email already exists" 
      }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        surname: surname || null,
        company_name: company_name || null,
        role: "FREE",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Remove sensitive data before sending response
    const { password: _, ...safeUser } = user;

    return NextResponse.json({ 
      message: "Account created successfully",
      user: safeUser 
    }, { status: 201 });

  } catch (error) {
    console.error("Signup error:", error);
    
    // Handle Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json({ 
          error: "An account with this email already exists" 
        }, { status: 400 });
      }
    }

    return NextResponse.json({ 
      error: "An error occurred while creating your account" 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}