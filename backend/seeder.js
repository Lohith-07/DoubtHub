const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Doubt = require("./models/Doubt");

dotenv.config();

const facultyData = [
  {
    dept: "CSE",
    courses: ["Data Structures", "Algorithms", "Operating Systems", "Computer Networks", "DBMS", "Software Engineering", "Artificial Intelligence"]
  },
  {
    dept: "CSM",
    courses: ["Machine Learning", "Deep Learning", "Data Mining"]
  },
  {
    dept: "IT",
    courses: ["Cloud Computing", "Network Security", "Distributed Systems"]
  },
  {
    dept: "ECE",
    courses: ["Digital Signal Processing", "Microprocessors", "Embedded Systems"]
  },
  {
    dept: "EEE",
    courses: ["Power Systems", "Electrical Machines", "Power Electronics"]
  },
  {
    dept: "CIVIL",
    courses: ["Structural Analysis", "Geotechnical Engineering", "Environmental Engineering"]
  },
  {
    dept: "MECH",
    courses: ["Thermodynamics", "Heat Transfer", "Robotics"]
  }
];

const realisticDoubts = [
  // --- CSE (Computer Science & Engineering) ---
  {
    title: "How does the time complexity of QuickSort change in the worst-case scenario?",
    description: "I understand that QuickSort is O(n log n) on average, but what specific input triggers O(n^2)? Does the pivot selection strategy completely eliminate this risk?",
    subject: "Algorithms",
    dept: "CSE"
  },
  {
    title: "What is the difference between a Process and a Thread in modern Operating Systems?",
    description: "I am confused about memory sharing. Do threads share the heap or the stack? How does the OS handle context switching differently for them?",
    subject: "Operating Systems",
    dept: "CSE"
  },
  {
    title: "How do I implement a B+ Tree for database indexing?",
    description: "I'm looking for a clear explanation of how insertion works when a leaf node is full. How is the pointer structure maintained?",
    subject: "DBMS",
    dept: "CSE"
  },
  {
    title: "What is the role of a 'Pointer' in memory management in C++?",
    description: "How does manual memory management with new/delete compare to smart pointers? Which one is safer for large-scale applications?",
    subject: "Data Structures",
    dept: "CSE"
  },
  {
    title: "What are the common lifecycle phases in the SDLC?",
    description: "Can someone explain the difference between the Waterfall and Agile models with respect to testing and client feedback?",
    subject: "Software Engineering",
    dept: "CSE"
  },
  {
    title: "How does the TCP 3-way handshake ensure reliable connection?",
    description: "What happens if the final ACK is lost? Does the server keep the connection half-open forever?",
    subject: "Computer Networks",
    dept: "CSE"
  },
  {
    title: "What is the difference between supervised and unsupervised learning?",
    description: "I understand that supervision needs labeled data, but how does the algorithm learn patterns in unsupervised learning?",
    subject: "Artificial Intelligence",
    dept: "CSE"
  },

  // --- CSM (Machine Learning/AI Specialization) ---
  {
    title: "When should I prefer ReLU over Sigmoid or Tanh in Deep Learning?",
    description: "Are there specific types of layers where Sigmoid is still relevant, or is ReLU always the better choice for hidden layers?",
    subject: "Deep Learning",
    dept: "CSM"
  },
  {
    title: "How does backpropagation actually update weights in a neural network?",
    description: "I'm struggling with the chain rule application during the gradient descent step. Can someone explain the mathematical flow?",
    subject: "Machine Learning",
    dept: "CSM"
  },
  {
    title: "What is the difference between K-Means and Hierarchical clustering?",
    description: "If I don't know the number of clusters (K) beforehand, is Hierarchical clustering always better than K-Means?",
    subject: "Data Mining",
    dept: "CSM"
  },
  {
    title: "How does Dropout help in preventing overfitting?",
    description: "If we randomly deactivate neurons during training, doesn't that make the model's predictions inconsistent during testing?",
    subject: "Deep Learning",
    dept: "CSM"
  },
  {
    title: "What are the different types of Gradient Descent?",
    description: "Can someone explain the trade-offs between Batch, Stochastic, and Mini-batch gradient descent in terms of convergence speed?",
    subject: "Machine Learning",
    dept: "CSM"
  },
  {
    title: "What is the Curse of Dimensionality in Data Mining?",
    description: "How does having too many features affect the performance of a model? Does PCA always solve this issue?",
    subject: "Data Mining",
    dept: "CSM"
  },
  {
    title: "How does a CNN handle spatial invariance?",
    description: "I understand convolution layers extract features, but how does the network know if an object is at the top left vs bottom right?",
    subject: "Deep Learning",
    dept: "CSM"
  },

  // --- IT (Information Technology) ---
  {
    title: "What is the Shared Responsibility Model in Cloud Computing?",
    description: "If I'm using AWS S3, who is responsible for data encryption at rest vs encryption in transit?",
    subject: "Cloud Computing",
    dept: "IT"
  },
  {
    title: "Explain the difference between Symmetric and Asymmetric encryption.",
    description: "Why is Asymmetric encryption used for key exchange if Symmetric encryption is faster?",
    subject: "Network Security",
    dept: "IT"
  },
  {
    title: "How does Load Balancing work in Distributed Systems?",
    description: "What are the common algorithms like Round Robin or Least Connections? How do they handle node failures?",
    subject: "Distributed Systems",
    dept: "IT"
  },
  {
    title: "What are the advantages of Docker containers over Virtual Machines?",
    description: "I keep hearing about resource efficiency, but how exactly does Docker share the host OS kernel?",
    subject: "Cloud Computing",
    dept: "IT"
  },
  {
    title: "How does a DDoS attack work at the protocol level?",
    description: "Is it always just flooding with traffic, or are there more subtle ways like SYN-ACK exhaustion?",
    subject: "Network Security",
    dept: "IT"
  },
  {
    title: "What is CAP Theorem in Distributed Databases?",
    description: "Is it true that we can only have two out of Consistency, Availability, and Partition Tolerance? Can we never have all three?",
    subject: "Distributed Systems",
    dept: "IT"
  },
  {
    title: "What is Serverless Architecture?",
    description: "If there are no servers, where does my code actually execute? How does scaling work automatically?",
    subject: "Cloud Computing",
    dept: "IT"
  },

  // --- ECE (Electronics & Communication) ---
  {
    title: "What is Aliasing in Digital Signal Processing?",
    description: "I know the Nyquist rate, but what physically happens to the signals when the sampling rate is too low?",
    subject: "Digital Signal Processing",
    dept: "ECE"
  },
  {
    title: "What are the different modes of 8086 Microprocessor?",
    description: "Can someone explain the difference between Minimum mode and Maximum mode? When do we use each?",
    subject: "Microprocessors",
    dept: "ECE"
  },
  {
    title: "What is the difference between a Microprocessor and a Microcontroller?",
    description: "If I'm building a simple microwave controller, which one should I use and why?",
    subject: "Embedded Systems",
    dept: "ECE"
  },
  {
    title: "How does FFT reduce computation time compared to DFT?",
    description: "Is it just about using symmetry properties, or is there a deeper mathematical trick involved?",
    subject: "Digital Signal Processing",
    dept: "ECE"
  },
  {
    title: "What is the purpose of Interrupts in 8051?",
    description: "How does the microcontroller know where to resume code after the ISR is finished? What is the stack's role?",
    subject: "Microprocessors",
    dept: "ECE"
  },
  {
    title: "Why is RTOS used in Embedded Systems instead of normal OS?",
    description: "What is deterministic behavior, and why is it critical for systems like airbag deployment?",
    subject: "Embedded Systems",
    dept: "ECE"
  },
  {
    title: "Explain the Z-transform in Signal Processing.",
    description: "How is it related to the Laplace transform? Why do we use Z-domain for discrete signals?",
    subject: "Digital Signal Processing",
    dept: "ECE"
  },

  // --- EEE (Electrical & Electronics) ---
  {
    title: "What is the difference between a Step-up and Step-down Transformer?",
    description: "I know the voltage changes, but what happens to the power? Does it stay constantoretically?",
    subject: "Electrical Machines",
    dept: "EEE"
  },
  {
    title: "How does a Power System maintain frequency stability?",
    description: "What happens if there is a sudden increase in load? Does the generator speed up or slow down immediately?",
    subject: "Power Systems",
    dept: "EEE"
  },
  {
    title: "What are the common Power Electronics converters?",
    description: "When should I use a Buck converter vs a Boost converter? How does the duty cycle control the output?",
    subject: "Power Electronics",
    dept: "EEE"
  },
  {
    title: "Explain the working principle of a 3-Phase Induction Motor.",
    description: "Why doesn't the rotor rotate at the same speed as the magnetic field (Slip)? What happens at synchronous speed?",
    subject: "Electrical Machines",
    dept: "EEE"
  },
  {
    title: "What is the role of Overcurrent Relays in protection?",
    description: "How do we coordinate different relays to ensure only the faulty section is isolated?",
    subject: "Power Systems",
    dept: "EEE"
  },
  {
    title: "How does PWM control the speed of a DC motor?",
    description: "Is it just averaging the voltage, or is there some effect on the motor's torque during the pulses?",
    subject: "Power Electronics",
    dept: "EEE"
  },
  {
    title: "What is the significance of the Load Flow analysis?",
    description: "Why do we need to know the voltage and phase angles at every bus in the power grid?",
    subject: "Power Systems",
    dept: "EEE"
  },

  // --- CIVIL (Civil Engineering) ---
  {
    title: "What are the different types of Beams in Structural Analysis?",
    description: "Can someone explain the difference between a simply supported beam and a cantilever beam in terms of bending moment?",
    subject: "Structural Analysis",
    dept: "CIVIL"
  },
  {
    title: "How is soil compaction measured in Geotechnical Engineering?",
    description: "What is the Proctor test, and why is there an optimum moisture content for maximum density?",
    subject: "Geotechnical Engineering",
    dept: "CIVIL"
  },
  {
    title: "What are the common methods of sewage treatment?",
    description: "What is the role of aerobic vs anaerobic bacteria in the secondary treatment phase?",
    subject: "Environmental Engineering",
    dept: "CIVIL"
  },
  {
    title: "What is the difference between RCC and Pre-stressed concrete?",
    description: "Why is pre-stressing used for long-span bridges? How does it counteract the expected tension?",
    subject: "Structural Analysis",
    dept: "CIVIL"
  },
  {
    title: "How does the water table affect the bearing capacity of soil?",
    description: "If the water table rises, does the soil become weaker? Why is drainage so important for foundations?",
    subject: "Geotechnical Engineering",
    dept: "CIVIL"
  },
  {
    title: "What is the BOD (Biochemical Oxygen Demand) in water quality?",
    description: "Why is high BOD bad for aquatic life? How do we reduce it in industrial wastewater?",
    subject: "Environmental Engineering",
    dept: "CIVIL"
  },
  {
    title: "Explain the Moment Distribution Method.",
    description: "Is it still widely used in the age of computer software (Finite Element Method)? What are its core steps?",
    subject: "Structural Analysis",
    dept: "CIVIL"
  },

  // --- MECH (Mechanical Engineering) ---
  {
    title: "What is the Second Law of Thermodynamics?",
    description: "I understand energy is conserved (First Law), but why can't we convert heat 100% into work?",
    subject: "Thermodynamics",
    dept: "MECH"
  },
  {
    title: "Difference between Conduction, Convection, and Radiation.",
    description: "If I'm standing near a heater but not touching it, is the heat reaching me mostly via convection or radiation?",
    subject: "Heat Transfer",
    dept: "MECH"
  },
  {
    title: "What are the different types of Robot Grippers?",
    description: "When should I use a vacuum gripper vs a mechanical jaw for high-speed assembly?",
    subject: "Robotics",
    dept: "MECH"
  },
  {
    title: "Explain the Carnot Cycle and its efficiency.",
    description: "Why is it considered the theoretical maximum? Can we ever build a machine that follows it perfectly?",
    subject: "Thermodynamics",
    dept: "MECH"
  },
  {
    title: "What is the role of Reynolds Number in fluid flow?",
    description: "How does it help us differentiate between Laminar and Turbulent flow over a surface?",
    subject: "Heat Transfer",
    dept: "MECH"
  },
  {
    title: "What is Inverse Kinematics in Robotics?",
    description: "I know the joint angles give the position, but how do we calculate joint angles if we only have the target position?",
    subject: "Robotics",
    dept: "MECH"
  },
  {
    title: "What is the difference between an Otto cycle and a Diesel cycle?",
    description: "Why does the Diesel engine not need a spark plug? How does compression ratio affect them differently?",
    subject: "Thermodynamics",
    dept: "MECH"
  },
  {
    title: "What is Forced Convection vs Natural Convection?",
    description: "How does adding a fan (Forced) change the heat transfer coefficient compared to relying on temperature differences?",
    subject: "Heat Transfer",
    dept: "MECH"
  }
];

const teluguNames = [
  "Dr. Rajeshwar Rao", "Prof. Lakshmi Narayana", "Dr. Sreenivasulu Reddy",
  "Prof. Murali Krishna", "Dr. Anjali Devi", "Prof. Satyanarayana",
  "Dr. Padmavathi", "Prof. Ramana Murthy", "Dr. Subba Rao",
  "Prof. Vani Prasad", "Dr. Koteswara Rao", "Prof. Bhaskar Reddy",
  "Dr. Saraswathi", "Prof. Chandra Shekar", "Dr. Madhusudhan Rao",
  "Prof. Krishna Veni", "Dr. Raghava Raju", "Prof. Srinivas Rao",
  "Dr. Vijayalakshmi", "Prof. Chalapathi Rao", "Dr. Gouthami Priya"
];

const seedFaculty = async () => {
  console.log("🚀 Seeding Faculty (Goal: 21 total with Telugu names)...");
  const createdFaculty = [];
  let nameIndex = 0;

  for (const item of facultyData) {
    const facultyCount = 3;

    for (let i = 1; i <= facultyCount; i++) {
      const name = teluguNames[nameIndex++] || `Prof. ${item.dept} Expert ${i}`;
      const email = `${name.toLowerCase().replace(/dr. /g, "").replace(/prof. /g, "").replace(/ /g, ".")}@doubthub.com`;

      let existing = await User.findOne({ email });
      if (!existing) {
        const totalCourses = item.courses.length;
        const perFaculty = Math.ceil(totalCourses / facultyCount);
        const assignedCourses = item.courses.slice((i - 1) * perFaculty, i * perFaculty);
        const finalCourses = assignedCourses.length > 0 ? assignedCourses : item.courses;

        const faculty = await User.create({
          name,
          email,
          password: "faculty123",
          role: "faculty",
          department: item.dept,
          courses: finalCourses,
          approved: true,
          facultyId: `FAC${item.dept}${i}${Math.floor(100 + Math.random() * 900)}`
        });
        createdFaculty.push(faculty);
      } else {
        createdFaculty.push(existing);
      }
    }
  }
  return createdFaculty;
};


const seedDoubts = async (facultyList) => {
  console.log(`🚀 Seeding Doubts (Found ${realisticDoubts.length} templates)...`);

  let student = await User.findOne({ role: "student" });
  if (!student) {
    console.log("⚠️ No student found. Creating Seed Student...");
    student = await User.create({
      name: "Seed Student",
      email: "student.seed@doubthub.com",
      password: "student123",
      role: "student",
      department: "CSE",
      semester: 4,
      approved: true
    });
  }

  let count = 0;
  for (const doubtData of realisticDoubts) {
    // Find matching faculty (same department + taught course)
    const eligibleFaculty = facultyList.filter(f =>
      f.department === doubtData.dept && f.courses.includes(doubtData.subject)
    );

    // If no specific course match, find any faculty in that department as backup
    const backupFaculty = eligibleFaculty.length > 0 ? eligibleFaculty : facultyList.filter(f => f.department === doubtData.dept);

    if (backupFaculty.length === 0) {
      console.log(`❌ No faculty found for ${doubtData.dept} - ${doubtData.subject}`);
      continue;
    }

    const assignedTo = backupFaculty[Math.floor(Math.random() * backupFaculty.length)];

    // Check for duplicates before inserting
    const existingDoubt = await Doubt.findOne({
      title: doubtData.title,
      postedBy: student._id
    });

    if (!existingDoubt) {
      const status = Math.random() > 0.4 ? "answered" : "pending"; // 60% answered
      const answer = status === "answered" ?
        `Great question on ${doubtData.subject}! Regarding ${doubtData.title.split('?')[0]}, you should consider that the fundamental principle involves analyzing the system state at specific intervals. For a more detailed breakdown, please refer to chapter 5 of our textbook or visit the documentation for this specific module.` :
        null;

      await Doubt.create({
        ...doubtData,
        department: doubtData.dept,
        postedBy: student._id,
        assignedTo: assignedTo._id,
        status,
        answer,
        answeredBy: status === "answered" ? assignedTo._id : null,
        tags: [doubtData.dept, doubtData.subject.replace(/ /g, "")],
        upvoteCount: Math.floor(Math.random() * 25),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)) // Random time in last 7 days
      });
      count++;
    }
  }
  console.log(`✅ Seeded ${count} new doubts.`);
};

const runSeeder = async () => {
  try {
    await connectDB();

    // Safety: Reset specific seed data if needed (optional, here we avoid it as per requirements)
    // For now we just run and it handles duplicates itself

    const facultyList = await seedFaculty();
    await seedDoubts(facultyList);

    console.log("🎉 Seeder run complete! Check your database.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

runSeeder();
