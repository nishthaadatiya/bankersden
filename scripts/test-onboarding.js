const phone = '919999988888';
const testName = 'Test User Name';

async function testFlow() {
  console.log('1. Sending OTP to new number:', phone);
  const sendRes = await fetch('http://localhost:3000/api/auth/whatsapp/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  const sendData = await sendRes.json();
  console.log('Send OTP result:', sendData);

  const otp = sendData.debugOtp;
  if (!otp) {
    console.error('No OTP received');
    return;
  }

  console.log('\n2. Verifying OTP:', otp);
  const verifyRes = await fetch('http://localhost:3000/api/auth/whatsapp/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  });
  const verifyData = await verifyRes.json();
  console.log('Verify OTP result:', verifyData);
  console.log('Is new user?', verifyData.isNewUser);

  if (verifyData.isNewUser) {
    console.log('\n3. Submitting Onboarding with name:', testName);
    const onboardRes = await fetch('http://localhost:3000/api/auth/whatsapp/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, name: testName }),
    });
    const onboardData = await onboardRes.json();
    console.log('Onboarding result:', onboardData);
  }

  console.log('\n4. Verifying repeat login for existing user...');
  const sendRes2 = await fetch('http://localhost:3000/api/auth/whatsapp/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  const sendData2 = await sendRes2.json();
  const verifyRes2 = await fetch('http://localhost:3000/api/auth/whatsapp/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp: sendData2.debugOtp }),
  });
  const verifyData2 = await verifyRes2.json();
  console.log('Second login verify result:');
  console.log('Is new user on second login?:', verifyData2.isNewUser);
  console.log('User name in DB:', verifyData2.user?.name);
  console.log('Is onboarded in DB:', verifyData2.user?.isOnboarded);
}

testFlow().catch(console.error);
