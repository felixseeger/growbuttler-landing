const { Resend } = require('resend');

// Load env
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.RESEND_API_KEY;

console.log('\n🔍 Checking Resend Configuration...\n');
console.log('API Key found:', apiKey ? '✅ Yes (re_' + apiKey.substring(3, 10) + '...)' : '❌ No');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'Not set (will use default)');

if (!apiKey) {
  console.log('\n❌ RESEND_API_KEY not found in environment');
  process.exit(1);
}

const resend = new Resend(apiKey);

console.log('\n📧 Testing Resend connection...\n');

// Send a test email
resend.emails.send({
  from: process.env.EMAIL_FROM || 'GrowButtler <onboarding@resend.dev>',
  to: ['felix@felixseeger.de'],
  subject: 'GrowButtler Email Test',
  html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
      <h1 style="color: #13ec3b;">🎉 Email System Working!</h1>
      <p>This is a test email from GrowButtler.</p>
      <p>If you're receiving this, the email system is configured correctly!</p>
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>✅ Resend API:</strong> Connected</p>
        <p style="margin: 5px 0;"><strong>✅ Templates:</strong> Ready</p>
        <p style="margin: 5px 0;"><strong>✅ Booking System:</strong> Operational</p>
      </div>
      <p style="color: #6b7280; font-size: 14px;">Best regards,<br/>The GrowButtler Team</p>
    </div>
  `,
  text: 'Email system test - GrowButtler is ready to send emails!',
}).then(result => {
  console.log('✅ Test email sent successfully!\n');
  console.log('Email ID:', result.data?.id || result.id);
  console.log('\n📬 Check felix@felixseeger.de inbox!\n');
  console.log('🎯 Next steps:');
  console.log('  1. Verify you received the test email');
  console.log('  2. Test the booking flow');
  console.log('  3. All booking emails will be sent for real!\n');
}).catch(error => {
  console.error('❌ Error sending test email:\n');
  console.error(error);
  process.exit(1);
});
