import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLearning } from '@/contexts/LearningContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Play, 
  Check, 
  Clock, 
  Users, 
  Star, 
  BookOpen,
  Award,
  ChevronRight
} from 'lucide-react';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, enrolledCourses, enrollInCourse, markModuleComplete, getProgress } = useLearning();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const course = courses.find(c => c.id === courseId);
  const isEnrolled = courseId ? enrolledCourses.includes(courseId) : false;
  const progress = courseId ? getProgress(courseId) : undefined;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
    if (courseId) {
      enrollInCourse(courseId);
    }
  };

  const handleModuleComplete = (moduleId: string) => {
    if (courseId) {
      markModuleComplete(courseId, moduleId);
    }
  };

  const completedModules = progress?.completedModules || [];
  const progressPercentage = progress?.totalProgress || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Course Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="outline">{course.level}</Badge>
                {isEnrolled && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Enrolled
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl font-bold leading-tight">{course.title}</h1>
              <p className="text-lg text-muted-foreground">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating}</span>
                  <span className="text-muted-foreground">rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{course.duration}</span>
                </div>
              </div>

              {isEnrolled && progress && (
                <div className="bg-card rounded-lg p-4 border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Your Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {completedModules.length} of {course.modules.length} modules completed
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="text-right text-sm text-muted-foreground mt-1">
                    {Math.round(progressPercentage)}% complete
                  </div>
                </div>
              )}
            </div>

            {/* Video Player */}
            {isEnrolled && selectedModule && (
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={course.modules.find(m => m.id === selectedModule)?.videoUrl}
                      title="Course Video"
                      frameBorder="0"
                      allowFullScreen
                      className="rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      {course.modules.find(m => m.id === selectedModule)?.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {course.modules.find(m => m.id === selectedModule)?.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Modules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Course Content</span>
                  <Badge variant="outline" className="ml-auto">
                    {course.modules.length} modules
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.modules.map((module, index) => {
                  const isCompleted = completedModules.includes(module.id);
                  const isSelected = selectedModule === module.id;
                  
                  return (
                    <div
                      key={module.id}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50 hover:bg-accent/50'
                      }`}
                      onClick={() => isEnrolled && setSelectedModule(module.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            isCompleted 
                              ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-100' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {isCompleted ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          
                          <div>
                            <h4 className="font-medium">{module.title}</h4>
                            <p className="text-sm text-muted-foreground">{module.duration}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {isEnrolled && !isCompleted && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleModuleComplete(module.id);
                              }}
                            >
                              Mark Complete
                            </Button>
                          )}
                          {isEnrolled && (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6 text-center space-y-4">
                <div className="text-3xl font-bold text-primary">${course.price}</div>
                
                {!isEnrolled ? (
                  <Button 
                    onClick={handleEnroll}
                    className="w-full text-lg py-6 animate-pulse-glow"
                  >
                    Enroll Now
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="text-green-600 dark:text-green-400 font-medium flex items-center justify-center space-x-2">
                      <Award className="h-5 w-5" />
                      <span>Enrolled Successfully!</span>
                    </div>
                    <Button 
                      onClick={() => setSelectedModule(course.modules[0].id)}
                      className="w-full"
                      variant="outline"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>30-day money-back guarantee</div>
                  <div>Lifetime access</div>
                  <div>Certificate of completion</div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Instructor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={course.instructorImage} alt={course.instructor} />
                    <AvatarFallback>{course.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{course.instructor}</h4>
                    <p className="text-sm text-muted-foreground">Course Instructor</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{course.instructorBio}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
