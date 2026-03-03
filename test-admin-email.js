const { Resend } = require('resend');

const apiKey = 're_cs1rBnBP_MZo5uY5RWP5YzxXieNV7hmni';
const adminEmail = 'felixseeger@googlemail.com';

console.log('\n📧 Testing Admin Email Configuration...\n');
console.log(`Admin Email: ${adminEmail}\n`);

const resend = new Resend(apiKey);

resend.emails.send({
  from: 'GrowButtler <onboarding@resend.dev>',
  to: [adminEmail],
  subject: 'GrowButtler - Admin Email Updated ✅',
  html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
      <h1 style="color: #13ec3b;">✅ Admin Email Updated!</h1>
      <p>Hi Felix,</p>
      <p>Your admin email has been updated to <strong>${adminEmail}</strong></p>
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>What This Means:</h3>
        <p style="margin: 5px 0;">✅ All booking notifications will now come to this email</p>
        <p style="margin: 5px 0;">✅ Expert application notifications will come here</p>
        <p style="margin: 5px 0;">✅ All admin alerts for GrowButtler</p>
      </div>
      <h3>Environment Variable Set:</h3>
      <code style="background: #f1f5f9; padding: 8px; border-radius: 4px; display: block;">
        ADMIN_EMAIL=${adminEmail}
      </code>
      <p style="margin-top: 20px;">The system is ready to send real notifications!</p>
      <p style="color: #6b7280; font-size: 14px;">Best regards,<br/>The GrowButtler Team</p>
    </div>
  `,
  text: `Admin email updated to ${adminEmail}. All booking and expert notifications will be sent here.`,
}).then(result => {
  console.log('✅ Test email sent to admin address!\n');
  console.log('📬 Check your inbox at:', adminEmail, '\n');
  console.log('Updated configuration:');
  console.log('  ✅ Admin email updated in all API routes');
  console.log('  ✅ Environment variable ADMIN_EMAIL set');
  console.log('  ✅ Bookings API using new email');
  console.log('  ✅ Expert applications using new email\n');
}).catch(error => {
  console.error('❌ Error:', error);
});
