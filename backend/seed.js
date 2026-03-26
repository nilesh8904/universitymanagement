const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const College = require('./models/College');
const Program = require('./models/Program');
const Course = require('./models/Course');
const Attendance = require('./models/Attendance');
const Assignment = require('./models/Assignment');
const Result = require('./models/Result');
const Material = require('./models/Material');
const Timetable = require('./models/Timetable');

// Connect to MongoDB with better timeout settings
const connectDB = async () => {
  try {
    console.log('🔌 Connecting to MongoDB Atlas (seed version)...');

    const uri = process.env.MONGODB_URI;
    if (!uri) {
  console.error('❌ MONGODB_URI not found in .env');
  process.exit(1);
}

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
    });

    console.log('✅ MongoDB Connected Successfully for Seeding');
    console.log('📊 Database:', mongoose.connection.name);
    return true;

  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('❌ Error Code:', err.code);
    console.error('❌ Error Name:', err.name);
    console.error('⚠️  Please check:');
    console.error('   1. Internet connection is active');
    console.error('   2. MongoDB URI is correct in .env');
    console.error('   3. IP address is whitelisted in MongoDB Atlas');
    console.error('   4. MongoDB cluster is running (not paused)');
    return false;
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await College.deleteMany({});
    await Program.deleteMany({});
    await Course.deleteMany({});
    await Attendance.deleteMany({});
    await Assignment.deleteMany({});
    await Result.deleteMany({});
    await Material.deleteMany({});
    await Timetable.deleteMany({});

    // Create Colleges
    console.log('🏫 Creating colleges...');
    const colleges = await College.insertMany([
      {
        name: 'Engineering College',
        code: 'ENG001',
        address: '123 University Ave, Tech City',
        dean: 'Dr. John Smith',
        establishedYear: 1995,
        studentCount: 1200,
        facultyCount: 85,
      },
      {
        name: 'Business School',
        code: 'BUS001',
        address: '456 Commerce St, Business Park',
        dean: 'Dr. Sarah Johnson',
        establishedYear: 2000,
        studentCount: 800,
        facultyCount: 55,
      },
      {
        name: 'Arts & Science College',
        code: 'ART001',
        address: '789 Liberal Arts Rd, Campus North',
        dean: 'Dr. Michael Brown',
        establishedYear: 1985,
        studentCount: 950,
        facultyCount: 70,
      },
    ]);

    // Create Programs
    console.log('📚 Creating programs...');
    const programs = await Program.insertMany([
      {
        name: 'Computer Science',
        code: 'CS-BTech',
        degree: 'B.Tech',
        duration: '4 years',
        college: colleges[0]._id,
        department: 'Computer Science',
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME-BTech',
        degree: 'B.Tech',
        duration: '4 years',
        college: colleges[0]._id,
        department: 'Mechanical',
      },
      {
        name: 'Business Administration',
        code: 'BBA',
        degree: 'BBA',
        duration: '3 years',
        college: colleges[1]._id,
        department: 'Management',
      },
      {
        name: 'Physics',
        code: 'PHY-BSc',
        degree: 'B.Sc',
        duration: '3 years',
        college: colleges[2]._id,
        department: 'Physics',
      },
    ]);

    // Create University Admin
    console.log('👤 Creating university admin...');
    const universityAdmin = await User.create({
      name: 'Admin User',
      email: 'admin@university.edu',
      password: 'password123',
      role: 'university_admin',
    });

    // Create College Admins (Faculty/Teachers)
    console.log('👨‍🏫 Creating college admins, faculty and teachers...');
    const collegeAdmins = await Promise.all([
      User.create({
        name: 'Prof. James Wilson',
        email: 'james@eng.edu',
        password: 'password123',
        role: 'college_admin',
        collegeId: colleges[0]._id,
        facultyInfo: {
          employeeId: 'EMP001',
          department: 'Computer Science',
          specialization: 'Artificial Intelligence',
          phone: '+1234567890',
        },
      }),
      User.create({
        name: 'Prof. Emily Davis',
        email: 'emily@eng.edu',
        password: 'password123',
        role: 'college_admin',
        collegeId: colleges[0]._id,
        facultyInfo: {
          employeeId: 'EMP002',
          department: 'Mechanical',
          specialization: 'Thermodynamics',
          phone: '+1234567891',
        },
      }),
      User.create({
        name: 'Prof. Robert Martinez',
        email: 'robert@business.edu',
        password: 'password123',
        role: 'college_admin',
        collegeId: colleges[1]._id,
        facultyInfo: {
          employeeId: 'EMP003',
          department: 'Management',
          specialization: 'Strategic Management',
          phone: '+1234567892',
        },
      }),
    ]);

    // Create Additional Faculty/Teachers
    console.log('👨‍🏫 Creating additional teachers...');
    const additionalFaculty = await Promise.all([
      User.create({
        name: 'Dr. Sarah Chen',
        email: 'sarah@eng.edu',
        password: 'password123',
        role: 'college_admin',
        collegeId: colleges[0]._id,
        facultyInfo: {
          employeeId: 'EMP004',
          department: 'Computer Science',
          specialization: 'Data Science & ML',
          phone: '+1234567893',
        },
      }),
      User.create({
        name: 'Dr. Michael Brown',
        email: 'michael@eng.edu',
        password: 'password123',
        role: 'college_admin',
        collegeId: colleges[0]._id,
        facultyInfo: {
          employeeId: 'EMP005',
          department: 'Computer Science',
          specialization: 'Web Development',
          phone: '+1234567894',
        },
      }),
      User.create({
        name: 'Prof. Jennifer Lee',
        email: 'jennifer@eng.edu',
        password: 'password123',
        role: 'college_admin',
        collegeId: colleges[0]._id,
        facultyInfo: {
          employeeId: 'EMP006',
          department: 'Mechanical',
          specialization: 'Fluid Mechanics',
          phone: '+1234567895',
        },
      }),
      User.create({
        name: 'Dr. Mark Wilson',
        email: 'mark@business.edu',
        password: 'password123',
        role: 'college_admin',
        collegeId: colleges[1]._id,
        facultyInfo: {
          employeeId: 'EMP007',
          department: 'Management',
          specialization: 'Finance',
          phone: '+1234567896',
        },
      }),
      User.create({
        name: 'Prof. Lisa Anderson',
        email: 'lisa@business.edu',
        password: 'password123',
        role: 'college_admin',
        collegeId: colleges[1]._id,
        facultyInfo: {
          employeeId: 'EMP008',
          department: 'Management',
          specialization: 'Human Resources',
          phone: '+1234567897',
        },
      }),
      User.create({
        name: 'Dr. David Thomas',
        email: 'david@arts.edu',
        password: 'password123',
        role: 'college_admin',
        collegeId: colleges[2]._id,
        facultyInfo: {
          employeeId: 'EMP009',
          department: 'Physics',
          specialization: 'Quantum Physics',
          phone: '+1234567898',
        },
      }),
    ]);

    const allFaculty = [...collegeAdmins, ...additionalFaculty];

    // Create Courses
    console.log('📖 Creating courses...');
    const courses = await Course.insertMany([
      {
        name: 'Data Structures and Algorithms',
        code: 'CS301',
        credits: 4,
        semester: 3,
        college: colleges[0]._id,
        faculty: allFaculty[0]._id,
        description: 'Advanced data structures and algorithm design',
      },
      {
        name: 'Database Management Systems',
        code: 'CS401',
        credits: 3,
        semester: 4,
        college: colleges[0]._id,
        faculty: allFaculty[0]._id,
        description: 'Relational databases and SQL',
      },
      {
        name: 'Machine Learning Fundamentals',
        code: 'CS501',
        credits: 4,
        semester: 5,
        college: colleges[0]._id,
        faculty: allFaculty[3]._id,
        description: 'Introduction to Machine Learning and AI concepts',
      },
      {
        name: 'Web Development with MERN',
        code: 'CS201',
        credits: 3,
        semester: 2,
        college: colleges[0]._id,
        faculty: allFaculty[4]._id,
        description: 'Full stack web development using MongoDB, Express, React, Node.js',
      },
      {
        name: 'Thermodynamics',
        code: 'ME201',
        credits: 4,
        semester: 2,
        college: colleges[0]._id,
        faculty: allFaculty[1]._id,
        description: 'Laws of thermodynamics and applications',
      },
      {
        name: 'Fluid Mechanics',
        code: 'ME301',
        credits: 4,
        semester: 3,
        college: colleges[0]._id,
        faculty: allFaculty[5]._id,
        description: 'Fundamentals of fluid mechanics and flow analysis',
      },
      {
        name: 'Marketing Management',
        code: 'BUS301',
        credits: 3,
        semester: 3,
        college: colleges[1]._id,
        faculty: allFaculty[2]._id,
        description: 'Principles of marketing and strategy',
      },
      {
        name: 'Financial Accounting',
        code: 'BUS201',
        credits: 3,
        semester: 2,
        college: colleges[1]._id,
        faculty: allFaculty[6]._id,
        description: 'Financial accounting principles and practices',
      },
      {
        name: 'Human Resource Management',
        code: 'BUS401',
        credits: 3,
        semester: 4,
        college: colleges[1]._id,
        faculty: allFaculty[7]._id,
        description: 'Strategic human resource management',
      },
      {
        name: 'Quantum Physics',
        code: 'PHY401',
        credits: 4,
        semester: 4,
        college: colleges[2]._id,
        faculty: allFaculty[8]._id,
        description: 'Introduction to quantum mechanics and quantum theory',
      },
    ]);

    // Create Students
    console.log('🎓 Creating students...');
    const students = await Promise.all([
      User.create({
        name: 'Alice Johnson',
        email: 'alice@student.edu',
        password: 'password123',
        role: 'student',
        collegeId: colleges[0]._id,
        studentInfo: {
          rollNumber: 'CS2021001',
          department: 'Computer Science',
          semester: 3,
          year: 2,
          courses: [courses[0]._id, courses[1]._id],
        },
      }),
      User.create({
        name: 'Bob Smith',
        email: 'bob@student.edu',
        password: 'password123',
        role: 'student',
        collegeId: colleges[0]._id,
        studentInfo: {
          rollNumber: 'CS2021002',
          department: 'Computer Science',
          semester: 3,
          year: 2,
          courses: [courses[0]._id, courses[1]._id],
        },
      }),
      User.create({
        name: 'Carol Williams',
        email: 'carol@student.edu',
        password: 'password123',
        role: 'student',
        collegeId: colleges[0]._id,
        studentInfo: {
          rollNumber: 'ME2021001',
          department: 'Mechanical',
          semester: 2,
          year: 1,
          courses: [courses[2]._id],
        },
      }),
      User.create({
        name: 'David Brown',
        email: 'david@student.edu',
        password: 'password123',
        role: 'student',
        collegeId: colleges[1]._id,
        studentInfo: {
          rollNumber: 'BUS2021001',
          department: 'Management',
          semester: 3,
          year: 2,
          courses: [courses[3]._id],
        },
      }),
    ]);

    // Update courses with enrolled students
    console.log('👥 Assigning students to courses...');
    await Course.findByIdAndUpdate(courses[0]._id, {
      enrolledStudents: [students[0]._id, students[1]._id],
    });
    await Course.findByIdAndUpdate(courses[1]._id, {
      enrolledStudents: [students[0]._id, students[2]._id],
    });
    await Course.findByIdAndUpdate(courses[2]._id, {
      enrolledStudents: [students[1]._id, students[3]._id],
    });
    await Course.findByIdAndUpdate(courses[3]._id, {
      enrolledStudents: [students[0]._id, students[1]._id, students[2]._id],
    });
    await Course.findByIdAndUpdate(courses[4]._id, {
      enrolledStudents: [students[3]._id],
    });
    await Course.findByIdAndUpdate(courses[5]._id, {
      enrolledStudents: [students[3]._id],
    });
    await Course.findByIdAndUpdate(courses[6]._id, {
      enrolledStudents: [students[2]._id],
    });
    await Course.findByIdAndUpdate(courses[7]._id, {
      enrolledStudents: [students[2]._id],
    });
    await Course.findByIdAndUpdate(courses[8]._id, {
      enrolledStudents: [students[1]._id, students[2]._id],
    });
    await Course.findByIdAndUpdate(courses[9]._id, {
      enrolledStudents: [students[3]._id],
    });
    console.log(`✅ Students enrolled in courses`);

    // Create Timetable
    console.log('🗓️  Creating timetable...');
    await Timetable.insertMany([
      {
        course: courses[0]._id,
        college: colleges[0]._id,
        faculty: allFaculty[0]._id,
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:30',
        room: 'CS-101',
        semester: 3,
      },
      {
        course: courses[0]._id,
        college: colleges[0]._id,
        faculty: allFaculty[0]._id,
        day: 'Wednesday',
        startTime: '09:00',
        endTime: '10:30',
        room: 'CS-101',
        semester: 3,
      },
      {
        course: courses[1]._id,
        college: colleges[0]._id,
        faculty: allFaculty[0]._id,
        day: 'Tuesday',
        startTime: '11:00',
        endTime: '12:30',
        room: 'CS-102',
        semester: 4,
      },
      {
        course: courses[1]._id,
        college: colleges[0]._id,
        faculty: allFaculty[0]._id,
        day: 'Thursday',
        startTime: '11:00',
        endTime: '12:30',
        room: 'CS-102',
        semester: 4,
      },
      {
        course: courses[2]._id,
        college: colleges[0]._id,
        faculty: allFaculty[3]._id,
        day: 'Monday',
        startTime: '14:00',
        endTime: '15:30',
        room: 'CS-201',
        semester: 5,
      },
      {
        course: courses[3]._id,
        college: colleges[0]._id,
        faculty: allFaculty[4]._id,
        day: 'Tuesday',
        startTime: '09:00',
        endTime: '10:30',
        room: 'CS-301',
        semester: 2,
      },
      {
        course: courses[4]._id,
        college: colleges[0]._id,
        faculty: allFaculty[1]._id,
        day: 'Wednesday',
        startTime: '11:00',
        endTime: '12:30',
        room: 'ME-101',
        semester: 2,
      },
      {
        course: courses[5]._id,
        college: colleges[0]._id,
        faculty: allFaculty[5]._id,
        day: 'Friday',
        startTime: '14:00',
        endTime: '15:30',
        room: 'ME-LAB',
        semester: 3,
      },
      {
        course: courses[6]._id,
        college: colleges[1]._id,
        faculty: allFaculty[2]._id,
        day: 'Monday',
        startTime: '10:00',
        endTime: '11:30',
        room: 'BUS-101',
        semester: 3,
      },
      {
        course: courses[7]._id,
        college: colleges[1]._id,
        faculty: allFaculty[6]._id,
        day: 'Wednesday',
        startTime: '14:00',
        endTime: '15:30',
        room: 'BUS-201',
        semester: 2,
      },
      {
        course: courses[8]._id,
        college: colleges[1]._id,
        faculty: allFaculty[7]._id,
        day: 'Thursday',
        startTime: '10:00',
        endTime: '11:30',
        room: 'BUS-102',
        semester: 4,
      },
      {
        course: courses[9]._id,
        college: colleges[2]._id,
        faculty: allFaculty[8]._id,
        day: 'Friday',
        startTime: '09:00',
        endTime: '10:30',
        room: 'PHY-301',
        semester: 4,
      },
    ]);

    // Create Attendance
    console.log('✅ Creating attendance records...');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBefore = new Date(today);
    dayBefore.setDate(dayBefore.getDate() - 2);
    const threeDaysBefore = new Date(today);
    threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);

    await Attendance.insertMany([
      // Course 0 - DS and Algorithms
      {
        course: courses[0]._id,
        student: students[0]._id,
        date: today,
        status: 'present',
        markedBy: allFaculty[0]._id,
        college: colleges[0]._id,
      },
      {
        course: courses[0]._id,
        student: students[1]._id,
        date: today,
        status: 'present',
        markedBy: allFaculty[0]._id,
        college: colleges[0]._id,
      },
      {
        course: courses[0]._id,
        student: students[0]._id,
        date: yesterday,
        status: 'present',
        markedBy: allFaculty[0]._id,
        college: colleges[0]._id,
      },
      {
        course: courses[0]._id,
        student: students[1]._id,
        date: yesterday,
        status: 'late',
        markedBy: allFaculty[0]._id,
        college: colleges[0]._id,
      },
      {
        course: courses[0]._id,
        student: students[0]._id,
        date: dayBefore,
        status: 'absent',
        markedBy: allFaculty[0]._id,
        college: colleges[0]._id,
      },
      // Course 1 - Database Management
      {
        course: courses[1]._id,
        student: students[0]._id,
        date: today,
        status: 'present',
        markedBy: allFaculty[0]._id,
        college: colleges[0]._id,
      },
      {
        course: courses[1]._id,
        student: students[2]._id,
        date: today,
        status: 'present',
        markedBy: allFaculty[0]._id,
        college: colleges[0]._id,
      },
      {
        course: courses[1]._id,
        student: students[0]._id,
        date: yesterday,
        status: 'present',
        markedBy: allFaculty[0]._id,
        college: colleges[0]._id,
      },
      // Course 2 - Machine Learning
      {
        course: courses[2]._id,
        student: students[1]._id,
        date: today,
        status: 'present',
        markedBy: allFaculty[3]._id,
        college: colleges[0]._id,
      },
      {
        course: courses[2]._id,
        student: students[3]._id,
        date: today,
        status: 'absent',
        markedBy: allFaculty[3]._id,
        college: colleges[0]._id,
      },
      // Course 3 - Web Development
      {
        course: courses[3]._id,
        student: students[0]._id,
        date: yesterday,
        status: 'present',
        markedBy: allFaculty[4]._id,
        college: colleges[0]._id,
      },
      {
        course: courses[3]._id,
        student: students[1]._id,
        date: yesterday,
        status: 'present',
        markedBy: allFaculty[4]._id,
        college: colleges[0]._id,
      },
      {
        course: courses[3]._id,
        student: students[2]._id,
        date: yesterday,
        status: 'late',
        markedBy: allFaculty[4]._id,
        college: colleges[0]._id,
      },
    ]);

    // Create Assignments
    console.log('📝 Creating assignments...');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);
    const pastDate2 = new Date();
    pastDate2.setDate(pastDate2.getDate() - 10);

    const assignments = await Assignment.insertMany([
      {
        title: 'Implement Binary Search Tree',
        description: 'Create a BST with insert, delete, and search operations. Implement all basic operations with proper error handling.',
        course: courses[0]._id,
        college: colleges[0]._id,
        faculty: allFaculty[0]._id,
        dueDate: futureDate,
        maxMarks: 100,
        submissions: [
          {
            student: students[0]._id,
            submittedAt: new Date(),
            files: [],
            marks: 85,
            feedback: 'Good implementation, minor improvements needed in error handling',
            status: 'graded',
          },
          {
            student: students[1]._id,
            submittedAt: pastDate,
            files: [],
            marks: 92,
            feedback: 'Excellent work! All operations implemented correctly.',
            status: 'graded',
          },
        ],
      },
      {
        title: 'Database Design Project',
        description: 'Design a database for a library management system. Include ER diagram, schema design, and SQL queries.',
        course: courses[1]._id,
        college: colleges[0]._id,
        faculty: allFaculty[0]._id,
        dueDate: futureDate,
        maxMarks: 100,
        submissions: [
          {
            student: students[0]._id,
            submittedAt: new Date(),
            files: [],
            marks: 88,
            feedback: 'Good schema design. Consider adding more indexes.',
            status: 'graded',
          },
          {
            student: students[2]._id,
            submittedAt: new Date(),
            files: [],
            marks: 76,
            feedback: 'Adequate design, but some normalization issues present.',
            status: 'graded',
          },
        ],
      },
      {
        title: 'Machine Learning Model Development',
        description: 'Develop a machine learning model using Python. Compare at least 3 different algorithms and provide analysis.',
        course: courses[2]._id,
        college: colleges[0]._id,
        faculty: allFaculty[3]._id,
        dueDate: futureDate,
        maxMarks: 100,
        submissions: [
          {
            student: students[1]._id,
            submittedAt: new Date(),
            files: [],
            marks: 89,
            feedback: 'Excellent comparative analysis. Well documented.',
            status: 'graded',
          },
          {
            student: students[3]._id,
            submittedAt: pastDate2,
            files: [],
            marks: 72,
            feedback: 'Late submission. Model works but analysis could be deeper.',
            status: 'graded',
          },
        ],
      },
      {
        title: 'Build a Todo App with MERN Stack',
        description: 'Create a full-stack todo application using MongoDB, Express, React, and Node.js with CRUD operations.',
        course: courses[3]._id,
        college: colleges[0]._id,
        faculty: allFaculty[4]._id,
        dueDate: futureDate,
        maxMarks: 100,
        submissions: [
          {
            student: students[0]._id,
            submittedAt: new Date(),
            files: [],
            marks: 91,
            feedback: 'Professional code quality. Great UI/UX.',
            status: 'graded',
          },
          {
            student: students[1]._id,
            submittedAt: new Date(),
            files: [],
            marks: 87,
            feedback: 'Good implementation. Consider adding authentication.',
            status: 'graded',
          },
          {
            student: students[2]._id,
            submittedAt: pastDate,
            files: [],
            marks: 79,
            feedback: 'Works well. Some code refactoring needed.',
            status: 'graded',
          },
        ],
      },
      {
        title: 'Thermodynamics Problem Set',
        description: 'Solve 10 comprehensive thermodynamics problems covering first and second laws.',
        course: courses[4]._id,
        college: colleges[0]._id,
        faculty: allFaculty[1]._id,
        dueDate: pastDate,
        maxMarks: 100,
        submissions: [
          {
            student: students[3]._id,
            submittedAt: pastDate,
            files: [],
            marks: 82,
            feedback: 'Good problem solving. Check calculations in problem 7.',
            status: 'graded',
          },
        ],
      },
      {
        title: 'Fluid Mechanics Lab Report',
        description: 'Write a comprehensive lab report for the pipe flow experiment.',
        course: courses[5]._id,
        college: colleges[0]._id,
        faculty: allFaculty[5]._id,
        dueDate: pastDate,
        maxMarks: 100,
        submissions: [
          {
            student: students[3]._id,
            submittedAt: pastDate,
            files: [],
            marks: 85,
            feedback: 'Well-structured report with good data analysis.',
            status: 'graded',
          },
        ],
      },
      {
        title: 'Marketing Strategy Case Study',
        description: 'Analyze a real company and develop a comprehensive marketing strategy.',
        course: courses[6]._id,
        college: colleges[1]._id,
        faculty: allFaculty[2]._id,
        dueDate: futureDate,
        maxMarks: 100,
        submissions: [
          {
            student: students[2]._id,
            submittedAt: new Date(),
            files: [],
            marks: 84,
            feedback: 'Excellent strategic analysis with clear recommendations.',
            status: 'graded',
          },
        ],
      },
      {
        title: 'Financial Analysis Assignment',
        description: 'Conduct financial analysis of three public companies and compare their performance.',
        course: courses[7]._id,
        college: colleges[1]._id,
        faculty: allFaculty[6]._id,
        dueDate: futureDate,
        maxMarks: 100,
        submissions: [
          {
            student: students[2]._id,
            submittedAt: new Date(),
            files: [],
            marks: 80,
            feedback: 'Good financial analysis. Include more ratio analysis.',
            status: 'graded',
          },
        ],
      },
      {
        title: 'HR Management Project',
        description: 'Develop HR policies for a tech startup. Cover recruitment, training, and retention.',
        course: courses[8]._id,
        college: colleges[1]._id,
        faculty: allFaculty[7]._id,
        dueDate: futureDate,
        maxMarks: 100,
        submissions: [
          {
            student: students[1]._id,
            submittedAt: new Date(),
            files: [],
            marks: 86,
            feedback: 'Comprehensive HR strategy. Well-researched.',
            status: 'graded',
          },
          {
            student: students[2]._id,
            submittedAt: new Date(),
            files: [],
            marks: 81,
            feedback: 'Solid work. Consider more employee engagement strategies.',
            status: 'graded',
          },
        ],
      },
      {
        title: 'Quantum Mechanics Physics Problem Set',
        description: 'Solve 8 problems covering wave functions, Schrodinger equation, and quantum operators.',
        course: courses[9]._id,
        college: colleges[2]._id,
        faculty: allFaculty[8]._id,
        dueDate: pastDate,
        maxMarks: 100,
        submissions: [
          {
            student: students[3]._id,
            submittedAt: pastDate,
            files: [],
            marks: 88,
            feedback: 'Excellent quantum mechanics understanding demonstrated.',
            status: 'graded',
          },
        ],
      },
    ]);

    // Create Results
    console.log('📊 Creating results...');
    await Result.insertMany([
      // Alice Johnson - CS Student (Courses 0, 1, 3)
      {
        student: students[0]._id,
        course: courses[0]._id,
        college: colleges[0]._id,
        semester: 3,
        examType: 'Mid-Term',
        totalMarks: 100,
        obtainedMarks: 85,
        grade: 'A',
        gpa: 8.5,
      },
      {
        student: students[0]._id,
        course: courses[0]._id,
        college: colleges[0]._id,
        semester: 3,
        examType: 'End-Term',
        totalMarks: 100,
        obtainedMarks: 88,
        grade: 'A',
        gpa: 8.8,
      },
      {
        student: students[0]._id,
        course: courses[1]._id,
        college: colleges[0]._id,
        semester: 4,
        examType: 'Mid-Term',
        totalMarks: 100,
        obtainedMarks: 90,
        grade: 'A+',
        gpa: 9.0,
      },
      {
        student: students[0]._id,
        course: courses[1]._id,
        college: colleges[0]._id,
        semester: 4,
        examType: 'End-Term',
        totalMarks: 100,
        obtainedMarks: 92,
        grade: 'A+',
        gpa: 9.2,
      },
      {
        student: students[0]._id,
        course: courses[3]._id,
        college: colleges[0]._id,
        semester: 2,
        examType: 'Quiz',
        totalMarks: 20,
        obtainedMarks: 18,
        grade: 'A+',
        gpa: 9.0,
      },
      // Bob Smith - CS Student (Courses 0, 1, 3, 8)
      {
        student: students[1]._id,
        course: courses[0]._id,
        college: colleges[0]._id,
        semester: 3,
        examType: 'Mid-Term',
        totalMarks: 100,
        obtainedMarks: 78,
        grade: 'B+',
        gpa: 7.8,
      },
      {
        student: students[1]._id,
        course: courses[0]._id,
        college: colleges[0]._id,
        semester: 3,
        examType: 'End-Term',
        totalMarks: 100,
        obtainedMarks: 82,
        grade: 'A',
        gpa: 8.2,
      },
      {
        student: students[1]._id,
        course: courses[1]._id,
        college: colleges[0]._id,
        semester: 4,
        examType: 'Mid-Term',
        totalMarks: 100,
        obtainedMarks: 75,
        grade: 'B',
        gpa: 7.5,
      },
      {
        student: students[1]._id,
        course: courses[1]._id,
        college: colleges[0]._id,
        semester: 4,
        examType: 'End-Term',
        totalMarks: 100,
        obtainedMarks: 80,
        grade: 'A',
        gpa: 8.0,
      },
      {
        student: students[1]._id,
        course: courses[3]._id,
        college: colleges[0]._id,
        semester: 2,
        examType: 'End-Term',
        totalMarks: 100,
        obtainedMarks: 87,
        grade: 'A',
        gpa: 8.7,
      },
      {
        student: students[1]._id,
        course: courses[8]._id,
        college: colleges[1]._id,
        semester: 4,
        examType: 'Assignment',
        totalMarks: 100,
        obtainedMarks: 86,
        grade: 'A',
        gpa: 8.6,
      },
      // Carol Williams - Mechanical Student (Courses 1, 2, 6, 7)
      {
        student: students[2]._id,
        course: courses[1]._id,
        college: colleges[0]._id,
        semester: 4,
        examType: 'Mid-Term',
        totalMarks: 100,
        obtainedMarks: 70,
        grade: 'B',
        gpa: 7.0,
      },
      {
        student: students[2]._id,
        course: courses[1]._id,
        college: colleges[0]._id,
        semester: 4,
        examType: 'End-Term',
        totalMarks: 100,
        obtainedMarks: 73,
        grade: 'B',
        gpa: 7.3,
      },
      {
        student: students[2]._id,
        course: courses[2]._id,
        college: colleges[0]._id,
        semester: 5,
        examType: 'Mid-Term',
        totalMarks: 100,
        obtainedMarks: 79,
        grade: 'B+',
        gpa: 7.9,
      },
      {
        student: students[2]._id,
        course: courses[6]._id,
        college: colleges[1]._id,
        semester: 3,
        examType: 'Assignment',
        totalMarks: 100,
        obtainedMarks: 84,
        grade: 'A',
        gpa: 8.4,
      },
      {
        student: students[2]._id,
        course: courses[7]._id,
        college: colleges[1]._id,
        semester: 2,
        examType: 'End-Term',
        totalMarks: 100,
        obtainedMarks: 80,
        grade: 'A',
        gpa: 8.0,
      },
      {
        student: students[2]._id,
        course: courses[8]._id,
        college: colleges[1]._id,
        semester: 4,
        examType: 'Mid-Term',
        totalMarks: 100,
        obtainedMarks: 81,
        grade: 'A',
        gpa: 8.1,
      },
      // David Brown - Business Student (Courses 2, 4, 5, 9)
      {
        student: students[3]._id,
        course: courses[2]._id,
        college: colleges[0]._id,
        semester: 5,
        examType: 'Mid-Term',
        totalMarks: 100,
        obtainedMarks: 72,
        grade: 'B',
        gpa: 7.2,
      },
      {
        student: students[3]._id,
        course: courses[3]._id,
        college: colleges[0]._id,
        semester: 2,
        examType: 'Quiz',
        totalMarks: 20,
        obtainedMarks: 14,
        grade: 'B+',
        gpa: 7.0,
      },
      {
        student: students[3]._id,
        course: courses[4]._id,
        college: colleges[0]._id,
        semester: 2,
        examType: 'End-Term',
        totalMarks: 100,
        obtainedMarks: 82,
        grade: 'A',
        gpa: 8.2,
      },
      {
        student: students[3]._id,
        course: courses[5]._id,
        college: colleges[0]._id,
        semester: 3,
        examType: 'Lab',
        totalMarks: 100,
        obtainedMarks: 85,
        grade: 'A',
        gpa: 8.5,
      },
      {
        student: students[3]._id,
        course: courses[9]._id,
        college: colleges[2]._id,
        semester: 4,
        examType: 'Assignment',
        totalMarks: 100,
        obtainedMarks: 88,
        grade: 'A',
        gpa: 8.8,
      },
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\n📧 Test Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🏛️  University Admin:');
    console.log('   Email: admin@university.edu');
    console.log('   Password: password123');
    console.log('\n🏫 College Admin (Engineering):');
    console.log('   Email: james@eng.edu');
    console.log('   Password: password123');
    console.log('\n👨‍🎓 Student:');
    console.log('   Email: alice@student.edu');
    console.log('   Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error('\n🔍 Troubleshooting:');
    console.error('1. Check .env file has MONGODB_URI');
    console.error('2. Verify MongoDB Atlas cluster is running');
    console.error('3. Ensure your IP is whitelisted in Network Access');
    console.error('4. Check internet connection');
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Main execution
(async () => {
  const connected = await connectDB();
  if (connected) {
    await seedData();
  } else {
    process.exit(1);
  }
})();
