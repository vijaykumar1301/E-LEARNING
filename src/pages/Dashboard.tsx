import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLearning } from '@/contexts/LearningContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Play, 
  Filter,
  Calendar,
  Target,
  Award
} from 'lucide-react';

const Dashboard = () => {
  const { courses, enrolledCourses, progress } = useLearning();
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  const enrolledCoursesData = courses.filter(course => enrolledCourses.includes(course.id));
  
  const stats = {
    totalEnrolled: enrolledCourses.length,
    inProgress: Object.values(progress).filter(p => p.totalProgress > 0 && p.totalProgress < 100).length,
    completed: Object.values(progress).filter(p => p.totalProgress === 100).length,
    totalHours: enrolledCoursesData.reduce((acc, course) => {
      const hours = parseInt(course.duration.split(' ')[0]);
      return acc + hours;
    }, 0)
  };

  const filteredCourses = enrolledCoursesData.filter(course => {
    const courseProgress = progress[course.id];
    if (!courseProgress) return filter === 'all';
    
    switch (filter) {
      case 'in-progress':
        return courseProgress.totalProgress > 0 && courseProgress.totalProgress < 100;
      case 'completed':
        return courseProgress.totalProgress === 100;
      default:
        return true;
    }
  });

  const getStatusBadge = (courseProgress: any) => {
    if (!courseProgress || courseProgress.totalProgress === 0) {
      return <Badge variant="secondary">Not Started</Badge>;
    } else if (courseProgress.totalProgress === 100) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Completed</Badge>;
    } else {
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">In Progress</Badge>;
    }
  };

  const getLastAccessed = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (enrolledCourses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="mb-8">
              <BookOpen className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Start Your Learning Journey</h2>
              <p className="text-muted-foreground text-lg">
                You haven't enrolled in any courses yet. Explore our course catalog to get started!
              </p>
            </div>
            <Link to="/courses">
              <Button size="lg" className="animate-pulse-glow">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Learning Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Track your progress and continue your learning journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-2xl font-bold">{stats.totalEnrolled}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                  <Trophy className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold">{stats.totalHours}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Course List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>My Courses</span>
              </CardTitle>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-3 py-1.5 border border-border rounded-md bg-background text-sm"
                >
                  <option value="all">All Courses</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No courses match the selected filter.
              </div>
            ) : (
              filteredCourses.map(course => {
                const courseProgress = progress[course.id];
                const progressPercentage = courseProgress?.totalProgress || 0;
                
                return (
                  <div
                    key={course.id}
                    className="border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                      {/* Course Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full lg:w-32 h-20 object-cover rounded-md"
                        />
                      </div>
                      
                      {/* Course Info */}
                      <div className="flex-grow space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{course.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              by {course.instructor} • {course.category}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                            {getStatusBadge(courseProgress)}
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{Math.round(progressPercentage)}%</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                        
                        {/* Additional Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{course.duration}</span>
                            </span>
                            {courseProgress && (
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>Last accessed {getLastAccessed(courseProgress.lastAccessed)}</span>
                              </span>
                            )}
                          </div>
                          
                          <Link to={`/course/${course.id}`} className="mt-2 sm:mt-0">
                            <Button size="sm" className="w-full sm:w-auto">
                              <Play className="h-3 w-3 mr-1" />
                              {progressPercentage === 100 ? 'Review' : progressPercentage > 0 ? 'Continue' : 'Start'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Achievements Section */}
        {stats.completed > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                  <Trophy className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="font-medium">Course Completionist</p>
                    <p className="text-sm text-muted-foreground">
                      Completed {stats.completed} course{stats.completed !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                {stats.totalHours >= 10 && (
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                    <Clock className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium">Time Investor</p>
                      <p className="text-sm text-muted-foreground">
                        {stats.totalHours}+ hours of learning
                      </p>
                    </div>
                  </div>
                )}
                
                {stats.totalEnrolled >= 3 && (
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                    <BookOpen className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="font-medium">Course Collector</p>
                      <p className="text-sm text-muted-foreground">
                        Enrolled in {stats.totalEnrolled} courses
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;