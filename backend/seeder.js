const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Doubt = require("./models/Doubt");

dotenv.config();

/* --------------------------------
DEPARTMENTS + SUBJECTS + FACULTY
-------------------------------- */

const departments = {

CSE:{
subjects:[
"Programming for Problem Solving","Data Structures","Algorithms","Operating Systems",
"Computer Networks","Database Management Systems","Software Engineering",
"Artificial Intelligence","Machine Learning","Compiler Design"
],
faculty:[
"Dr. Sreelatha Malempati","Dr. Chaparala Aparna","Dr. Bhagya Lakshmi Nandipati",
"Dr. M V Ramana","Mandadi Vasavi","Dr. P Venkateswara Rao",
"Dr. K Sandeep","Dr. Koteswara Rao"
]
},

IT:{
subjects:[
"Cloud Computing","Cyber Security","Web Technologies","Mobile Application Development",
"Database Systems","Operating Systems","Computer Networks",
"Big Data Analytics","Distributed Systems","Software Engineering"
],
faculty:[
"Dr. Atuluri Sri Krishna","Naga Padmaja","Kotha Chandana","G Swetha",
"M V Bhujanga Rao","Dr. Hemantha Kumar","Dr. Murali Krishna","Dr. Lakshmi Narayana"
]
},

CSM:{
subjects:[
"Machine Learning","Deep Learning","Neural Networks","Data Mining",
"Natural Language Processing","Computer Vision","Reinforcement Learning",
"Pattern Recognition","Statistical Learning","Big Data Analytics"
],
faculty:[
"Dr. Gatram Rama Mohan Babu","Dr. N Venkateswara Rao","Dr. Seli Mohapatra",
"Dr. Sudheer Kumar","Dr. Krishna Mohan","Dr. Prasanna Anjaneyulu",
"Dr. Gouthami Priya","Dr. Vijayalakshmi"
]
},

CSD:{
subjects:[
"Data Science Fundamentals","Data Visualization","Statistical Modelling",
"Machine Learning","Big Data","Data Engineering","Python for Data Science",
"Deep Learning","Predictive Analytics","Data Warehousing"
],
faculty:[
"Dr. Popuri Srinivasa Rao","Dr. Riaz Shaik","Dr. R V Kishore Kumar",
"Dr. V Srinivas Rao","B Manasa","Dr. K Sandeep","Dr. Chandra Sekhar","Dr. Subba Rao"
]
},

ECE:{
subjects:[
"Signals and Systems","Analog Communication","Digital Communication",
"Digital Signal Processing","VLSI Design","Microprocessors",
"Embedded Systems","Antenna Theory","Wireless Communication","Electronic Devices"
],
faculty:[
"Dr. T Ranga Babu","Dr. P Suresh Kumar","Dr. D Eswara Chaitanya",
"Dr. S Ramesh Babu","Dr. M V Siva Prasad","Dr. P Siva Prasad",
"Dr. Padmavathi","Dr. Subba Rao"
]
},

EEE:{
subjects:[
"Electrical Machines","Power Systems","Power Electronics","Control Systems",
"Renewable Energy Systems","Smart Grid","Network Analysis","Electrical Drives",
"Instrumentation","High Voltage Engineering"
],
faculty:[
"Dr. K Venkata Rao","Dr. B Suresh","Dr. N Raghavendra",
"Dr. P Srinivasa Rao","K Jyothi","Dr. M Prasad",
"Dr. Satyanarayana","Dr. Krishna Veni"
]
},

MECH:{
subjects:[
"Engineering Mechanics","Thermodynamics","Fluid Mechanics","Heat Transfer",
"Machine Design","Manufacturing Technology","Robotics","CAD CAM",
"Industrial Engineering","Strength of Materials"
],
faculty:[
"Dr. B Sreenivasulu","Dr. M Rama Rao","Dr. K Srinivasa Rao",
"Dr. P Subba Rao","P Ravi Kumar","Dr. K Ravindra",
"Dr. Murali Krishna","Dr. Satyanarayana"
]
},

CIVIL:{
subjects:[
"Structural Analysis","Geotechnical Engineering","Environmental Engineering",
"Surveying","Transportation Engineering","Water Resources Engineering",
"Concrete Technology","Construction Planning","Building Materials","Engineering Mechanics"
],
faculty:[
"Dr. K Rama Mohan Rao","M Srikanth Kumar","S V Satyanarayana",
"Y Madhavi","Dr. P Siva Kumar","Dr. B Krishna",
"Dr. Anjali Devi","Dr. Chalapathi Rao"
]
},

CHE:{
subjects:[
"Chemical Process Calculations","Fluid Flow Operations","Heat Transfer",
"Mass Transfer","Chemical Reaction Engineering","Process Control",
"Plant Design","Polymer Technology","Petroleum Refining","Biochemical Engineering"
],
faculty:[
"Dr. K Venkata Subba Rao","Dr. P Ramesh Babu","Dr. M Ravi Kumar",
"Dr. T Siva Kumar","B Lakshmi","Dr. V Raghuram",
"Dr. Murali Krishna","Dr. Padmavathi"
]
},

AIML:{
subjects:[
"Machine Learning","Deep Learning","Computer Vision",
"Natural Language Processing","Reinforcement Learning","AI Ethics",
"Pattern Recognition","Big Data Analytics","Statistical Learning","Data Mining"
],
faculty:[
"Dr. Gatram Rama Mohan Babu","Dr. N Venkateswara Rao",
"Dr. Seli Mohapatra","Dr. Sudheer Kumar",
"Dr. Krishna Mohan","Dr. Prasanna Anjaneyulu",
"Dr. Vijayalakshmi","Dr. Srinivas Rao"
]
}

};

/* --------------------------------
STUDENT NAMES
-------------------------------- */

const studentNames=[
"Sai Kiran","Ravi Teja","Praneeth Kumar","Naveen Reddy",
"Sai Charan","Akash Kumar","Vamsi Krishna","Chaitanya",
"Srikanth","Sandeep Kumar","Manoj Kumar","Prudhvi",
"Mahesh Babu","Sai Ram","Dinesh Kumar","Varun Teja"
];

/* --------------------------------
DOUBT QUESTIONS
-------------------------------- */

const doubts=[
"Explain with example",
"Why is this concept important?",
"Explain step by step",
"What are real world applications?",
"Difference between two approaches?"
];

/* --------------------------------
FACULTY SEEDER
-------------------------------- */

const seedFaculty = async()=>{

const facultyList=[];

for(const dept in departments){

let index=0;

for(const name of departments[dept].faculty){

const email=name
.toLowerCase()
.replace(/dr. /g,"")
.replace(/ /g,".")
+`.`+dept.toLowerCase()+`@rvrjc.ac.in`;

const faculty=await User.create({

name,
email,
password:"faculty123",
role:"faculty",
department:dept,
courses:departments[dept].subjects.slice(0,3),
approved:true,
facultyId:`FAC${dept}${100+index}`

});

facultyList.push(faculty);

index++;

}

}

return facultyList;

};

/* --------------------------------
STUDENT SEEDER
-------------------------------- */

const seedStudents = async()=>{

const students=[];
const deptKeys=Object.keys(departments);

for(let i=0;i<160;i++){

const dept=deptKeys[i%deptKeys.length];

const student=await User.create({

name:studentNames[i%studentNames.length]+" "+(i+1),
email:`student${i+1}@rvrjc.ac.in`,
password:"student123",
role:"student",
department:dept,
semester:Math.ceil(Math.random()*8),
approved:true

});

students.push(student);

}

return students;

};

/* --------------------------------
DOUBT SEEDER
-------------------------------- */

const seedDoubts = async(students,faculty)=>{

for(let i=0;i<250;i++){

const student=students[Math.floor(Math.random()*students.length)];

const deptFaculty=faculty.filter(
f=>f.department===student.department
);

const assignedTo=
deptFaculty[Math.floor(Math.random()*deptFaculty.length)];

const subject=
departments[student.department].subjects[
Math.floor(Math.random()*10)
];

const status=Math.random()>0.3?"answered":"pending";

await Doubt.create({

title:doubts[Math.floor(Math.random()*doubts.length)],

description:"Need detailed explanation with examples.",

department:student.department,

subject,

postedBy:student._id,

assignedTo:assignedTo._id,

status,

answer:
status==="answered"
?`This topic is part of ${subject}.`
:null,

answeredBy:status==="answered"?assignedTo._id:null,

tags:[student.department,subject],

upvoteCount:Math.floor(Math.random()*50),

createdAt:new Date(Date.now()-Math.random()*45*24*60*60*1000)

});

}

};

/* --------------------------------
RUN SEEDER
-------------------------------- */

const runSeeder = async()=>{

try{

await connectDB();

await User.deleteMany();
await Doubt.deleteMany();

console.log("Old data cleared");

const faculty=await seedFaculty();
console.log("Faculty seeded");

const students=await seedStudents();
console.log("Students seeded");

await seedDoubts(students,faculty);
console.log("Doubts seeded");

console.log("Seeder completed successfully");

process.exit();

}catch(err){

console.error(err);
process.exit(1);

}

};

runSeeder();