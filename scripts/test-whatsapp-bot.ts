import { handleUserMessage } from '../src/lib/whatsappBot';

console.log('--- Testing Salaried Flow ---');

let step = 'INIT';
let data: any = {};

// Step 1: Greeting
let res = handleUserMessage('Hi', step, data, 'John Doe', '919876543210');
console.log('User: Hi');
console.log('Bot:', res.replyText);
step = res.step;
data = res.enquiryData;

// Step 1 response: Salaried
res = handleUserMessage('1', step, data, 'John Doe', '919876543210');
console.log('\nUser: 1');
console.log('Bot:', res.replyText);
step = res.step;
data = res.enquiryData;

// Step 2A.1: Salary
res = handleUserMessage('75k', step, data, 'John Doe', '919876543210');
console.log('\nUser: 75k');
console.log('Bot:', res.replyText);
step = res.step;
data = res.enquiryData;

// Step 2A.2: Deductions
res = handleUserMessage('5000', step, data, 'John Doe', '919876543210');
console.log('\nUser: 5000');
console.log('Bot:', res.replyText);
step = res.step;
data = res.enquiryData;

// Step 2A.3: EMIs
res = handleUserMessage('No', step, data, 'John Doe', '919876543210');
console.log('\nUser: No');
console.log('Bot:', res.replyText);
step = res.step;
data = res.enquiryData;

// Step 2A.4: Required Loan Amount
res = handleUserMessage('25 Lakhs', step, data, 'John Doe', '919876543210');
console.log('\nUser: 25 Lakhs');
console.log('Bot:', res.replyText);
console.log('Is Complete:', res.isComplete);
console.log('Data:', JSON.stringify(res.enquiryData, null, 2));
console.log('Lead Payload:', JSON.stringify(res.leadPayload, null, 2));

console.log('\n--- Testing Business Flow ---');
step = 'INIT';
data = {};

res = handleUserMessage('2', step, data, 'Aarav Business', '919123456789');
console.log('User: 2');
console.log('Bot:', res.replyText);
step = res.step;
data = res.enquiryData;

res = handleUserMessage('2.5 Lakhs', step, data, 'Aarav Business', '919123456789');
console.log('\nUser: 2.5 Lakhs');
console.log('Bot:', res.replyText);
step = res.step;
data = res.enquiryData;

res = handleUserMessage('Yes, 25000', step, data, 'Aarav Business', '919123456789');
console.log('\nUser: Yes, 25000');
console.log('Bot:', res.replyText);
step = res.step;
data = res.enquiryData;

res = handleUserMessage('50k', step, data, 'Aarav Business', '919123456789');
console.log('\nUser: 50k');
console.log('Bot:', res.replyText);
step = res.step;
data = res.enquiryData;

res = handleUserMessage('50 Lakhs', step, data, 'Aarav Business', '919123456789');
console.log('\nUser: 50 Lakhs');
console.log('Bot:', res.replyText);
console.log('Is Complete:', res.isComplete);
console.log('Lead Payload:', JSON.stringify(res.leadPayload, null, 2));

console.log('\n--- Testing Human Handover ---');
res = handleUserMessage('I want to talk to an agent', step, data, 'Aarav', '919123456789');
console.log('User: I want to talk to an agent');
console.log('Bot:', res.replyText);
