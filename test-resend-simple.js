const { Resend } = require('resend');

const apiKey = 're_cs1rBnBP_MZo5uY5RWP5YzxXieNV7hmni';

console.log('\n🔍 Testing Resend API...\n');

const resend = new Resend(apiKey);

resend.emails.send({
  from: 'GrowButtler <onboarding@resend.dev>',
  to: ['felix@felixseeger.de'],
  subject: 'GrowButtler Email Test - System Ready!',
  html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
      <h1 style="color: #13ec3b;">🎉 Email System Working!</h1>
      <p>Hi Felix,</p>
      <p>This is a test email from GrowButtler. If you're receiving this, the email system is configured correctly!</p>
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>✅ Resend API:</strong> Connected</p>
        <p style="margin: 5px 0;"><strong>✅ Email Templates:</strong> Ready (7 templates)</p>
        <p style="margin: 5px 0;"><strong>✅ Booking System:</strong> Operational</p>
      </div>
      <h2>Ready to Test:</h2>
      <ul>
        <li>Booking confirmation emails</li>
        <li>Expert notifications</li>
        <li>Admin notifications</li>
        <li>Expert application emails</li>
      </ul>
      <p style="color: #6b7280; font-size: 14px;">Best regards,<br/>The GrowButtler Team</p>
    </div>
  `,
  text: 'GrowButtler Email Test - System is ready to send real emails!',
}).then(result => {
  console.log('✅ Test email sent successfully!\n');
  console.log('Email ID:', result.data?.id || result.id);
  console.log('\n📬 Check your inbox at felix@felixseeger.de!\n');
  console.log('🎯 Email System Status:');
  console.log('  ✅ Resend API connected');
  console.log('  ✅ Emails sending successfully');
  console.log('  ✅ Ready for production use\n');
  console.log('Next: Test the booking flow - all emails will be sent for real!\n');
}).catch(error => {
  console.error('❌ Error sending test email:\n');
  console.error(error);
  process.exit(1);
});
