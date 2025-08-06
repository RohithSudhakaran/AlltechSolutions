import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to your preferred email service
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com', // Your email
      pass: process.env.EMAIL_PASS || 'your-app-password'     // Your app password
    }
  })
}

// Alternative: Using SMTP configuration
const createSMTPTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    // Basic validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Log the form submission
    console.log('New contact form submission:', {
      name,
      email,
      phone,
      message,
      timestamp: new Date().toISOString()
    })

    try {
      // Create transporter
      const transporter = createTransporter()

      // Email to company (notification)
      const companyEmailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: process.env.COMPANY_EMAIL || 'info@alltechsolutions.com', // Company email
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="margin: 0; font-size: 24px;">New Contact Form Submission</h2>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Alltech Solutions Website</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-top: 0;">Contact Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555; width: 100px;">Name:</td>
                  <td style="padding: 8px 0; color: #333;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                  <td style="padding: 8px 0; color: #333;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                  <td style="padding: 8px 0; color: #333;"><a href="tel:${phone}" style="color: #3b82f6; text-decoration: none;">${phone}</a></td>
                </tr>
              </table>
            </div>
            
            <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h3 style="color: #333; margin-top: 0;">Message:</h3>
              <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #eff6ff; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #1d4ed8; font-size: 14px;">
                📧 Received: ${new Date().toLocaleString()}<br>
                🌐 From: Alltech Solutions Website Contact Form
              </p>
            </div>
          </div>
        `,
        text: `
New Contact Form Submission from Alltech Solutions Website

Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}

Received: ${new Date().toLocaleString()}
        `
      }

      // Auto-reply email to customer
      const customerEmailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: 'Thank you for contacting Alltech Solutions!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
              <h2 style="margin: 0; font-size: 28px;">Alltech Solutions</h2>
              <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 16px;">Fabrication Experts – Coimbatore</p>
            </div>
            
            <div style="padding: 20px 0;">
              <h3 style="color: #333; margin-bottom: 15px;">Dear ${name},</h3>
              
              <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                Thank you for reaching out to <strong>Alltech Solutions</strong>! We have received your message and appreciate your interest in our fabrication services.
              </p>
              
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                <h4 style="color: #1d4ed8; margin-top: 0;">Your Message Summary:</h4>
                <p style="color: #555; margin: 10px 0;"><strong>Name:</strong> ${name}</p>
                <p style="color: #555; margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                <p style="color: #555; margin: 10px 0;"><strong>Phone:</strong> ${phone}</p>
                <p style="color: #555; margin: 10px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <p style="color: #555; line-height: 1.6; margin: 20px 0;">
                Our team will review your inquiry and get back to you within <strong>24 hours</strong>. We look forward to discussing your project requirements.
              </p>
              
              <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #059669; margin-top: 0;">🏗️ Why Choose Alltech Solutions?</h4>
                <ul style="color: #555; line-height: 1.6; margin: 10px 0; padding-left: 20px;">
                  <li>15+ years of experience in fabrication</li>
                  <li>500+ successfully completed projects</li>
                  <li>99% precision engineering standards</li>
                  <li>30% faster delivery than industry average</li>
                  <li>100% quality assurance guarantee</li>
                </ul>
              </div>
              
              <p style="color: #555; line-height: 1.6;">
                We look forward to discussing your project requirements and providing you with the best fabrication solutions.
              </p>
              
              <p style="color: #555; line-height: 1.6;">
                Best regards,<br>
                <strong>A. Sudhakaran</strong><br>
                Alltech Solutions<br>
                📍 Sundarapuram, Coimbatore 641024
              </p>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0;">This is an automated response. Please do not reply to this email.</p>
              <p style="margin: 5px 0 0 0;">© 2025 Alltech Solutions. All rights reserved.</p>
            </div>
          </div>
        `,
        text: `
Dear ${name},

Thank you for reaching out to Alltech Solutions! We have received your message and appreciate your interest in our fabrication services.

Your Message Summary:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}
- Submitted: ${new Date().toLocaleString()}

Our team will review your inquiry and get back to you within 24 hours. We look forward to discussing your project requirements.

Why Choose Alltech Solutions?
• 15+ years of experience in fabrication
• 500+ successfully completed projects
• 99% precision engineering standards
• 30% faster delivery than industry average
• 100% quality assurance guarantee

We look forward to discussing your project requirements and providing you with the best fabrication solutions.

Best regards,
A. Sudhakaran
Alltech Solutions
Location: Sundarapuram, Coimbatore 641024

---
This is an automated response. Please do not reply to this email.
© 2025 Alltech Solutions. All rights reserved.
        `
      }

      // Send emails
      await transporter.sendMail(companyEmailOptions)
      await transporter.sendMail(customerEmailOptions)

      console.log('Emails sent successfully')

    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the request if email fails, just log it
      // You might want to save to database as fallback
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: Handle GET requests to this endpoint
export async function GET() {
  return NextResponse.json(
    { message: 'Contact form endpoint is working!' },
    { status: 200 }
  )
}
