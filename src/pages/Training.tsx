import { useState } from 'react';
import { 
  GraduationCap, 
  Play, 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  Video, 
  BookOpen, 
  Award, 
  Filter, 
  Search,
  Globe,
  CheckCircle,
  PlayCircle,
  FileText,
  Landmark,
  Building2,
  ExternalLink,
  Download,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Sample data for courses
const courses = [
  {
    id: '1',
    title: 'Export Documentation Masterclass',
    description: 'Complete guide to export documentation, customs procedures, and compliance requirements.',
    instructor: 'Dr. Rajesh Kumar',
    instructorTitle: 'DGFT Expert',
    duration: '8 hours',
    lessons: 24,
    students: 1250,
    rating: 4.8,
    reviews: 342,
    price: 4999,
    category: 'Documentation',
    level: 'Beginner',
    language: 'English',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    progress: 65,
    enrolled: true,
    topics: ['Bill of Lading', 'Commercial Invoice', 'Packing List', 'Certificate of Origin', 'DGFT Compliance']
  },
  {
    id: '2',
    title: 'International Trade Finance',
    description: 'Learn about Letters of Credit, Bank Guarantees, and Export Credit Insurance.',
    instructor: 'Priya Sharma',
    instructorTitle: 'Trade Finance Specialist',
    duration: '6 hours',
    lessons: 18,
    students: 890,
    rating: 4.9,
    reviews: 256,
    price: 5999,
    category: 'Finance',
    level: 'Intermediate',
    language: 'English',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    progress: 30,
    enrolled: true,
    topics: ['Letter of Credit', 'Bank Guarantees', 'ECGC', 'Trade Insurance', 'Payment Methods']
  },
  {
    id: '3',
    title: 'Textile Export Regulations',
    description: 'Comprehensive course on textile export regulations, quality standards, and market access.',
    instructor: 'Amit Patel',
    instructorTitle: 'Textile Industry Expert',
    duration: '5 hours',
    lessons: 15,
    students: 567,
    rating: 4.7,
    reviews: 189,
    price: 3999,
    category: 'Industry Specific',
    level: 'Advanced',
    language: 'Hindi',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    progress: 0,
    enrolled: false,
    topics: ['Quality Standards', 'EU Regulations', 'US Import Rules', 'Labeling Requirements']
  },
  {
    id: '4',
    title: 'Digital Marketing for Exporters',
    description: 'Build your export business online with digital marketing strategies and B2B platforms.',
    instructor: 'Sneha Reddy',
    instructorTitle: 'Digital Export Strategist',
    duration: '4 hours',
    lessons: 12,
    students: 1450,
    rating: 4.6,
    reviews: 423,
    price: 2999,
    category: 'Marketing',
    level: 'Beginner',
    language: 'English',
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400',
    progress: 0,
    enrolled: false,
    topics: ['Alibaba', 'IndiaMART', 'LinkedIn B2B', 'Trade Portals', 'SEO for Exporters']
  },
  {
    id: '5',
    title: 'Customs Clearance & Logistics',
    description: 'Master customs procedures, HS codes, and international logistics management.',
    instructor: 'Vikram Singh',
    instructorTitle: 'Customs Broker',
    duration: '7 hours',
    lessons: 21,
    students: 780,
    rating: 4.8,
    reviews: 198,
    price: 4499,
    category: 'Logistics',
    level: 'Intermediate',
    language: 'English',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
    progress: 0,
    enrolled: false,
    topics: ['HS Codes', 'Customs Duty', 'ICEGATE', 'Shipping Documentation', 'Incoterms']
  }
];

// Sample data for upcoming webinars
const webinars = [
  {
    id: '1',
    title: 'Export to European Union: New Regulations 2025',
    description: 'Understanding the latest EU import regulations and compliance requirements.',
    speaker: 'Dr. Rajesh Kumar',
    speakerTitle: 'DGFT Expert',
    date: '2025-01-15',
    time: '11:00 AM IST',
    duration: '90 minutes',
    attendees: 245,
    maxAttendees: 500,
    price: 0,
    category: 'Regulations',
    isLive: false,
    isRegistered: true,
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400'
  },
  {
    id: '2',
    title: 'Leveraging FTAs for Competitive Advantage',
    description: 'How to use Free Trade Agreements to reduce costs and access new markets.',
    speaker: 'Priya Sharma',
    speakerTitle: 'Trade Consultant',
    date: '2025-01-18',
    time: '3:00 PM IST',
    duration: '60 minutes',
    attendees: 178,
    maxAttendees: 300,
    price: 499,
    category: 'Strategy',
    isLive: false,
    isRegistered: false,
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400'
  },
  {
    id: '3',
    title: 'Live Q&A: Export Documentation Doubts',
    description: 'Get your export documentation questions answered by experts.',
    speaker: 'Amit Patel',
    speakerTitle: 'Documentation Expert',
    date: '2025-01-10',
    time: '2:00 PM IST',
    duration: '120 minutes',
    attendees: 89,
    maxAttendees: 200,
    price: 0,
    category: 'Q&A',
    isLive: true,
    isRegistered: true,
    thumbnail: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400'
  },
  {
    id: '4',
    title: 'Pharmaceutical Exports: Compliance Workshop',
    description: 'Regulatory requirements for exporting pharmaceutical products.',
    speaker: 'Dr. Meera Joshi',
    speakerTitle: 'Pharma Regulatory Expert',
    date: '2025-01-22',
    time: '10:00 AM IST',
    duration: '180 minutes',
    attendees: 156,
    maxAttendees: 250,
    price: 999,
    category: 'Workshop',
    isLive: false,
    isRegistered: false,
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400'
  }
];

// Sample certifications
const certifications = [
  {
    id: '1',
    title: 'Certified Export Professional (CEP)',
    description: 'Comprehensive certification covering all aspects of export business.',
    modules: 8,
    duration: '40 hours',
    price: 14999,
    enrolled: 2340,
    rating: 4.9,
    status: 'in_progress',
    progress: 45,
    badge: '🏆'
  },
  {
    id: '2',
    title: 'Trade Finance Specialist',
    description: 'Specialized certification in international trade finance.',
    modules: 6,
    duration: '30 hours',
    price: 12999,
    enrolled: 1890,
    rating: 4.8,
    status: 'not_started',
    progress: 0,
    badge: '💰'
  },
  {
    id: '3',
    title: 'Customs Compliance Expert',
    description: 'Master customs regulations and compliance procedures.',
    modules: 5,
    duration: '25 hours',
    price: 9999,
    enrolled: 1456,
    rating: 4.7,
    status: 'completed',
    progress: 100,
    badge: '📜'
  }
];

// Government Policies Data
const centralPolicies = [
  {
    id: '1',
    title: 'Foreign Trade Policy 2023-28',
    ministry: 'Ministry of Commerce & Industry',
    description: 'Comprehensive policy framework for promoting exports and regulating imports.',
    category: 'Trade Policy',
    effectiveDate: '2023-04-01',
    documentUrl: 'https://dgft.gov.in',
    highlights: ['Remission of Duties and Taxes', 'Export Promotion Capital Goods', 'Advance Authorization', 'EPCG Scheme']
  },
  {
    id: '2',
    title: 'RODTEP Scheme',
    ministry: 'Ministry of Commerce & Industry',
    description: 'Remission of Duties and Taxes on Exported Products - refund of embedded taxes.',
    category: 'Export Incentive',
    effectiveDate: '2021-01-01',
    documentUrl: 'https://dgft.gov.in',
    highlights: ['Refund of central taxes', 'State taxes refund', 'Electronic credit ledger', 'Sector-specific rates']
  },
  {
    id: '3',
    title: 'Production Linked Incentive (PLI)',
    ministry: 'Multiple Ministries',
    description: 'Incentives for boosting domestic manufacturing and exports across 14 sectors.',
    category: 'Manufacturing',
    effectiveDate: '2020-03-01',
    documentUrl: 'https://pib.gov.in',
    highlights: ['14 key sectors', 'INR 1.97 lakh crore outlay', '5-year incentive period', 'Export-linked benefits']
  },
  {
    id: '4',
    title: 'Interest Equalisation Scheme',
    ministry: 'RBI / Ministry of Commerce',
    description: 'Interest subvention for pre and post-shipment export credit.',
    category: 'Finance',
    effectiveDate: '2015-04-01',
    documentUrl: 'https://rbi.org.in',
    highlights: ['3% for MSMEs', '2% for other exporters', 'All 416 tariff lines', 'Pre & post shipment credit']
  },
  {
    id: '5',
    title: 'ECGC Export Credit Insurance',
    ministry: 'Ministry of Commerce & Industry',
    description: 'Credit risk insurance for exporters against payment defaults.',
    category: 'Insurance',
    effectiveDate: '1957-01-01',
    documentUrl: 'https://ecgc.in',
    highlights: ['Buyer credit insurance', 'Political risk cover', 'Bank protection', 'Small exporter policy']
  },
  {
    id: '6',
    title: 'Market Access Initiative (MAI)',
    ministry: 'Ministry of Commerce & Industry',
    description: 'Financial assistance for export promotion activities and market development.',
    category: 'Export Promotion',
    effectiveDate: '2002-01-01',
    documentUrl: 'https://commerce.gov.in',
    highlights: ['Trade fair participation', 'Brand promotion abroad', 'Study tours', 'Market research']
  }
];

const statePolicies = [
  {
    id: '1',
    state: 'Gujarat',
    title: 'Gujarat Export Policy 2022-27',
    department: 'Industries & Mines Department',
    description: 'Comprehensive export promotion policy with incentives for MSMEs and large enterprises.',
    category: 'Export Policy',
    effectiveDate: '2022-04-01',
    highlights: ['50% subsidy on trade fairs', 'Interest subsidy 5%', 'Quality certification support', 'Logistics assistance']
  },
  {
    id: '2',
    state: 'Maharashtra',
    title: 'Maharashtra Export Promotion Policy',
    department: 'Industries Department',
    description: 'State support for export-oriented units and new exporters.',
    category: 'Export Policy',
    effectiveDate: '2023-01-01',
    highlights: ['SGST reimbursement', 'Export credit support', 'Brand development', 'Training programs']
  },
  {
    id: '3',
    state: 'Tamil Nadu',
    title: 'Tamil Nadu MSME Policy 2021',
    department: 'MSME Department',
    description: 'Support for MSME exporters including subsidies and infrastructure.',
    category: 'MSME',
    effectiveDate: '2021-10-01',
    highlights: ['Capital subsidy 25%', 'Technology upgrade support', 'Export market access', 'Skill development']
  },
  {
    id: '4',
    state: 'Karnataka',
    title: 'Karnataka Export Development Policy',
    department: 'Commerce & Industries',
    description: 'Focus on IT, biotechnology, and manufacturing exports.',
    category: 'Export Policy',
    effectiveDate: '2022-07-01',
    highlights: ['IT export incentives', 'Biotech corridor support', 'Aerospace cluster', 'EOU benefits']
  },
  {
    id: '5',
    state: 'Uttar Pradesh',
    title: 'UP Export Promotion Policy 2020-25',
    department: 'Export Promotion Bureau',
    description: 'Encouraging exports from traditional and emerging sectors.',
    category: 'Export Policy',
    effectiveDate: '2020-08-01',
    highlights: ['Handicraft export support', 'Textile cluster development', 'Food processing focus', 'One District One Product']
  },
  {
    id: '6',
    state: 'Rajasthan',
    title: 'Rajasthan Investment Promotion Scheme',
    department: 'Industries Department',
    description: 'Investment and export promotion with special benefits for exporters.',
    category: 'Investment',
    effectiveDate: '2022-01-01',
    highlights: ['Land at subsidized rates', 'Stamp duty exemption', 'Employment incentives', 'Export infrastructure']
  },
  {
    id: '7',
    state: 'West Bengal',
    title: 'WB Incentive Scheme for Industries',
    department: 'Commerce & Industries',
    description: 'State incentives for export-oriented industries and IT exports.',
    category: 'Industry',
    effectiveDate: '2022-04-01',
    highlights: ['Capital subsidy', 'Interest subsidy', 'Power tariff subsidy', 'Export duty exemption']
  },
  {
    id: '8',
    state: 'Kerala',
    title: 'Kerala Industrial Policy 2023',
    department: 'Industries & Commerce',
    description: 'Focus on spices, seafood, and IT services exports.',
    category: 'Industrial Policy',
    effectiveDate: '2023-01-01',
    highlights: ['Spice park development', 'Seafood processing', 'Ayurveda exports', 'IT/ITES promotion']
  }
];

export default function Training() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);
  const [policyStateFilter, setPolicyStateFilter] = useState('all');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const myCourses = courses.filter(c => c.enrolled);
  const upcomingWebinars = webinars.filter(w => !w.isLive);
  const liveNow = webinars.filter(w => w.isLive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Training & Webinars</h1>
          <p className="text-muted-foreground">Learn export skills from industry experts</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="gap-1">
            <BookOpen className="h-3 w-3" />
            {myCourses.length} Enrolled Courses
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Award className="h-3 w-3" />
            1 Certification
          </Badge>
        </div>
      </div>

      {/* Live Webinar Banner */}
      {liveNow.length > 0 && (
        <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-200">
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Video className="h-8 w-8 text-red-500" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">LIVE NOW</Badge>
                    <span className="text-sm text-muted-foreground">{liveNow[0].attendees} watching</span>
                  </div>
                  <h3 className="font-semibold">{liveNow[0].title}</h3>
                  <p className="text-sm text-muted-foreground">with {liveNow[0].speaker}</p>
                </div>
              </div>
              <Button className="gap-2 bg-red-500 hover:bg-red-600">
                <Play className="h-4 w-4" />
                Join Live Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 flex-wrap h-auto">
          <TabsTrigger value="courses" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="webinars" className="gap-2">
            <Video className="h-4 w-4" />
            Webinars
          </TabsTrigger>
          <TabsTrigger value="my-learning" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            My Learning
          </TabsTrigger>
          <TabsTrigger value="certifications" className="gap-2">
            <Award className="h-4 w-4" />
            Certifications
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-2">
            <FileText className="h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Documentation">Documentation</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Logistics">Logistics</SelectItem>
                <SelectItem value="Industry Specific">Industry Specific</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Dialog key={course.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-all group overflow-hidden">
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge className="absolute top-3 left-3" variant="secondary">
                        {course.category}
                      </Badge>
                      <Badge className="absolute top-3 right-3 bg-background/90">
                        {course.level}
                      </Badge>
                      {course.enrolled && (
                        <div className="absolute bottom-3 left-3 right-3">
                          <Progress value={course.progress} className="h-1.5" />
                          <span className="text-xs text-white mt-1">{course.progress}% complete</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-2 mb-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">by {course.instructor}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {course.lessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.students.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{course.rating}</span>
                          <span className="text-xs text-muted-foreground">({course.reviews})</span>
                        </div>
                        <span className="font-bold text-primary">₹{course.price.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{course.title}</DialogTitle>
                    <DialogDescription>{course.description}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{course.instructor}</p>
                          <p className="text-xs text-muted-foreground">{course.instructorTitle}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        <Globe className="h-3 w-3 mr-1" />
                        {course.language}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 py-4 border-y">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{course.lessons}</p>
                        <p className="text-xs text-muted-foreground">Lessons</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{course.duration}</p>
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{course.students.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Students</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold flex items-center justify-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          {course.rating}
                        </p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">What you'll learn</h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {course.topics.map((topic, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <span className="text-3xl font-bold text-primary">₹{course.price.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground ml-2">one-time</span>
                      </div>
                      <Button size="lg" className="gap-2">
                        {course.enrolled ? (
                          <>
                            <PlayCircle className="h-5 w-5" />
                            Continue Learning
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-5 w-5" />
                            Enroll Now
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </TabsContent>

        {/* Webinars Tab */}
        <TabsContent value="webinars" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {webinars.map((webinar) => (
              <Card key={webinar.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-48 h-32 md:h-auto shrink-0">
                    <img 
                      src={webinar.thumbnail} 
                      alt={webinar.title}
                      className="w-full h-full object-cover"
                    />
                    {webinar.isLive && (
                      <Badge variant="destructive" className="absolute top-2 left-2 animate-pulse">
                        LIVE
                      </Badge>
                    )}
                    {webinar.price === 0 && !webinar.isLive && (
                      <Badge className="absolute top-2 left-2 bg-green-500">
                        FREE
                      </Badge>
                    )}
                  </div>
                  <CardContent className="flex-1 p-4">
                    <Badge variant="outline" className="mb-2">{webinar.category}</Badge>
                    <h3 className="font-semibold mb-1">{webinar.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{webinar.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <span className="font-medium text-foreground">{webinar.speaker}</span>
                      <span>•</span>
                      <span>{webinar.speakerTitle}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(webinar.date).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {webinar.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {webinar.attendees}/{webinar.maxAttendees}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      {webinar.price > 0 && (
                        <span className="font-bold text-primary">₹{webinar.price}</span>
                      )}
                      <Button 
                        size="sm" 
                        variant={webinar.isRegistered ? "outline" : "default"}
                        className={webinar.isLive ? "bg-red-500 hover:bg-red-600" : ""}
                      >
                        {webinar.isLive ? (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Join Now
                          </>
                        ) : webinar.isRegistered ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Registered
                          </>
                        ) : (
                          'Register'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Learning Tab */}
        <TabsContent value="my-learning" className="space-y-6">
          <div className="grid gap-4">
            {myCourses.map((course) => (
              <Card key={course.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full md:w-40 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">{course.instructor}</p>
                        </div>
                        <Badge variant="outline">{course.category}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{course.progress}% complete</span>
                          <span className="text-muted-foreground">{Math.round(course.lessons * course.progress / 100)}/{course.lessons} lessons</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    </div>
                    <Button className="shrink-0 gap-2">
                      <PlayCircle className="h-4 w-4" />
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Registered Webinars */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Upcoming Registered Webinars</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {webinars.filter(w => w.isRegistered).map((webinar) => (
                <Card key={webinar.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Video className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{webinar.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(webinar.date).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short'
                        })} at {webinar.time}
                      </p>
                    </div>
                    <Button size="sm" variant={webinar.isLive ? "default" : "outline"}>
                      {webinar.isLive ? 'Join' : 'Add to Calendar'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <Card key={cert.id} className="relative overflow-hidden">
                {cert.status === 'completed' && (
                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                    <div className="absolute top-4 right-[-30px] w-[120px] bg-green-500 text-white text-xs py-1 text-center rotate-45">
                      Completed
                    </div>
                  </div>
                )}
                <CardHeader>
                  <div className="text-4xl mb-2">{cert.badge}</div>
                  <CardTitle className="text-lg">{cert.title}</CardTitle>
                  <CardDescription>{cert.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Modules</p>
                      <p className="font-medium">{cert.modules} modules</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">{cert.duration}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Enrolled</p>
                      <p className="font-medium">{cert.enrolled.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rating</p>
                      <p className="font-medium flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {cert.rating}
                      </p>
                    </div>
                  </div>

                  {cert.status === 'in_progress' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{cert.progress}%</span>
                      </div>
                      <Progress value={cert.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xl font-bold text-primary">₹{cert.price.toLocaleString()}</span>
                    <Button variant={cert.status === 'completed' ? 'outline' : 'default'}>
                      {cert.status === 'completed' ? 'View Certificate' : 
                       cert.status === 'in_progress' ? 'Continue' : 'Enroll'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Resources Tab - Government Policies */}
        <TabsContent value="resources" className="space-y-6">
          {/* Central Government Policies */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Landmark className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Central Government Policies</h3>
                <p className="text-sm text-muted-foreground">Key export policies and schemes from Government of India</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {centralPolicies.map((policy) => (
                <Card key={policy.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                        {policy.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-base mt-2">{policy.title}</CardTitle>
                    <CardDescription className="text-xs">{policy.ministry}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{policy.description}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Effective: {new Date(policy.effectiveDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {policy.highlights.slice(0, 3).map((highlight, i) => (
                        <Badge key={i} variant="secondary" className="text-xs font-normal">
                          {highlight}
                        </Badge>
                      ))}
                      {policy.highlights.length > 3 && (
                        <Badge variant="secondary" className="text-xs font-normal">
                          +{policy.highlights.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 gap-1" asChild>
                        <a href={policy.documentUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                          View Details
                        </a>
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-1">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* State Government Policies */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Building2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">State Government Policies</h3>
                  <p className="text-sm text-muted-foreground">Export promotion schemes by state governments</p>
                </div>
              </div>
              <Select value={policyStateFilter} onValueChange={setPolicyStateFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="Gujarat">Gujarat</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                  <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="West Bengal">West Bengal</SelectItem>
                  <SelectItem value="Kerala">Kerala</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {statePolicies
                .filter(p => policyStateFilter === 'all' || p.state === policyStateFilter)
                .map((policy) => (
                <Card key={policy.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge className="bg-green-500/10 text-green-600 border-green-200">
                        {policy.state}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {policy.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-base mt-2">{policy.title}</CardTitle>
                    <CardDescription className="text-xs">{policy.department}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{policy.description}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Effective: {new Date(policy.effectiveDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {policy.highlights.slice(0, 2).map((highlight, i) => (
                        <Badge key={i} variant="secondary" className="text-xs font-normal">
                          {highlight}
                        </Badge>
                      ))}
                      {policy.highlights.length > 2 && (
                        <Badge variant="secondary" className="text-xs font-normal">
                          +{policy.highlights.length - 2} more
                        </Badge>
                      )}
                    </div>
                    
                    <Button size="sm" variant="outline" className="w-full gap-1 mt-2">
                      <Info className="h-3 w-3" />
                      View Policy Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4">Useful Government Portals</h4>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: 'DGFT', url: 'https://dgft.gov.in', desc: 'Directorate General of Foreign Trade' },
                  { name: 'ECGC', url: 'https://ecgc.in', desc: 'Export Credit Guarantee Corporation' },
                  { name: 'FIEO', url: 'https://fieo.org', desc: 'Federation of Indian Export Organisations' },
                  { name: 'MSME', url: 'https://msme.gov.in', desc: 'Ministry of MSME' },
                ].map((portal) => (
                  <a 
                    key={portal.name}
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-accent transition-colors"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{portal.name}</p>
                      <p className="text-xs text-muted-foreground">{portal.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
