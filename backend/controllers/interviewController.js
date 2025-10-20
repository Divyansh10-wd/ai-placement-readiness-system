const Interview = require('../models/Interview');
const OpenAI = require('openai');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const axios = require('axios');

// Configure multer for audio file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/audio');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg'];
    if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  }
});

exports.uploadAudio = upload;

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Debug: Log OpenAI initialization status
if (openai) {
  console.log('✅ OpenAI API initialized successfully');
} else {
  console.log('⚠️ OpenAI API key not found - using fallback mode');
}

// Debug: Log ElevenLabs initialization status
if (process.env.ELEVENLABS_API_KEY) {
  console.log('✅ ElevenLabs API key configured');
} else {
  console.log('⚠️ ElevenLabs API key not found');
}

// Question banks for fallback - Organized by specialization
const QUESTION_BANKS = {
  // Frontend Development
  frontend: {
    easy: [
      "What is the difference between let, const, and var in JavaScript?",
      "Explain the box model in CSS.",
      "What is the Virtual DOM in React?",
      "What are semantic HTML tags and why are they important?",
      "Explain the difference between == and === in JavaScript.",
      "What is event bubbling and event capturing?",
      "What are CSS flexbox and grid? When would you use each?",
      "Explain what props are in React.",
      "What is the purpose of the 'this' keyword in JavaScript?",
      "What are React hooks and why were they introduced?",
      "What is the difference between null and undefined in JavaScript?",
      "Explain what a callback function is.",
      "What are CSS preprocessors like SASS/SCSS?",
      "What is the difference between inline, block, and inline-block elements?",
      "Explain what the DOM is.",
      "What is the difference between synchronous and asynchronous code?",
      "What are arrow functions and how do they differ from regular functions?",
      "Explain what REST API is.",
      "What is the purpose of the key prop in React lists?",
      "What are template literals in JavaScript?"
    ],
    medium: [
      "Explain the concept of closures in JavaScript with an example.",
      "What is the difference between controlled and uncontrolled components in React?",
      "How does React's reconciliation algorithm work?",
      "Explain CSS specificity and how it's calculated.",
      "What are Higher-Order Components (HOCs) in React?",
      "Describe how you would optimize a React application's performance.",
      "Explain the concept of debouncing and throttling with examples.",
      "What is the difference between localStorage, sessionStorage, and cookies?",
      "How would you implement lazy loading in a React application?",
      "Explain the concept of state management and when you'd use Redux vs Context API.",
      "What is the difference between useMemo and useCallback hooks?",
      "Explain how JavaScript's prototype chain works.",
      "What are Web Workers and when would you use them?",
      "How does CSS Grid differ from Flexbox? When would you use each?",
      "Explain the concept of code splitting in React.",
      "What is the difference between shallow and deep comparison in React?",
      "How would you handle forms in React efficiently?",
      "Explain the concept of memoization in React.",
      "What are custom hooks and how do you create them?",
      "How would you implement authentication in a React application?"
    ],
    hard: [
      "Design a complex form with nested validation in React. Explain your approach.",
      "How would you implement server-side rendering (SSR) in a React application?",
      "Explain micro-frontends architecture and its trade-offs.",
      "Design a custom React hook for handling complex async operations with caching.",
      "How would you optimize bundle size in a large React application?",
      "Implement a virtual scrolling solution for rendering 100,000 items efficiently.",
      "Design a state management solution for a complex multi-tenant application.",
      "How would you implement real-time collaborative editing like Google Docs?",
      "Explain how you'd handle authentication and authorization in a SPA.",
      "Design a progressive web app (PWA) with offline capabilities.",
      "How would you implement a custom rendering engine in React?",
      "Design a cross-browser compatible solution for complex animations.",
      "Explain how you'd implement incremental static regeneration in Next.js.",
      "How would you build a design system with theming support?",
      "Design a solution for handling complex state synchronization across tabs.",
      "How would you implement a custom virtual DOM from scratch?",
      "Explain your approach to building an accessible component library.",
      "Design a solution for optimizing images and assets in a large application.",
      "How would you implement error boundaries and error tracking in production?",
      "Design a microfrontend architecture with shared dependencies."
    ]
  },
  
  // Backend Development
  backend: {
    easy: [
      "Explain what a REST API is and its key principles.",
      "What are the main differences between HTTP and HTTPS?",
      "What is the difference between authentication and authorization?",
      "Explain what Git is and why it's useful.",
      "What are HTTP status codes? Name some common ones.",
      "What is the difference between SQL and NoSQL databases?",
      "Explain what middleware is in Express.js.",
      "What is CORS and why is it important?",
      "What are environment variables and why do we use them?",
      "Explain the difference between GET and POST requests.",
      "What is an API endpoint?",
      "Explain what JSON is and why it's used.",
      "What is the purpose of package.json in Node.js?",
      "What are HTTP methods (verbs)?",
      "Explain what a database schema is.",
      "What is the difference between PUT and PATCH?",
      "What are cookies and sessions?",
      "Explain what npm is.",
      "What is the purpose of a .gitignore file?",
      "What is the difference between synchronous and asynchronous operations?"
    ],
    medium: [
      "Describe the event loop in Node.js and how it works.",
      "How would you implement authentication using JWT?",
      "Explain database indexing and when you should use it.",
      "What are database transactions and why are they important?",
      "How would you handle file uploads in a Node.js application?",
      "Explain the concept of connection pooling in databases.",
      "What are the differences between monolithic and microservices architecture?",
      "How would you implement rate limiting for an API?",
      "Explain caching strategies and when to use each.",
      "What is the N+1 query problem and how do you solve it?",
      "How would you implement pagination in an API?",
      "Explain the concept of database normalization.",
      "What are database joins and when would you use them?",
      "How would you handle errors in an Express.js application?",
      "Explain the concept of API versioning.",
      "What is the difference between SQL injection and XSS attacks?",
      "How would you implement search functionality in a database?",
      "Explain the concept of database replication.",
      "What are webhooks and how do they work?",
      "How would you implement logging in a Node.js application?"
    ],
    hard: [
      "Design a scalable API gateway for a microservices architecture.",
      "How would you implement a distributed transaction across multiple services?",
      "Explain database sharding strategies and their trade-offs.",
      "Design a real-time notification system that scales to millions of users.",
      "How would you implement eventual consistency in a distributed system?",
      "Design a job queue system with priority scheduling and retry logic.",
      "Explain how you'd handle database migrations in a zero-downtime deployment.",
      "Design a multi-tenant SaaS application with data isolation.",
      "How would you implement a distributed lock mechanism?",
      "Design a logging and monitoring system for microservices.",
      "How would you implement a circuit breaker pattern?",
      "Design a message queue system for asynchronous processing.",
      "Explain how you'd implement database connection pooling at scale.",
      "How would you design a rate limiting system using Redis?",
      "Design a caching layer with cache invalidation strategies.",
      "How would you implement distributed tracing across microservices?",
      "Design a backup and disaster recovery strategy for databases.",
      "Explain how you'd implement API throttling and quotas.",
      "How would you design a real-time analytics pipeline?",
      "Design a system for handling millions of concurrent WebSocket connections."
    ]
  },
  
  // DevOps
  devops: {
    easy: [
      "What is Docker and why is it useful?",
      "Explain the difference between a container and a virtual machine.",
      "What is CI/CD and why is it important?",
      "What is version control and why do we use Git?",
      "Explain what a load balancer does.",
      "What is the purpose of environment variables?",
      "What are the benefits of containerization?",
      "Explain what Kubernetes is in simple terms.",
      "What is the difference between horizontal and vertical scaling?",
      "What is a reverse proxy?",
      "What is a Docker image?",
      "Explain what a Dockerfile is.",
      "What is continuous integration?",
      "What are the benefits of version control?",
      "Explain what a container registry is.",
      "What is the purpose of Docker Compose?",
      "What is a deployment pipeline?",
      "Explain what infrastructure means in DevOps.",
      "What is the difference between staging and production environments?",
      "What are the main cloud providers?"
    ],
    medium: [
      "Explain the Docker build process and how layers work.",
      "How would you set up a CI/CD pipeline for a web application?",
      "What is Infrastructure as Code (IaC)? Give examples.",
      "Explain the concept of blue-green deployment.",
      "How does Kubernetes handle service discovery?",
      "What are Kubernetes pods, deployments, and services?",
      "Explain how you would monitor application health in production.",
      "What is the difference between ConfigMaps and Secrets in Kubernetes?",
      "How would you implement auto-scaling in a cloud environment?",
      "Explain the concept of immutable infrastructure.",
      "What is a Kubernetes ingress controller?",
      "How would you implement rolling updates in Kubernetes?",
      "Explain the concept of container orchestration.",
      "What are Kubernetes namespaces and why use them?",
      "How would you implement health checks in a containerized application?",
      "Explain the difference between Docker Swarm and Kubernetes.",
      "What is Terraform and how does it work?",
      "How would you implement canary deployments?",
      "Explain the concept of GitOps.",
      "What are Kubernetes StatefulSets and when would you use them?"
    ],
    hard: [
      "Design a zero-downtime deployment strategy for a critical production system.",
      "How would you implement a multi-region disaster recovery solution?",
      "Design a monitoring and alerting system for a microservices architecture.",
      "Explain how you'd implement security scanning in a CI/CD pipeline.",
      "Design a cost-optimization strategy for cloud infrastructure.",
      "How would you implement service mesh architecture? Discuss trade-offs.",
      "Design a backup and recovery strategy for a distributed database.",
      "Explain how you'd handle secrets management at scale.",
      "Design a logging aggregation system for distributed services.",
      "How would you implement chaos engineering in production?",
      "Design a multi-cluster Kubernetes architecture with federation.",
      "How would you implement automated compliance checking in infrastructure?",
      "Design a self-healing infrastructure system.",
      "Explain how you'd implement progressive delivery at scale.",
      "Design a container security scanning and policy enforcement system.",
      "How would you implement cross-region data replication with minimal latency?",
      "Design an automated incident response system.",
      "Explain how you'd implement infrastructure drift detection and remediation.",
      "Design a multi-cloud deployment strategy with failover.",
      "How would you implement automated performance testing in CI/CD?"
    ]
  },
  
  // Python & Data Science
  python: {
    easy: [
      "What are the differences between lists and tuples in Python?",
      "Explain what list comprehensions are and give an example.",
      "What is the difference between a function and a method in Python?",
      "Explain the concept of decorators in Python.",
      "What are *args and **kwargs used for?",
      "What is the difference between is and == in Python?",
      "Explain what a lambda function is.",
      "What are Python generators and why are they useful?",
      "What is the Global Interpreter Lock (GIL)?",
      "Explain the difference between shallow and deep copy.",
      "What are Python dictionaries and how do they work?",
      "Explain what the __init__ method does.",
      "What is the difference between append() and extend() in lists?",
      "What are Python sets and when would you use them?",
      "Explain what the range() function does.",
      "What is the difference between break and continue?",
      "What are Python modules and packages?",
      "Explain what try-except blocks are used for.",
      "What is the purpose of the __name__ == '__main__' check?",
      "What are f-strings in Python?"
    ],
    medium: [
      "How does Python's garbage collection work?",
      "Explain the concept of context managers and the 'with' statement.",
      "What are metaclasses in Python?",
      "How would you implement a singleton pattern in Python?",
      "Explain the difference between @staticmethod and @classmethod.",
      "How does Python's import system work?",
      "What are Python descriptors and when would you use them?",
      "Explain asyncio and when you'd use it over threading.",
      "How would you optimize Python code for performance?",
      "What is the difference between multiprocessing and multithreading in Python?",
      "Explain the concept of duck typing in Python.",
      "What are Python iterators and how do you create them?",
      "How would you implement a custom exception class?",
      "Explain the concept of method resolution order (MRO).",
      "What are Python dataclasses and when would you use them?",
      "How would you implement a property with getter and setter?",
      "Explain the concept of monkey patching.",
      "What are Python's magic methods (dunder methods)?",
      "How would you implement a context manager from scratch?",
      "Explain the difference between __str__ and __repr__."
    ],
    hard: [
      "Design a custom ORM (Object-Relational Mapping) system in Python.",
      "Implement a distributed task queue system using Python.",
      "How would you implement a memory-efficient data processing pipeline for large datasets?",
      "Design a plugin architecture for a Python application.",
      "Explain how you'd implement a custom metaclass for validation.",
      "How would you build a Python package with C extensions for performance?",
      "Design a caching decorator with TTL and LRU eviction.",
      "Implement a coroutine-based web scraper with rate limiting.",
      "How would you profile and optimize a CPU-bound Python application?",
      "Design a distributed Python application using message queues.",
      "How would you implement a custom import hook?",
      "Design a type checking system for Python at runtime.",
      "Implement a memory profiler for Python applications.",
      "How would you create a Python DSL (Domain Specific Language)?",
      "Design an async web framework from scratch.",
      "Implement a bytecode optimizer for Python.",
      "How would you build a Python debugger?",
      "Design a distributed caching system using Python.",
      "Implement a custom garbage collector for specific use cases.",
      "How would you create a Python-based workflow engine?"
    ]
  },
  
  // Machine Learning
  machineLearning: {
    easy: [
      "What is the difference between supervised and unsupervised learning?",
      "Explain what overfitting and underfitting mean.",
      "What is the difference between classification and regression?",
      "What is a confusion matrix and what does it tell us?",
      "Explain the bias-variance tradeoff.",
      "What is cross-validation and why is it important?",
      "What is the difference between training, validation, and test sets?",
      "Explain what feature engineering is.",
      "What is regularization and why do we use it?",
      "What is the difference between L1 and L2 regularization?",
      "What is a neural network?",
      "Explain what an activation function is.",
      "What is the difference between a parameter and a hyperparameter?",
      "What is gradient descent?",
      "Explain what a loss function is.",
      "What is the purpose of normalization in ML?",
      "What is the difference between batch and online learning?",
      "Explain what feature scaling is.",
      "What is a learning rate?",
      "What is the difference between deep learning and machine learning?"
    ],
    medium: [
      "Explain how decision trees work and their advantages/disadvantages.",
      "What is the difference between bagging and boosting?",
      "How does gradient descent work? Explain variants like SGD and Adam.",
      "What is the curse of dimensionality?",
      "Explain how neural networks learn through backpropagation.",
      "What are precision, recall, and F1-score? When would you optimize for each?",
      "How would you handle imbalanced datasets?",
      "Explain the concept of transfer learning.",
      "What is the difference between batch normalization and layer normalization?",
      "How would you detect and handle outliers in your data?",
      "Explain the concept of ensemble learning.",
      "What are convolutional neural networks (CNNs) and when would you use them?",
      "Explain what recurrent neural networks (RNNs) are.",
      "What is dropout and why is it used?",
      "How would you handle missing data in a dataset?",
      "Explain the concept of dimensionality reduction.",
      "What is the difference between PCA and t-SNE?",
      "How would you evaluate a clustering algorithm?",
      "Explain what attention mechanisms are in neural networks.",
      "What is the difference between generative and discriminative models?"
    ],
    hard: [
      "Design a recommendation system for an e-commerce platform. Discuss cold-start problems.",
      "How would you deploy a machine learning model to production at scale?",
      "Explain how you'd implement A/B testing for ML models.",
      "Design a real-time fraud detection system using machine learning.",
      "How would you handle concept drift in a production ML system?",
      "Explain how you'd implement feature stores for ML pipelines.",
      "Design a multi-modal learning system (text + images).",
      "How would you implement model versioning and rollback strategies?",
      "Explain how you'd optimize inference latency for a deep learning model.",
      "Design an AutoML system for hyperparameter tuning.",
      "How would you implement federated learning for privacy-preserving ML?",
      "Design a real-time personalization engine at scale.",
      "Explain how you'd implement model monitoring and alerting in production.",
      "Design a distributed training system for large models.",
      "How would you implement online learning with model updates?",
      "Design a system for detecting and mitigating model bias.",
      "Explain how you'd implement explainable AI for black-box models.",
      "Design a reinforcement learning system for real-world applications.",
      "How would you implement model compression for edge deployment?",
      "Design a data labeling and quality assurance pipeline at scale."
    ]
  },
  
  // Behavioral (Enhanced)
  behavioral: {
    easy: [
      "Tell me about yourself and your background.",
      "What interests you about this role?",
      "Describe a recent project you worked on.",
      "What are your strengths and weaknesses?",
      "Where do you see yourself in 5 years?",
      "Why do you want to work for our company?",
      "What motivates you as a developer?",
      "How do you stay updated with new technologies?",
      "Describe your ideal work environment.",
      "What's your favorite programming language and why?",
      "What are you passionate about outside of work?",
      "Why did you choose a career in technology?",
      "What was your biggest achievement in your last role?",
      "How do you prioritize your work?",
      "What do you do when you're stuck on a problem?",
      "Describe your development workflow.",
      "What makes you a good team player?",
      "How do you handle stress?",
      "What's the most interesting technical challenge you've faced?",
      "Why are you looking for a new opportunity?"
    ],
    medium: [
      "Tell me about a time when you had to learn a new technology quickly.",
      "Describe a situation where you had to handle conflicting priorities.",
      "How do you handle feedback and criticism?",
      "Tell me about a time you worked with a difficult team member.",
      "Describe a situation where you had to make a decision with incomplete information.",
      "How do you approach debugging a complex issue?",
      "Tell me about a time you had to explain a technical concept to a non-technical person.",
      "Describe a situation where you had to meet a tight deadline.",
      "How do you handle disagreements about technical decisions?",
      "Tell me about a time you improved a process or system.",
      "Describe a time when you had to adapt to a major change.",
      "How do you mentor junior developers?",
      "Tell me about a time you received constructive criticism.",
      "Describe a situation where you had to compromise.",
      "How do you ensure code quality in your work?",
      "Tell me about a time you went above and beyond.",
      "Describe how you handle competing deadlines.",
      "How do you approach code reviews?",
      "Tell me about a time you had to learn from a mistake.",
      "Describe your experience with remote work or distributed teams."
    ],
    hard: [
      "Tell me about a time when you failed. What did you learn and how did you recover?",
      "Describe a situation where you had to influence others without authority.",
      "How have you handled a situation where your team disagreed with your technical approach?",
      "Tell me about the most complex problem you've solved. Walk me through your process.",
      "Describe a time when you had to balance technical debt with feature delivery.",
      "How have you handled a situation where you had to deliver bad news to stakeholders?",
      "Tell me about a time you had to make a difficult trade-off decision.",
      "Describe a situation where you had to lead a project without formal authority.",
      "How have you handled a major production incident?",
      "Tell me about a time you had to advocate for a controversial technical decision.",
      "Describe a situation where you had to manage up (influence senior leadership).",
      "How have you handled a situation where you disagreed with your manager?",
      "Tell me about a time you had to make an unpopular decision.",
      "Describe how you've handled a toxic team environment.",
      "How have you dealt with scope creep in a project?",
      "Tell me about a time you had to fire or let someone go.",
      "Describe a situation where you had to rebuild trust after a failure.",
      "How have you handled ethical concerns in your work?",
      "Tell me about a time you had to pivot a project mid-way.",
      "Describe your experience leading through organizational change."
    ]
  },
  
  // DBMS (Database Management Systems)
  dbms: {
    easy: [
      "What is a database and why do we use it?",
      "Explain the difference between SQL and NoSQL databases.",
      "What is a primary key?",
      "What is the difference between DELETE and TRUNCATE?",
      "Explain what a foreign key is.",
      "What is normalization in databases?",
      "What are the different types of SQL commands (DDL, DML, DCL)?",
      "Explain what a database schema is.",
      "What is the difference between WHERE and HAVING clauses?",
      "What is an index in a database?",
      "Explain what ACID properties are.",
      "What is the difference between INNER JOIN and OUTER JOIN?",
      "What is a view in SQL?",
      "Explain what a stored procedure is.",
      "What is the difference between CHAR and VARCHAR?",
      "What is a database transaction?",
      "Explain what NULL means in SQL.",
      "What is the difference between UNION and UNION ALL?",
      "What is a composite key?",
      "Explain what database constraints are."
    ],
    medium: [
      "Explain the different types of normalization (1NF, 2NF, 3NF, BCNF).",
      "What is denormalization and when would you use it?",
      "Explain the different types of database indexes (B-tree, Hash, Bitmap).",
      "What is a database deadlock and how do you prevent it?",
      "Explain the concept of database sharding.",
      "What are database triggers and when would you use them?",
      "Explain the difference between optimistic and pessimistic locking.",
      "What is database replication and what are its types?",
      "Explain the CAP theorem in the context of databases.",
      "What are the different isolation levels in transactions?",
      "How would you optimize a slow SQL query?",
      "Explain the concept of database partitioning.",
      "What is the N+1 query problem and how do you solve it?",
      "Explain what a clustered vs non-clustered index is.",
      "What are materialized views and when would you use them?",
      "Explain the concept of database connection pooling.",
      "What is the difference between horizontal and vertical partitioning?",
      "How do you handle database migrations in production?",
      "Explain what eventual consistency means.",
      "What are the different types of database relationships?"
    ],
    hard: [
      "Design a database schema for a social media platform like Twitter.",
      "How would you implement full-text search in a database?",
      "Explain how you'd design a multi-tenant database architecture.",
      "How would you implement database sharding with consistent hashing?",
      "Design a strategy for handling database schema evolution without downtime.",
      "Explain how you'd implement distributed transactions across multiple databases.",
      "How would you design a time-series database for IoT data?",
      "Design a caching strategy to reduce database load.",
      "How would you implement database backup and point-in-time recovery?",
      "Explain how you'd optimize a database for read-heavy workloads.",
      "Design a database replication strategy for global applications.",
      "How would you implement database encryption at rest and in transit?",
      "Explain how you'd handle database failover and high availability.",
      "Design a database indexing strategy for a large-scale application.",
      "How would you implement database auditing and compliance tracking?",
      "Explain how you'd design a graph database schema.",
      "How would you implement database query optimization at scale?",
      "Design a strategy for database capacity planning and scaling.",
      "Explain how you'd implement database monitoring and alerting.",
      "How would you design a polyglot persistence architecture?"
    ]
  },

  // Java Programming
  java: {
    easy: [
      "What is the difference between JDK, JRE, and JVM?",
      "Explain what a class and object are in Java.",
      "What is the difference between == and .equals() in Java?",
      "What are the main features of Java?",
      "Explain what inheritance is in Java.",
      "What is the difference between abstract class and interface?",
      "What is method overloading and overriding?",
      "Explain what encapsulation is.",
      "What is the purpose of the 'static' keyword?",
      "What is the difference between String, StringBuilder, and StringBuffer?",
      "Explain what a constructor is.",
      "What is the 'final' keyword used for?",
      "What is the difference between public, private, and protected?",
      "Explain what polymorphism is.",
      "What is the purpose of the 'super' keyword?",
      "What are wrapper classes in Java?",
      "Explain what an exception is.",
      "What is the difference between checked and unchecked exceptions?",
      "What is the purpose of the 'this' keyword?",
      "What is autoboxing and unboxing?"
    ],
    medium: [
      "Explain the Java memory model (heap vs stack).",
      "What is garbage collection and how does it work in Java?",
      "Explain the difference between ArrayList and LinkedList.",
      "What are Java generics and why are they useful?",
      "Explain the concept of Java streams and lambda expressions.",
      "What is the difference between Comparable and Comparator?",
      "Explain how HashMap works internally.",
      "What is the difference between synchronized and volatile?",
      "Explain the Java Collections Framework hierarchy.",
      "What are functional interfaces in Java 8?",
      "Explain the concept of Java annotations.",
      "What is the difference between fail-fast and fail-safe iterators?",
      "Explain how the try-with-resources statement works.",
      "What is the difference between Serializable and Externalizable?",
      "Explain the concept of Java reflection.",
      "What are the different types of inner classes in Java?",
      "Explain how the Java thread lifecycle works.",
      "What is the difference between wait() and sleep()?",
      "Explain the concept of Java design patterns (Singleton, Factory, etc.).",
      "What is the difference between ConcurrentHashMap and Hashtable?"
    ],
    hard: [
      "Explain how the Java garbage collector algorithms work (G1, ZGC, etc.).",
      "How would you implement a custom thread pool in Java?",
      "Design a LRU cache implementation in Java.",
      "Explain how you'd implement a producer-consumer pattern with blocking queues.",
      "How would you handle memory leaks in Java applications?",
      "Design a custom ClassLoader in Java.",
      "Explain how you'd implement a distributed lock using Java.",
      "How would you optimize Java application performance?",
      "Design a thread-safe singleton with lazy initialization.",
      "Explain how you'd implement custom serialization in Java.",
      "How would you design a connection pool from scratch?",
      "Explain the happens-before relationship in Java concurrency.",
      "How would you implement a custom annotation processor?",
      "Design a framework for dependency injection in Java.",
      "Explain how you'd implement weak references and memory management.",
      "How would you design a high-performance logging framework?",
      "Explain how you'd implement bytecode manipulation in Java.",
      "How would you design a distributed caching system in Java?",
      "Explain how you'd implement a custom garbage collector.",
      "How would you design a reactive programming framework in Java?"
    ]
  },

  // C++ Programming
  cpp: {
    easy: [
      "What is the difference between C and C++?",
      "Explain what a class and object are in C++.",
      "What is the difference between struct and class in C++?",
      "What are access specifiers in C++?",
      "Explain what a constructor and destructor are.",
      "What is the difference between new and malloc?",
      "What is a pointer in C++?",
      "Explain what a reference is.",
      "What is the difference between pass by value and pass by reference?",
      "What is function overloading?",
      "Explain what inheritance is.",
      "What is the purpose of the 'virtual' keyword?",
      "What is operator overloading?",
      "Explain what a namespace is.",
      "What is the difference between public, private, and protected inheritance?",
      "What is a friend function?",
      "Explain what the 'static' keyword does.",
      "What is the difference between ++i and i++?",
      "What is a copy constructor?",
      "Explain what the 'const' keyword means."
    ],
    medium: [
      "Explain the concept of RAII (Resource Acquisition Is Initialization).",
      "What is the difference between shallow copy and deep copy?",
      "Explain how virtual functions work (vtable, vptr).",
      "What is the difference between stack and heap memory?",
      "Explain the concept of smart pointers (unique_ptr, shared_ptr, weak_ptr).",
      "What is the Rule of Three/Five/Zero?",
      "Explain move semantics and rvalue references.",
      "What is the difference between abstract class and interface in C++?",
      "Explain template metaprogramming.",
      "What is the difference between function template and class template?",
      "Explain the concept of STL (Standard Template Library).",
      "What is the difference between vector and array?",
      "Explain how exception handling works in C++.",
      "What is the diamond problem in multiple inheritance?",
      "Explain the concept of lambda expressions in C++.",
      "What is the difference between map and unordered_map?",
      "Explain the concept of iterators in C++.",
      "What is the difference between const and constexpr?",
      "Explain the concept of type casting in C++.",
      "What is the difference between override and final keywords?"
    ],
    hard: [
      "Explain how you'd implement a memory pool allocator in C++.",
      "How would you design a thread-safe singleton in C++11?",
      "Implement a custom smart pointer with reference counting.",
      "Explain how you'd implement a lock-free queue in C++.",
      "How would you design a custom STL-like container?",
      "Explain template specialization and SFINAE.",
      "How would you implement perfect forwarding?",
      "Design a custom memory allocator with alignment requirements.",
      "Explain how you'd implement a compile-time expression evaluator.",
      "How would you design a type-safe printf using variadic templates?",
      "Explain how you'd implement a coroutine library in C++.",
      "How would you optimize C++ code for cache performance?",
      "Design a reflection system for C++.",
      "Explain how you'd implement a custom exception handling mechanism.",
      "How would you design a plugin architecture in C++?",
      "Explain how you'd implement zero-cost abstractions.",
      "How would you design a high-performance serialization library?",
      "Explain template metaprogramming for compile-time computation.",
      "How would you implement a custom RTTI system?",
      "Design a concurrent data structure library in C++."
    ]
  },

  // Object-Oriented Programming (OOPs)
  oops: {
    easy: [
      "What is Object-Oriented Programming?",
      "Explain the four pillars of OOP (Encapsulation, Inheritance, Polymorphism, Abstraction).",
      "What is a class?",
      "What is an object?",
      "Explain what encapsulation is.",
      "What is inheritance?",
      "Explain what polymorphism is.",
      "What is abstraction?",
      "What is the difference between class and object?",
      "What is a constructor?",
      "Explain what method overloading is.",
      "What is method overriding?",
      "What is the difference between abstract class and interface?",
      "Explain what access modifiers are.",
      "What is the purpose of the 'this' keyword?",
      "What is a destructor?",
      "Explain what static members are.",
      "What is the difference between composition and inheritance?",
      "What is a virtual function?",
      "Explain what multiple inheritance is."
    ],
    medium: [
      "Explain the SOLID principles in detail.",
      "What is the Liskov Substitution Principle?",
      "Explain the difference between composition and aggregation.",
      "What is the Open/Closed Principle?",
      "Explain the Dependency Inversion Principle.",
      "What is the Interface Segregation Principle?",
      "Explain the concept of coupling and cohesion.",
      "What is the difference between association and dependency?",
      "Explain the concept of design patterns.",
      "What is the Singleton pattern and when would you use it?",
      "Explain the Factory pattern.",
      "What is the Observer pattern?",
      "Explain the Strategy pattern.",
      "What is the Decorator pattern?",
      "Explain the difference between static and dynamic polymorphism.",
      "What is the Template Method pattern?",
      "Explain the concept of object composition.",
      "What is the difference between early binding and late binding?",
      "Explain the concept of abstract factory pattern.",
      "What is the difference between shallow and deep inheritance?"
    ],
    hard: [
      "Design a parking lot system using OOP principles.",
      "How would you implement a chess game using OOP?",
      "Design an elevator system with OOP concepts.",
      "Explain how you'd design a library management system.",
      "How would you implement a hotel booking system using OOP?",
      "Design a file system using object-oriented principles.",
      "Explain how you'd design a social media platform with OOP.",
      "How would you implement a restaurant management system?",
      "Design a movie ticket booking system using OOP.",
      "Explain how you'd design an ATM system.",
      "How would you implement a vehicle rental system?",
      "Design a hospital management system with OOP principles.",
      "Explain how you'd design a university course registration system.",
      "How would you implement a shopping cart system?",
      "Design a traffic signal control system using OOP.",
      "Explain how you'd design a music streaming service.",
      "How would you implement a ride-sharing application?",
      "Design a food delivery system with OOP concepts.",
      "Explain how you'd design a banking system.",
      "How would you implement a game engine architecture using OOP?"
    ]
  },

  // System Design (Enhanced)
  systemDesign: {
    easy: [
      "Design a simple URL shortener.",
      "How would you design a basic chat application?",
      "Design a file storage system like Dropbox.",
      "How would you design a simple notification system?",
      "Design a basic e-commerce product catalog.",
      "Design a parking lot management system.",
      "How would you design a simple rate limiter?",
      "Design a basic todo list application with sharing.",
      "How would you design a simple voting system?",
      "Design a basic blog platform.",
      "Design a simple image upload and storage service.",
      "How would you design a basic authentication system?",
      "Design a simple calendar application.",
      "How would you design a basic search functionality?",
      "Design a simple comment system for a website.",
      "How would you design a basic analytics dashboard?",
      "Design a simple email subscription service.",
      "How would you design a basic inventory management system?",
      "Design a simple payment gateway integration.",
      "How would you design a basic user profile system?"
    ],
    medium: [
      "Design Instagram's feed system.",
      "How would you design a ride-sharing service like Uber?",
      "Design a distributed task scheduler.",
      "How would you design a content delivery network (CDN)?",
      "Design a real-time leaderboard system for a game.",
      "How would you design Twitter's timeline?",
      "Design a hotel booking system like Booking.com.",
      "How would you design a food delivery app like DoorDash?",
      "Design a collaborative document editing system.",
      "How would you design a music streaming service?",
      "Design a social media news feed with ranking.",
      "How would you design a video conferencing system like Zoom?",
      "Design a distributed caching system.",
      "How would you design a job scheduling system?",
      "Design an e-commerce checkout system.",
      "How would you design a notification service with multiple channels?",
      "Design a real-time analytics system.",
      "How would you design a content moderation system?",
      "Design a distributed logging system.",
      "How would you design a multi-player game matchmaking system?"
    ],
    hard: [
      "Design YouTube's video streaming infrastructure.",
      "How would you design Google Search?",
      "Design a global-scale messaging system like WhatsApp.",
      "How would you design Netflix's recommendation system?",
      "Design a distributed database system with strong consistency.",
      "How would you design Amazon's order fulfillment system?",
      "Design a real-time multiplayer game infrastructure.",
      "How would you design a stock trading platform?",
      "Design a global payment processing system like Stripe.",
      "How would you design a distributed file system like HDFS?",
      "Design a global-scale social network like Facebook.",
      "How would you design a real-time bidding system for ads?",
      "Design a distributed transaction system across microservices.",
      "How would you design a global DNS system?",
      "Design a real-time fraud detection system.",
      "How would you design a distributed consensus system?",
      "Design a global load balancing system.",
      "How would you design a time-series database for metrics?",
      "Design a distributed search engine.",
      "How would you design a global event streaming platform?"
    ]
  }
};

// Generate AI-powered question
const generateAIQuestion = async (type, difficulty, context = '', previousQuestions = []) => {
  if (!openai) {
    // Fallback to question bank
    const questions = QUESTION_BANKS[type]?.[difficulty] || QUESTION_BANKS.frontend?.[difficulty] || QUESTION_BANKS.frontend.medium;
    const available = questions.filter(q => !previousQuestions.includes(q));
    return available[Math.floor(Math.random() * available.length)] || questions[0];
  }

  try {
    const systemPrompt = `You are an expert technical interviewer conducting a ${type} interview at ${difficulty} difficulty level. 
Generate ONE insightful interview question that:
- Is appropriate for the difficulty level
- Builds on previous context if provided
- Tests practical knowledge and problem-solving
- Is clear and specific
${context ? `\nContext from previous answers: ${context}` : ''}
${previousQuestions.length > 0 ? `\nAvoid repeating these topics: ${previousQuestions.join(', ')}` : ''}

Return ONLY the question, nothing else.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a ${type} interview question.` }
      ],
      temperature: 0.8,
      max_tokens: 150
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI error:', error.message);
    // Fallback to question bank
    const questions = QUESTION_BANKS[type]?.[difficulty] || QUESTION_BANKS.technical.medium;
    return questions[Math.floor(Math.random() * questions.length)];
  }
};

// Evaluate answer with AI
const evaluateAnswer = async (question, answer, type) => {
  if (!openai) {
    // Simple fallback evaluation
    const wordCount = answer.split(' ').length;
    const score = Math.min(10, Math.max(3, Math.floor(wordCount / 10)));
    return {
      score,
      feedback: `Your answer was ${wordCount} words. ${score >= 7 ? 'Good detail!' : 'Try to provide more detail.'}`
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert interviewer evaluating a ${type} interview answer. 
Provide:
1. A score from 1-10
2. Constructive feedback (2-3 sentences)
3. One specific improvement suggestion

Format: Score: X/10\nFeedback: ...\nImprovement: ...`
        },
        {
          role: 'user',
          content: `Question: ${question}\n\nCandidate's Answer: ${answer}\n\nEvaluate this answer.`
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const evaluation = response.choices[0].message.content;
    const scoreMatch = evaluation.match(/Score:\s*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 5;
    
    return {
      score,
      feedback: evaluation
    };
  } catch (error) {
    console.error('Evaluation error:', error.message);
    return {
      score: 5,
      feedback: 'Unable to evaluate at this time. Please continue with the interview.'
    };
  }
};

// Start new interview
exports.startInterview = async (req, res) => {
  try {
    const { type = 'technical', difficulty = 'medium' } = req.body;
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.user.id;
    const userName = req.user.name;

    console.log('Starting interview:', { userId, userName, type, difficulty });

    // Generate first question before creating interview
    const firstQuestion = await generateAIQuestion(type, difficulty);
    
    if (!firstQuestion) {
      return res.status(500).json({ message: 'Failed to generate question' });
    }

    const interview = new Interview({
      userId,
      userName,
      type,
      difficulty,
      status: 'in-progress',
      questions: []
    });

    await interview.save();
    console.log('Interview created:', interview._id);

    res.json({
      interviewId: interview._id,
      question: firstQuestion,
      type,
      difficulty
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ message: 'Failed to start interview', error: error.message });
  }
};

// Submit answer and get next question
exports.submitAnswer = async (req, res) => {
  try {
    const { interviewId, question, answer } = req.body;

    if (!answer || answer.trim().length < 10) {
      return res.status(400).json({ message: 'Answer is too short. Please provide more detail.' });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Evaluate the answer
    const evaluation = await evaluateAnswer(question, answer, interview.type);

    // Save question and answer
    interview.questions.push({
      question,
      answer,
      feedback: evaluation.feedback,
      score: evaluation.score,
      timestamp: new Date()
    });

    await interview.save();

    // Check if interview should continue (max 10 questions)
    if (interview.questions.length >= 10) {
      return res.json({
        completed: true,
        evaluation,
        message: 'Interview completed! Calculating final score...'
      });
    }

    // Generate next question with context
    const previousQuestions = interview.questions.map(q => q.question);
    const context = answer.substring(0, 200); // Use part of answer for context
    const nextQuestion = await generateAIQuestion(
      interview.type,
      interview.difficulty,
      context,
      previousQuestions
    );

    res.json({
      completed: false,
      evaluation,
      nextQuestion,
      questionNumber: interview.questions.length + 1,
      totalQuestions: 10
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit answer', error: error.message });
  }
};

// Complete interview and get final report
exports.completeInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Calculate overall score
    const totalScore = interview.questions.reduce((sum, q) => sum + (q.score || 0), 0);
    const avgScore = interview.questions.length > 0 ? totalScore / interview.questions.length : 0;

    // Generate overall feedback
    let overallFeedback = '';
    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert career coach providing interview feedback.'
            },
            {
              role: 'user',
              content: `Provide overall feedback for a ${interview.type} interview. Average score: ${avgScore.toFixed(1)}/10. Number of questions: ${interview.questions.length}. Give 3-4 sentences with specific improvement areas.`
            }
          ],
          temperature: 0.7,
          max_tokens: 200
        });
        overallFeedback = response.choices[0].message.content;
      } catch (error) {
        console.error('Feedback generation error:', error.message);
      }
    }

    if (!overallFeedback) {
      overallFeedback = avgScore >= 7 
        ? 'Strong performance! You demonstrated good knowledge and communication skills.'
        : avgScore >= 5
        ? 'Decent performance with room for improvement. Focus on providing more detailed answers.'
        : 'Keep practicing! Review fundamental concepts and work on articulating your thoughts clearly.';
    }

    interview.status = 'completed';
    interview.overallScore = avgScore;
    interview.overallFeedback = overallFeedback;
    interview.completedAt = new Date();
    interview.duration = Math.floor((interview.completedAt - interview.createdAt) / 1000);

    await interview.save();

    res.json({
      overallScore: avgScore.toFixed(1),
      overallFeedback,
      totalQuestions: interview.questions.length,
      duration: interview.duration,
      questions: interview.questions.map(q => ({
        question: q.question,
        answer: q.answer,
        score: q.score,
        feedback: q.feedback
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete interview', error: error.message });
  }
};

// Get interview history
exports.getInterviewHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const interviews = await Interview.find({ userId })
      .sort({ createdAt: -1 })
      .select('type difficulty status overallScore createdAt completedAt duration questions');

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch history', error: error.message });
  }
};

// Get single interview details
exports.getInterviewDetails = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch interview', error: error.message });
  }
};

// Speech-to-Text: Convert audio to text
exports.speechToText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file provided' });
    }

    if (!openai) {
      return res.status(503).json({ message: 'OpenAI API not configured' });
    }

    const audioFilePath = req.file.path;
    console.log('Processing audio file:', audioFilePath);

    // Use OpenAI Whisper API for transcription
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: 'whisper-1',
      language: 'en'
    });

    // Clean up the uploaded file
    fs.unlinkSync(audioFilePath);

    res.json({
      text: transcription.text,
      success: true
    });
  } catch (error) {
    console.error('Speech-to-text error:', error);
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      message: 'Failed to transcribe audio', 
      error: error.message 
    });
  }
};

// Text-to-Speech: Convert text to audio using ElevenLabs
exports.textToSpeech = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'No text provided' });
    }

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    
    if (!ELEVENLABS_API_KEY) {
      return res.status(503).json({ message: 'ElevenLabs API not configured' });
    }

    console.log('Converting text to speech with ElevenLabs:', text.substring(0, 50) + '...');

    // ElevenLabs voice ID (Rachel - natural female voice)
    // You can find more voices at: https://api.elevenlabs.io/v1/voices
    const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel voice

    // Call ElevenLabs API
    const response = await axios({
      method: 'post',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      data: {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      },
      responseType: 'arraybuffer'
    });

    // Set headers for audio streaming
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': response.data.length,
      'Cache-Control': 'no-cache'
    });

    res.send(Buffer.from(response.data));
  } catch (error) {
    console.error('ElevenLabs TTS error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to generate speech', 
      error: error.message 
    });
  }
};
