import axios from 'axios';
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import User from '../Model/User.js';
 // Ensure correct path to your User model

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "emmergecy@gmail.com", // Ensure correct email
        pass: "igzh kmbl jutc gokk"  // Use an App Password, not a raw password
    }
});

// Function to send an email
const sendEmail = async (email, contest) => {
    if (!email) {
        console.warn(`Skipping email for contest "${contest.contestName}" due to missing email.`);
        return;
    }

    const mailOptions = {
        from: `"Code Minder" <emmergecy@gmail.com>`,
        to: email,
        subject: `Reminder: ${contest.contestName} is happening tomorrow!`,
        text: `Hello,\n\nDon't forget about the upcoming contest!\n\n📅 Contest Name: ${contest.contestName}\n⏰ Starts At: ${new Date(contest.contestStartDate).toLocaleString()}\n🔗 Link: ${contest.contestUrl}\n\nGood Luck!`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${email} for ${contest.contestName}`);
    } catch (error) {
        // console.error(`Failed to send email to ${email}:`, error);
    }
};

// Function to check contests happening tomorrow and send emails to all users
const checkAndSendEmails = async () => {
    try {
        const users = await User.find({}, 'email'); // Fetch all users with only email field
        if (!users || users.length === 0) {
            console.log('No users found to send emails.');
            return;
        }

        const response = await axios.get('https://node.codolio.com/api/contest-calendar/v1/all/get-upcoming-contests');
        const contests = response.data.data;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to midnight

        contests.forEach((contest) => {
            const contestDate = new Date(contest.contestStartDate);
            contestDate.setHours(0, 0, 0, 0); // Normalize contest date to midnight

            if ((contestDate - today) / (1000 * 60 * 60 * 24) === 1) { // Exactly 1 day before
                users
                    .filter(user => user.email) // Remove users with missing email
                    .forEach(user => {
                        sendEmail(user.email, contest)
                            .catch(err => console.error(`Error sending email to ${user.email}:`, err));
                    });
            }
        });

    } catch (error) {
        // console.error('Error fetching contests or sending emails:', error);
    }
};

// Schedule the job to run at 9:00 AM daily
cron.schedule('0 9 * * *', checkAndSendEmails);

console.log('Email scheduler is running...');

export {
    checkAndSendEmails
};
