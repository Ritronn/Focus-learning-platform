import React, { useState, useEffect } from 'react';
import { BookOpen, Play, CheckCircle, Clock, Star, FileText, Video, Gamepad2 } from 'lucide-react';

const Courses = ({ userPreferences }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [courseProgress, setCourseProgress] = useState({});

  // Mock courses based on user preferences
  const courses = [
    {
      id: 'java',
      title: 'Learn Java Programming',
      description: 'Master Java from basics to advanced concepts',
      duration: '8 weeks',
      lessons: 24,
      difficulty: 'Beginner',
      rating: 4.8,
      format: userPreferences?.studyHabits?.includes('pdf') ? 'PDF' : 
              userPreferences?.studyHabits?.includes('video') ? 'Video' : 'Interactive',
      progress: 35,
      thumbnail: '☕',
      lessons_data: [
        {
          id: 1,
          title: 'Introduction to Java',
          type: 'theory',
          duration: '15 min',
          completed: true,
          content: {
            text: `# Introduction to Java

Java is a high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible.

## Key Features:
- **Platform Independent**: Write once, run anywhere
- **Object-Oriented**: Everything is an object
- **Secure**: Built-in security features
- **Robust**: Strong memory management

## Your First Java Program:
\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

This simple program demonstrates the basic structure of a Java application.`,
            quiz: [
              {
                question: "What makes Java platform independent?",
                options: ["JVM", "Compiler", "IDE", "Operating System"],
                correct: 0
              }
            ]
          }
        },
        {
          id: 2,
          title: 'Variables and Data Types',
          type: 'interactive',
          duration: '20 min',
          completed: true,
          content: {
            text: `# Variables and Data Types in Java

Variables are containers for storing data values. Java has different types of variables and data types.

## Primitive Data Types:
- **int**: Integer numbers (4 bytes)
- **double**: Decimal numbers (8 bytes)
- **boolean**: true/false values
- **char**: Single characters

## Variable Declaration:
\`\`\`java
int age = 25;
double price = 99.99;
boolean isActive = true;
char grade = 'A';
\`\`\``,
            interactive: {
              type: 'code-editor',
              challenge: 'Declare variables for a student: name (String), age (int), and GPA (double)',
              solution: `String name = "John Doe";
int age = 20;
double gpa = 3.85;`
            },
            quiz: [
              {
                question: "Which data type is used for decimal numbers?",
                options: ["int", "double", "boolean", "char"],
                correct: 1
              }
            ]
          }
        },
        {
          id: 3,
          title: 'Control Structures',
          type: 'theory',
          duration: '25 min',
          completed: false,
          content: {
            text: `# Control Structures in Java

Control structures determine the flow of program execution.

## If-Else Statements:
\`\`\`java
if (age >= 18) {
    System.out.println("You are an adult");
} else {
    System.out.println("You are a minor");
}
\`\`\`

## Loops:
### For Loop:
\`\`\`java
for (int i = 0; i < 5; i++) {
    System.out.println("Count: " + i);
}
\`\`\`

### While Loop:
\`\`\`java
int count = 0;
while (count < 5) {
    System.out.println("Count: " + count);
    count++;
}
\`\`\``,
            quiz: [
              {
                question: "Which loop executes at least once?",
                options: ["for", "while", "do-while", "enhanced for"],
                correct: 2
              }
            ]
          }
        }
      ]
    },
    {
      id: 'python',
      title: 'Python for Beginners',
      description: 'Learn Python programming from scratch',
      duration: '6 weeks',
      lessons: 18,
      difficulty: 'Beginner',
      rating: 4.9,
      format: userPreferences?.studyHabits?.includes('video') ? 'Video' : 
              userPreferences?.studyHabits?.includes('interactive') ? 'Interactive' : 'PDF',
      progress: 60,
      thumbnail: '🐍',
      lessons_data: [
        {
          id: 1,
          title: 'Python Basics',
          type: 'theory',
          duration: '12 min',
          completed: true,
          content: {
            text: `# Python Basics

Python is a high-level, interpreted programming language known for its simplicity and readability.

## Key Features:
- **Easy to Learn**: Simple syntax
- **Versatile**: Web development, data science, AI
- **Large Community**: Extensive libraries
- **Cross-platform**: Runs on any OS

## Your First Python Program:
\`\`\`python
print("Hello, World!")
\`\`\`

## Variables in Python:
\`\`\`python
name = "Alice"
age = 25
height = 5.6
is_student = True
\`\`\``,
            quiz: [
              {
                question: "What function is used to display output in Python?",
                options: ["display()", "print()", "show()", "output()"],
                correct: 1
              }
            ]
          }
        },
        {
          id: 2,
          title: 'Lists and Dictionaries',
          type: 'interactive',
          duration: '18 min',
          completed: true,
          content: {
            text: `# Lists and Dictionaries

Python provides powerful data structures for organizing information.

## Lists:
\`\`\`python
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]
mixed = ["hello", 42, True, 3.14]
\`\`\`

## Dictionaries:
\`\`\`python
student = {
    "name": "John",
    "age": 20,
    "grade": "A"
}
\`\`\``,
            interactive: {
              type: 'code-editor',
              challenge: 'Create a list of your favorite colors and a dictionary with your personal info',
              solution: `colors = ["blue", "green", "red"]
person = {
    "name": "Your Name",
    "age": 25,
    "city": "Your City"
}`
            },
            quiz: [
              {
                question: "How do you access a dictionary value?",
                options: ["dict[key]", "dict.key", "dict->key", "dict(key)"],
                correct: 0
              }
            ]
          }
        }
      ]
    }
  ];

  useEffect(() => {
    // Load course progress from localStorage
    const savedProgress = localStorage.getItem('courseProgress');
    if (savedProgress) {
      setCourseProgress(JSON.parse(savedProgress));
    }
  }, []);

  const startLesson = (course, lesson) => {
    setSelectedCourse(course);
    setCurrentLesson(lesson);
  };

  const completeLesson = (courseId, lessonId) => {
    const newProgress = { ...courseProgress };
    if (!newProgress[courseId]) {
      newProgress[courseId] = {};
    }
    newProgress[courseId][lessonId] = true;
    setCourseProgress(newProgress);
    localStorage.setItem('courseProgress', JSON.stringify(newProgress));
  };

  const getFormatIcon = (format) => {
    switch(format) {
      case 'PDF': return <FileText className="w-4 h-4" />;
      case 'Video': return <Video className="w-4 h-4" />;
      case 'Interactive': return <Gamepad2 className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  if (currentLesson) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Lesson Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
            <button
              onClick={() => setCurrentLesson(null)}
              className="text-white hover:text-gray-200 mb-4"
            >
              ← Back to Course
            </button>
            <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
            <div className="flex items-center space-x-4 text-sm opacity-90">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{currentLesson.duration}</span>
              </span>
              <span className="capitalize">{currentLesson.type}</span>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="p-6">
            <div className="prose max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ 
                __html: currentLesson.content.text.replace(/\n/g, '<br>').replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code>$2</code></pre>').replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded">$1</code>').replace(/## (.*)/g, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>').replace(/# (.*)/g, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/- \*\*(.*?)\*\*: (.*)/g, '<li><strong>$1</strong>: $2</li>')
              }} />
            </div>

            {/* Interactive Component */}
            {currentLesson.content.interactive && (
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-blue-800 mb-4">Interactive Challenge</h3>
                <p className="text-blue-700 mb-4">{currentLesson.content.interactive.challenge}</p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="text-gray-400 mb-2">{'// Your solution:'}</div>
                  <pre>{currentLesson.content.interactive.solution}</pre>
                </div>
              </div>
            )}

            {/* Quiz */}
            {currentLesson.content.quiz && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Quiz</h3>
                {currentLesson.content.quiz.map((q, index) => (
                  <div key={index} className="mb-4">
                    <p className="font-medium text-gray-700 mb-3">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((option, optIndex) => (
                        <label key={optIndex} className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" name={`quiz-${index}`} className="text-indigo-600" />
                          <span className="text-gray-600">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Complete Lesson Button */}
            <button
              onClick={() => {
                completeLesson(selectedCourse.id, currentLesson.id);
                setCurrentLesson(null);
              }}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Complete Lesson</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AI-Generated Courses</h1>
        <p className="text-gray-600">Personalized learning paths based on your preferences</p>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">{course.thumbnail}</div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">{course.title}</h3>
                    <p className="text-gray-600 text-sm">{course.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">{course.rating}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </span>
                <span>{course.lessons} lessons</span>
                <span className="flex items-center space-x-1">
                  {getFormatIcon(course.format)}
                  <span>{course.format}</span>
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {course.difficulty}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCourse(course)}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Continue Learning
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Details */}
      {selectedCourse && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{selectedCourse.title}</h2>
            <button
              onClick={() => setSelectedCourse(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-gray-800 mb-4">Course Lessons</h3>
              <div className="space-y-3">
                {selectedCourse.lessons_data.map((lesson) => (
                  <div 
                    key={lesson.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {lesson.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-800">{lesson.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{lesson.duration}</span>
                          <span>•</span>
                          <span className="capitalize">{lesson.type}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => startLesson(selectedCourse, lesson)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>{lesson.completed ? 'Review' : 'Start'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Course Stats</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-medium">{selectedCourse.progress}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Format</span>
                    <span className="font-medium">{selectedCourse.format}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{selectedCourse.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Lessons</span>
                    <span className="font-medium">{selectedCourse.lessons}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;