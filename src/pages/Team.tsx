import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Mail, Phone, Linkedin } from "lucide-react";

interface TeamMember {
  id: string;
  full_name: string;
  designation: string;
  department: string | null;
  bio: string | null;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
}

const Team = () => {
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data as TeamMember[];
    }
  });

  // Placeholder team members if database is empty
  const placeholderTeam: TeamMember[] = [
    {
      id: '1',
      full_name: 'Dr. Rajesh Kumar',
      designation: 'Chairman',
      department: 'Leadership',
      bio: 'Former Secretary, Ministry of Commerce & Industry, Government of India. 35+ years of experience in trade policy and international relations.',
      photo_url: null,
      email: 'chairman@gtpc.org',
      phone: null,
      linkedin_url: 'https://linkedin.com'
    },
    {
      id: '2',
      full_name: 'Mrs. Priya Sharma',
      designation: 'Managing Director',
      department: 'Leadership',
      bio: 'MBA from IIM Ahmedabad with 25+ years in export promotion. Led successful trade missions to 40+ countries.',
      photo_url: null,
      email: 'md@gtpc.org',
      phone: null,
      linkedin_url: 'https://linkedin.com'
    },
    {
      id: '3',
      full_name: 'Mr. Amit Patel',
      designation: 'Director - Trade Operations',
      department: 'Operations',
      bio: 'Seasoned trade professional with expertise in documentation, customs, and logistics management.',
      photo_url: null,
      email: 'operations@gtpc.org',
      phone: null,
      linkedin_url: 'https://linkedin.com'
    },
    {
      id: '4',
      full_name: 'Ms. Sunita Reddy',
      designation: 'Director - Membership',
      department: 'Membership',
      bio: 'Responsible for member relations and services. Built a network of 5000+ active members.',
      photo_url: null,
      email: 'membership@gtpc.org',
      phone: null,
      linkedin_url: null
    },
    {
      id: '5',
      full_name: 'Mr. Vikram Singh',
      designation: 'Head - International Relations',
      department: 'International',
      bio: 'Former diplomat with extensive network across Middle East, Europe, and ASEAN countries.',
      photo_url: null,
      email: 'ir@gtpc.org',
      phone: null,
      linkedin_url: 'https://linkedin.com'
    },
    {
      id: '6',
      full_name: 'Mrs. Kavitha Menon',
      designation: 'Head - Training & Development',
      department: 'Training',
      bio: 'Expert in export training and capacity building. Trained 10,000+ exporters across India.',
      photo_url: null,
      email: 'training@gtpc.org',
      phone: null,
      linkedin_url: null
    },
  ];

  const displayTeam = teamMembers && teamMembers.length > 0 ? teamMembers : placeholderTeam;

  // Group by department
  const departments = [...new Set(displayTeam.map(m => m.department || 'General'))];
  const leadershipTeam = displayTeam.filter(m => m.department === 'Leadership');
  const otherTeam = displayTeam.filter(m => m.department !== 'Leadership');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-0">
              <Users className="w-3 h-3 mr-1" />
              Our Team
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meet Our Leadership
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Our team comprises industry veterans, former government officials, 
              and trade experts dedicated to helping Indian businesses succeed globally.
            </p>
          </div>
        </section>

        {/* Leadership Team */}
        {leadershipTeam.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Leadership Team</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Guiding our mission with decades of combined experience
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {leadershipTeam.map((member) => (
                  <Card key={member.id} className="border-border hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <Avatar className="w-24 h-24 shrink-0">
                          <AvatarImage src={member.photo_url || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                            {member.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground">{member.full_name}</h3>
                          <p className="text-primary font-medium mb-2">{member.designation}</p>
                          <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                          <div className="flex gap-3">
                            {member.email && (
                              <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary">
                                <Mail className="w-5 h-5" />
                              </a>
                            )}
                            {member.linkedin_url && (
                              <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                <Linkedin className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Other Team Members */}
        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Department Heads</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Expert professionals leading our core functions
              </p>
            </div>
            {isLoading ? (
              <div className="text-center py-12">Loading team...</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {otherTeam.map((member) => (
                  <Card key={member.id} className="border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Avatar className="w-20 h-20 mx-auto mb-4">
                        <AvatarImage src={member.photo_url || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl">
                          {member.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-foreground">{member.full_name}</h3>
                      <p className="text-sm text-primary font-medium mb-1">{member.designation}</p>
                      {member.department && (
                        <Badge variant="secondary" className="mb-3">{member.department}</Badge>
                      )}
                      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{member.bio}</p>
                      <div className="flex justify-center gap-3">
                        {member.email && (
                          <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary">
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                        {member.phone && (
                          <a href={`tel:${member.phone}`} className="text-muted-foreground hover:text-primary">
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                        {member.linkedin_url && (
                          <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Join Us CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Join Our Team
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              We're always looking for passionate individuals who want to contribute 
              to India's trade growth story
            </p>
            <a 
              href="mailto:careers@gtpc.org"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Mail className="w-4 h-4" />
              View Career Opportunities
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Team;
