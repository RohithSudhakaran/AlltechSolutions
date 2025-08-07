# 📧 EMAIL SETUP FIX GUIDE

## 🚨 Current Issue
**Gmail Authentication Failed:** "Username and Password not accepted"

## ✅ Solution Steps

### 1. Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click **Security** in the left sidebar
3. Find **2-Step Verification** and **Enable** it
4. Complete the phone verification process

### 2. Generate App Password
1. Still in **Security** settings
2. Scroll down to find **App passwords**
3. Click **App passwords**
4. Select **Mail** from the dropdown
5. Click **Generate**
6. Copy the **16-character password** (format: `abcd efgh ijkl mnop`)

### 3. Update .env.local File
Replace the current password with your App Password:
```bash
EMAIL_USER=alltechdummy@gmail.com
EMAIL_PASS=your-16-character-app-password  # ← Replace this
COMPANY_EMAIL=alltechdummy@gmail.com
```

### 4. Test Email Function
After updating, test with:
```bash
curl "http://localhost:3000/api/contact?test=true"
```

## 🔒 Security Notes
- **Never use regular Gmail password** for SMTP
- **App Passwords are more secure** and required by Gmail
- **Keep App Password private** - it's like a password
- **.env.local is ignored by Git** - your credentials stay safe

## 🧪 Testing
Once fixed, you should see:
```json
{
  "status": "success",
  "message": "Email configuration is working correctly!"
}
```

## 📞 Alternative: Test via Contact Form
1. Go to http://localhost:3000
2. Fill out the contact form
3. Submit and check for success message
4. Check your Gmail inbox for the notification

## 🔧 Enhanced Features Added
- ✅ Email connection testing
- ✅ Detailed error logging  
- ✅ Better error messages
- ✅ Connection verification
- ✅ Rate limiting protection
- ✅ Test endpoint: `/api/contact?test=true`

## 🚀 After Fixing
Your contact form will:
- Send notification emails to your Gmail
- Send auto-reply to customers
- Show detailed success/error messages
- Log all activity in the console
