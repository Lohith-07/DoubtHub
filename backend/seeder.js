const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Doubt = require("./models/Doubt");

dotenv.config();

/* --------------------------------
DEPARTMENTS + SUBJECTS + FACULTY
-------------------------------- */

const departments = {

  CSE: {
    subjects: [
      "Programming for Problem Solving", "Data Structures", "Algorithms", "Operating Systems",
      "Computer Networks", "Database Management Systems", "Software Engineering",
      "Artificial Intelligence", "Machine Learning", "Compiler Design"
    ],
    faculty: [
      "Dr. Sreelatha Malempati", "Dr. Chaparala Aparna", "Dr. Bhagya Lakshmi Nandipati",
      "Dr. M V Ramana", "Mandadi Vasavi", "Dr. P Venkateswara Rao",
      "Dr. K Sandeep", "Dr. Koteswara Rao"
    ]
  },

  IT: {
    subjects: [
      "Cloud Computing", "Cyber Security", "Web Technologies", "Mobile Application Development",
      "Database Systems", "Operating Systems", "Computer Networks",
      "Big Data Analytics", "Distributed Systems", "Software Engineering"
    ],
    faculty: [
      "Dr. Atuluri Sri Krishna", "Naga Padmaja", "Kotha Chandana", "G Swetha",
      "M V Bhujanga Rao", "Dr. Hemantha Kumar", "Dr. Murali Krishna", "Dr. Lakshmi Narayana"
    ]
  },

  CSM: {
    subjects: [
      "Machine Learning", "Deep Learning", "Neural Networks", "Data Mining",
      "Natural Language Processing", "Computer Vision", "Reinforcement Learning",
      "Pattern Recognition", "Statistical Learning", "Big Data Analytics"
    ],
    faculty: [
      "Dr. Gatram Rama Mohan Babu", "Dr. N Venkateswara Rao", "Dr. Seli Mohapatra",
      "Dr. Sudheer Kumar", "Dr. Krishna Mohan", "Dr. Prasanna Anjaneyulu",
      "Dr. Gouthami Priya", "Dr. Vijayalakshmi"
    ]
  },

  CSD: {
    subjects: [
      "Data Science Fundamentals", "Data Visualization", "Statistical Modelling",
      "Machine Learning", "Big Data", "Data Engineering", "Python for Data Science",
      "Deep Learning", "Predictive Analytics", "Data Warehousing"
    ],
    faculty: [
      "Dr. Popuri Srinivasa Rao", "Dr. Riaz Shaik", "Dr. R V Kishore Kumar",
      "Dr. V Srinivas Rao", "B Manasa", "Dr. K Sandeep", "Dr. Chandra Sekhar", "Dr. Subba Rao"
    ]
  },

  ECE: {
    subjects: [
      "Signals and Systems", "Analog Communication", "Digital Communication",
      "Digital Signal Processing", "VLSI Design", "Microprocessors",
      "Embedded Systems", "Antenna Theory", "Wireless Communication", "Electronic Devices"
    ],
    faculty: [
      "Dr. T Ranga Babu", "Dr. P Suresh Kumar", "Dr. D Eswara Chaitanya",
      "Dr. S Ramesh Babu", "Dr. M V Siva Prasad", "Dr. P Siva Prasad",
      "Dr. Padmavathi", "Dr. Subba Rao"
    ]
  },

  EEE: {
    subjects: [
      "Electrical Machines", "Power Systems", "Power Electronics", "Control Systems",
      "Renewable Energy Systems", "Smart Grid", "Network Analysis", "Electrical Drives",
      "Instrumentation", "High Voltage Engineering"
    ],
    faculty: [
      "Dr. K Venkata Rao", "Dr. B Suresh", "Dr. N Raghavendra",
      "Dr. P Srinivasa Rao", "K Jyothi", "Dr. M Prasad",
      "Dr. Satyanarayana", "Dr. Krishna Veni"
    ]
  },

  MECH: {
    subjects: [
      "Engineering Mechanics", "Thermodynamics", "Fluid Mechanics", "Heat Transfer",
      "Machine Design", "Manufacturing Technology", "Robotics", "CAD CAM",
      "Industrial Engineering", "Strength of Materials"
    ],
    faculty: [
      "Dr. B Sreenivasulu", "Dr. M Rama Rao", "Dr. K Srinivasa Rao",
      "Dr. P Subba Rao", "P Ravi Kumar", "Dr. K Ravindra",
      "Dr. Murali Krishna", "Dr. Satyanarayana"
    ]
  },

  CIVIL: {
    subjects: [
      "Structural Analysis", "Geotechnical Engineering", "Environmental Engineering",
      "Surveying", "Transportation Engineering", "Water Resources Engineering",
      "Concrete Technology", "Construction Planning", "Building Materials", "Engineering Mechanics"
    ],
    faculty: [
      "Dr. K Rama Mohan Rao", "M Srikanth Kumar", "S V Satyanarayana",
      "Y Madhavi", "Dr. P Siva Kumar", "Dr. B Krishna",
      "Dr. Anjali Devi", "Dr. Chalapathi Rao"
    ]
  },

  CHE: {
    subjects: [
      "Chemical Process Calculations", "Fluid Flow Operations", "Heat Transfer",
      "Mass Transfer", "Chemical Reaction Engineering", "Process Control",
      "Plant Design", "Polymer Technology", "Petroleum Refining", "Biochemical Engineering"
    ],
    faculty: [
      "Dr. K Venkata Subba Rao", "Dr. P Ramesh Babu", "Dr. M Ravi Kumar",
      "Dr. T Siva Kumar", "B Lakshmi", "Dr. V Raghuram",
      "Dr. Murali Krishna", "Dr. Padmavathi"
    ]
  },

  AIML: {
    subjects: [
      "Machine Learning", "Deep Learning", "Computer Vision",
      "Natural Language Processing", "Reinforcement Learning", "AI Ethics",
      "Pattern Recognition", "Big Data Analytics", "Statistical Learning", "Data Mining"
    ],
    faculty: [
      "Dr. Gatram Rama Mohan Babu", "Dr. N Venkateswara Rao",
      "Dr. Seli Mohapatra", "Dr. Sudheer Kumar",
      "Dr. Krishna Mohan", "Dr. Prasanna Anjaneyulu",
      "Dr. Vijayalakshmi", "Dr. Srinivas Rao"
    ]
  }

};

/* --------------------------------
STUDENT NAMES
-------------------------------- */

const studentNames = [
  "Sai Kiran", "Ravi Teja", "Praneeth Kumar", "Naveen Reddy",
  "Sai Charan", "Akash Kumar", "Vamsi Krishna", "Chaitanya",
  "Srikanth", "Sandeep Kumar", "Manoj Kumar", "Prudhvi",
  "Mahesh Babu", "Sai Ram", "Dinesh Kumar", "Varun Teja"
];

/* --------------------------------
DOUBT DATA MAPPING (Subject-Specific)
-------------------------------- */

const subjectSpecificDoubts = {
  "Programming for Problem Solving": [
    {
      title: "Understanding pointer-to-pointer (double pointers) in C?",
      description: "I'm comfortable with basic pointers, but I'm confused about when to use `int **ptr`. Can you explain it with a memory diagram and a practical use case like dynamic 2D arrays?",
      answer: "### Double Pointers in C\n\nA double pointer is a variable that stores the address of another pointer. \n\n#### Why use them?\n1. **Dynamic 2D Arrays**: To allocate memory for rows and columns dynamically.\n2. **Modifying Pointers in Functions**: If you want to change where a pointer points to from within a function.\n\n#### Memory Diagram:\n`Variable (value) -> Pointer (address of variable) -> Double Pointer (address of pointer)`\n\n```c\nint x = 10;\nint *p = &x;\nint **pp = &p;\n// **pp is 10\n```"
    }
  ],
  "Data Structures": [
    {
      title: "AVL Tree vs Red-Black Tree - Which one to choose?",
      description: "Both are self-balancing BSTs. My professor mentioned Red-Black trees are used in Linux kernels. Why not AVL trees if they are more strictly balanced?",
      answer: "### AVL vs Red-Black Trees\n\n| Feature | AVL Tree | Red-Black Tree |\n| :--- | :--- | :--- |\n| **Balance** | Strict ($|h1-h2| \\le 1$) | Loose (max height $2 \\times log n$) |\n| **Lookups** | Faster (better balance) | Slightly slower |\n| **Insert/Delete** | Slower (more rotations) | Faster (fewer rotations) |\n\n**Verdict**: Use **AVL** for lookup-intensive apps (e.g., dictionaries). Use **Red-Black** for general-purpose libraries where insertions and deletions are frequent."
    }
  ],
  "Algorithms": [
    {
      title: "Dijkstra's vs Bellman-Ford for Shortest Path?",
      description: "Dijkstra's is faster, but why do we need Bellman-Ford? Please explain the negative edge weight scenario and how Bellman-Ford detects cycles.",
      answer: "### Shortest Path Algorithms\n\n1. **Dijkstra's**: Works only with **non-negative weights**.\n2. **Bellman-Ford**: Works with **negative weights** and can detect **negative cycles**.\n\n**Cycle Detection**: If we relax all edges one more time ($V$-th time) and a shorter path is found, there is a negative cycle."
    }
  ],
  "Operating Systems": [
    {
      title: "Difference between Internal and External Fragmentation?",
      description: "I get confused between paging and segmentation. Which one causes which type of fragmentation and how do we solve it?",
      answer: "### Memory Fragmentation\n\n1. **Internal Fragmentation**: Occurs in **Paging**. Memory inside a page is wasted.\n2. **External Fragmentation**: Occurs in **Segmentation**. Total free memory is enough, but not contiguous.\n\n**Solution**: **Compaction** for external, and using smaller page sizes for internal."
    }
  ],
  "Signals and Systems": [
    {
      title: "LTI System Stability Criteria?",
      description: "How do we determine if a discrete-time LTI system is stable using the Z-transform? What is the condition on the Region of Convergence (ROC)?",
      answer: "### Stability in Discrete-Time Systems\n\nA discrete-time LTI system is **Stable (BIBO stable)** if and only if:\n1. The **ROC** of the transfer function $H(z)$ includes the **unit circle** ($|z| = 1$).\n2. For a causal system, this means all **poles** of $H(z)$ must lie **inside** the unit circle ($|p_i| < 1$)."
    }
  ],
  "Electrical Machines": [
    {
      title: "Why is a Transformer rated in kVA instead of kW?",
      description: "I understand that power factor depends on the load, but technically why does the manufacturer use apparent power for rating?",
      answer: "### Transformer Rating (kVA)\n\nA transformer's losses consist of:\n1. **Copper Losses**: Depends on current ($I$), which depends on kVA.\n2. **Iron/Core Losses**: Depends on voltage ($V$).\n\nSince losses depend on $V$ and $I$ regardless of the phase angle (Power Factor), the rating is given in **kVA** ($V \\times I$)."
    }
  ],
  "Engineering Mechanics": [
    {
      title: "Practical application of Varignon's Theorem?",
      description: "The theorem says the moment of a force is equal to the sum of moments of its components. Can you show a calculation example for 2D equilibrium?",
      answer: "### Varignon's Theorem\n\nIt simplifies calculating the moment of a force inclined at an angle. Instead of finding the perpendicular distance to the line of action, resolve the force into horizontal ($F_x$) and vertical ($F_y$) components.\n\n**Moment** $M_o = (F_y \\times x) - (F_x \\times y)$"
    }
  ],
  "Structural Analysis": [
    {
      title: "Statically Determinate vs Indeterminate Structures?",
      description: "How do I quickly identify if a truss is indeterminate? Is there a formula for joints and members?",
      answer: "### Determinacy of Trusses\n\nFor a 2D truss:\n- **Formula**: $D = m + r - 2j$\n- $m$ = Number of members\n- $r$ = Number of reaction forces\n- $j$ = Number of joints\n\nIf $D = 0$, it is **Determinate**. If $D > 0$, it is **Indeterminate**."
    }
  ],
  "Chemical Process Calculations": [
    {
      title: "Bypass vs Purge streams in Material Balances?",
      description: "In what scenarios do we prefer a purge stream over simple recycle? How does it affect the overall conversion of the process?",
      answer: "### Bypass, Recycle, and Purge\n\n1. **Recycle**: Returns unused reactants to the reactor to increase overall conversion.\n2. **Purge**: A small stream bled from the recycle to prevent the accumulation of **inerts** or impurities that don't react.\n3. **Bypass**: Directs a portion of the feed around a unit to control the composition of the product."
    }
  ]
};

const genericDoubts = [
  {
    title: "How to effectively manage time during semester exams?",
    description: "I struggle to finish the descriptive questions in 3 hours. How should I allocate time between theory and numericals?",
    answer: "### Exam Time Management\n\n1. **First 15 mins**: Read the paper and mark the questions you know perfectly.\n2. **Allocation**: Spend 40% on numericals (high scoring) and 60% on theory.\n3. **Visuals**: Use diagrams for theory to score better with less text."
  }
];

/* --------------------------------
ADMIN SEEDER
-------------------------------- */

const seedAdmin = async () => {
  console.log("Seeding Admin...");
  const admin = await User.create({
    name: "System Admin",
    email: "admin@rvrjc.ac.in",
    password: "admin123",
    role: "admin",
    department: "SYSTEM",
    approved: true
  });
  return admin;
};


/* --------------------------------
FACULTY SEEDER
-------------------------------- */

const seedFaculty = async () => {

  const facultyList = [];

  for (const dept in departments) {

    let index = 0;

    for (const name of departments[dept].faculty) {

      const email = name
        .toLowerCase()
        .replace(/dr. /g, "")
        .replace(/ /g, ".")
        + `.` + dept.toLowerCase() + `@rvrjc.ac.in`;

      const faculty = await User.create({

        name,
        email,
        password: "faculty123",
        role: "faculty",
        department: dept,
        courses: departments[dept].subjects.slice(0, 3),
        approved: true,
        facultyId: `FAC${dept}${100 + index}`

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

const firstNames = [
  "Sai", "Ravi", "Praneeth", "Naveen", "Charan", "Akash", "Vamsi", "Chaitanya",
  "Srikanth", "Sandeep", "Manoj", "Prudhvi", "Mahesh", "Dinesh", "Varun",
  "Karthik", "Harsha", "Aravind", "Lokesh", "Aditya"
];

const lastNames = [
  "Kumar", "Reddy", "Krishna", "Naidu", "Teja", "Chowdary",
  "Babu", "Sai", "Varma", "Prasad", "Rao", "Chandra"
];

const seedStudents = async () => {
  const studentsData = [];
  const usedEmails = new Set();
  const deptKeys = Object.keys(departments);

  console.log("Generating 160 students...");

  for (let i = 0; i < 160; i++) {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const dept = deptKeys[i % deptKeys.length];

    let email = `${first.toLowerCase()}.${last.toLowerCase()}${22 + (i % 4)}@rvrjc.ac.in`;

    // Ensure unique email locally
    let attempts = 0;
    while (usedEmails.has(email) && attempts < 10) {
      email = `${first.toLowerCase()}.${last.toLowerCase()}${Math.floor(Math.random() * 999)}@rvrjc.ac.in`;
      attempts++;
    }
    usedEmails.add(email);

    studentsData.push({
      name: `${first} ${last}`,
      email,
      password: "student123", // In production, this would be hashed
      role: "student",
      department: dept,
      semester: Math.ceil(Math.random() * 8),
      approved: true
    });
  }

  const students = await User.insertMany(studentsData);
  return students;
};

/* --------------------------------
DOUBT SEEDER
-------------------------------- */

const seedDoubts = async (students, faculty) => {
  const totalDoubts = 250;
  const answeredThreshold = 0.75; // 75% answered
  const doubtsData = [];

  console.log(`Generating ${totalDoubts} doubts...`);

  for (let i = 0; i < totalDoubts; i++) {
    const student = students[Math.floor(Math.random() * students.length)];
    const deptFaculty = faculty.filter(f => f.department === student.department);
    const assignedTo = deptFaculty[Math.floor(Math.random() * deptFaculty.length)];
    const subjects = departments[student.department].subjects;
    const subject = subjects[Math.floor(Math.random() * subjects.length)];

    const isAnswered = i < totalDoubts * answeredThreshold;
    const status = isAnswered ? "answered" : "pending";

    // Select a unique doubt based on subject
    let doubtData;
    const specificOptions = subjectSpecificDoubts[subject];

    if (specificOptions && specificOptions.length > 0) {
      doubtData = specificOptions[Math.floor(Math.random() * specificOptions.length)];
    } else {
      // Create a subject-specific doubt on the fly if not in subjectSpecificDoubts
      doubtData = {
        title: `Question regarding ${subject} concepts`,
        description: `I am having trouble understanding some intermediate topics in ${subject}. Could you please provide a detailed explanation of the core principles covered in the recent lectures?`,
        answer: `### Explanation for ${subject}\n\nTo master ${subject}, you should focus on the following key areas:\n1. **Foundational Principles**: Ensure you have a strong grasp of the basics.\n2. **Practical Implementation**: Try solving real-world problems related to this subject.\n3. **Higher-level Concepts**: Once comfortable, move on to more advanced topics.\n\nIf you have a specific sub-topic that is confusing, please mention it for a more targeted response!`
      };
    }

    doubtsData.push({
      title: doubtData.title,
      description: doubtData.description,
      department: student.department,
      subject,
      postedBy: student._id,
      assignedTo: assignedTo._id,
      status,
      answer: status === "answered" ? doubtData.answer : null,
      answeredBy: status === "answered" ? assignedTo._id : null,
      tags: [student.department, subject],
      upvoteCount: Math.floor(Math.random() * 50),
      createdAt: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000)
    });
  }

  await Doubt.insertMany(doubtsData);
};

/* --------------------------------
RUN SEEDER
-------------------------------- */

const runSeeder = async () => {

  try {

    await connectDB();

    /* delete old students, admins and doubts */

    await User.deleteMany({ role: { $in: ["student", "admin"] } });
    await Doubt.deleteMany();

    console.log("Old data cleared");

    /* seed admin */

    await seedAdmin();

    /* fetch existing faculty */

    const faculty = await User.find({ role: "faculty" });

    console.log(`Loaded ${faculty.length} faculty from DB`);

    /* seed students */

    const students = await seedStudents();
    console.log("Students seeded");

    /* seed doubts */

    await seedDoubts(students, faculty);
    console.log("Doubts seeded");

    console.log("Seeder completed successfully");

    process.exit();

  } catch (err) {

    console.error(err);
    process.exit(1);

  }

};
runSeeder()