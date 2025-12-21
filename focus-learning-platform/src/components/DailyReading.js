import React, { useState, useEffect } from 'react';
import { BookOpen, Flame, Calendar, Clock, Star, CheckCircle } from 'lucide-react';

const DailyReading = ({ userPreferences }) => {
  const [currentStreak, setCurrentStreak] = useState(7);
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  const readingContent = {
    ai: {
      title: "The Future of AI in Education",
      content: `# The Future of AI in Education: Transforming Learning Experiences

Artificial Intelligence is revolutionizing the educational landscape, creating personalized learning experiences that adapt to individual student needs. From intelligent tutoring systems to automated grading, AI is making education more accessible and effective.

## Key Developments in AI Education:

**Personalized Learning Paths**: AI algorithms analyze student performance and learning patterns to create customized curricula. This ensures that each learner progresses at their optimal pace, focusing on areas that need improvement while accelerating through concepts they've mastered.

**Intelligent Content Creation**: Modern AI systems can generate educational content, quizzes, and even interactive simulations tailored to specific learning objectives. This reduces the burden on educators while ensuring content remains fresh and relevant.

**Real-time Feedback Systems**: AI-powered platforms provide instant feedback on assignments and assessments, helping students understand mistakes immediately rather than waiting for manual grading.

## The Impact on Traditional Education:

Educational institutions are increasingly adopting AI tools to enhance classroom experiences. Virtual teaching assistants can answer student questions 24/7, while predictive analytics help identify students at risk of falling behind.

However, the integration of AI in education also raises important questions about data privacy, the role of human teachers, and ensuring equitable access to these advanced technologies.

## Looking Ahead:

As AI continues to evolve, we can expect even more sophisticated educational tools that understand not just what students learn, but how they learn best. The future of education is becoming increasingly personalized, adaptive, and intelligent.`,
      readTime: "3 min read",
      category: "Technology"
    },
    cars: {
      title: "Electric Vehicle Revolution: What's Next?",
      content: `# Electric Vehicle Revolution: What's Next in Automotive Innovation?

The automotive industry is experiencing its most significant transformation since the invention of the internal combustion engine. Electric vehicles (EVs) are no longer a niche market but are rapidly becoming mainstream, driven by technological advances and environmental concerns.

## Current Market Trends:

**Battery Technology Breakthroughs**: Modern EV batteries offer longer ranges and faster charging times. Companies like Tesla, BYD, and traditional automakers are investing billions in battery research, with solid-state batteries promising even greater improvements.

**Charging Infrastructure Expansion**: Governments and private companies worldwide are rapidly expanding charging networks. Fast-charging stations can now add hundreds of miles of range in just 15-30 minutes.

**Price Parity Achievement**: EVs are approaching price parity with traditional vehicles, making them accessible to a broader market. Government incentives and decreasing battery costs are accelerating this trend.

## Autonomous Driving Integration:

Electric vehicles are becoming the preferred platform for autonomous driving technology. The combination of electric powertrains and AI-driven systems is creating vehicles that are not just environmentally friendly but also safer and more efficient.

## Challenges and Opportunities:

While the EV revolution is accelerating, challenges remain. Grid capacity, raw material sourcing for batteries, and the need for skilled technicians are areas requiring attention.

## The Road Ahead:

Industry experts predict that by 2030, electric vehicles will dominate new car sales in many markets. This shift represents not just a change in how we power our vehicles, but a fundamental reimagining of transportation itself.`,
      readTime: "4 min read",
      category: "Automotive"
    }
  };

  const streakData = [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: true },
    { day: 'Fri', completed: true },
    { day: 'Sat', completed: true },
    { day: 'Sun', completed: false }
  ];

  const completeReading = () => {
    setTodayCompleted(true);
    setCurrentStreak(prev => prev + 1);
    localStorage.setItem('readingStreak', (currentStreak + 1).toString());
    localStorage.setItem('lastReadingDate', new Date().toDateString());
  };

  useEffect(() => {
    const savedStreak = localStorage.getItem('readingStreak');
    const lastReadingDate = localStorage.getItem('lastReadingDate');
    
    if (savedStreak) {
      setCurrentStreak(parseInt(savedStreak));
    }
    
    if (lastReadingDate === new Date().toDateString()) {
      setTodayCompleted(true);
    }
  }, []);

  const currentContent = readingContent[userPreferences?.readingCategory || 'ai'];

  if (selectedContent) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
            <button
              onClick={() => setSelectedContent(null)}
              className="text-white hover:text-gray-200 mb-4"
            >
              ← Back to Reading
            </button>
            <h1 className="text-2xl font-bold mb-2">{selectedContent.title}</h1>
            <div className="flex items-center space-x-4 text-sm opacity-90">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{selectedContent.readTime}</span>
              </span>
              <span>{selectedContent.category}</span>
            </div>
          </div>

          <div className="p-6">
            <div className="prose max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ 
                __html: selectedContent.content
                  .replace(/\n/g, '<br>')
                  .replace(/# (.*)/g, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
                  .replace(/## (.*)/g, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }} />
            </div>

            {!todayCompleted && (
              <button
                onClick={completeReading}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Mark as Read</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Reading</h1>
        <p className="text-gray-600">Build a consistent reading habit with curated content</p>
      </div>

      {/* Streak Display */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Flame className="w-8 h-8" />
              <span className="text-3xl font-bold">{currentStreak}</span>
            </div>
            <h2 className="text-xl font-semibold">Day Streak</h2>
            <p className="opacity-90">Keep it going! 🔥</p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90 mb-2">This Week</div>
            <div className="flex space-x-2">
              {streakData.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs mb-1">{day.day}</div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    day.completed ? 'bg-white text-orange-500' : 'bg-orange-400'
                  }`}>
                    {day.completed ? '🔥' : '○'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Reading */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Today's Reading</h2>
          {todayCompleted && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Completed</span>
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{currentContent.title}</h3>
              <p className="text-gray-600 mb-4">
                {currentContent.content.substring(0, 200)}...
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{currentContent.readTime}</span>
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {currentContent.category}
                </span>
              </div>
            </div>
            <BookOpen className="w-12 h-12 text-blue-500 ml-4" />
          </div>

          <button
            onClick={() => setSelectedContent(currentContent)}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              todayCompleted 
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {todayCompleted ? 'Read Again' : 'Start Reading'}
          </button>
        </div>
      </div>

      {/* Reading Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <Calendar className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-800 mb-1">30</div>
          <div className="text-gray-600">Days This Month</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-800 mb-1">15</div>
          <div className="text-gray-600">Longest Streak</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-800 mb-1">127</div>
          <div className="text-gray-600">Articles Read</div>
        </div>
      </div>
    </div>
  );
};

export default DailyReading;