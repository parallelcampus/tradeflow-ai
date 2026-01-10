import { useState } from "react";
import {
  Search,
  Filter,
  Building2,
  Globe,
  Users,
  DollarSign,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  TrendingUp,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Cpu,
  Zap,
  Target,
  AlertCircle,
  Building,
  LayoutGrid,
  List,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import {
  exploriumApi,
  countryCodes,
  regionCodes,
  companySizes,
  revenueRanges,
  companyAges,
  industries,
  techCategories,
  businessEvents,
  buyerIntentTopics,
  numberOfLocations,
  type Business,
  type SearchFilters,
} from "@/lib/api/explorium";

export default function BuyerDiscovery() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedBuyers, setSavedBuyers] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Filter section states
  const [openSections, setOpenSections] = useState({
    location: true,
    company: true,
    industry: false,
    technology: false,
    signals: false,
    intent: false,
  });

  // Filter states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedRevenue, setSelectedRevenue] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedTechCategories, setSelectedTechCategories] = useState<string[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [eventLookbackDays, setEventLookbackDays] = useState(60);
  const [selectedIntentTopics, setSelectedIntentTopics] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // Match business states
  const [matchMode, setMatchMode] = useState(false);
  const [matchInput, setMatchInput] = useState("");

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSearch = async (page: number = 1) => {
    const hasFilters =
      selectedCountries.length > 0 ||
      selectedRegions.length > 0 ||
      selectedSizes.length > 0 ||
      selectedRevenue.length > 0 ||
      selectedAges.length > 0 ||
      selectedIndustries.length > 0 ||
      selectedTechCategories.length > 0 ||
      selectedEvents.length > 0 ||
      selectedIntentTopics.length > 0 ||
      selectedLocations.length > 0 ||
      searchKeyword.trim();

    if (!hasFilters) {
      toast({
        title: "Please select filters",
        description: "Select at least one filter criteria to search for buyers.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCurrentPage(page);

    try {
      const filters: SearchFilters = {};

      if (selectedCountries.length) {
        filters.country_code = selectedCountries;
      }
      if (selectedRegions.length) {
        filters.region_country_code = selectedRegions;
      }
      if (selectedSizes.length) {
        filters.company_size = selectedSizes;
      }
      if (selectedRevenue.length) {
        filters.company_revenue = selectedRevenue;
      }
      if (selectedAges.length) {
        filters.company_age = selectedAges;
      }
      if (selectedIndustries.length) {
        filters.linkedin_category = selectedIndustries;
      }
      if (selectedTechCategories.length) {
        filters.company_tech_stack_category = selectedTechCategories;
      }
      if (selectedLocations.length) {
        filters.number_of_locations = selectedLocations;
      }
      if (searchKeyword.trim()) {
        filters.website_keywords = [searchKeyword.trim()];
      }
      if (selectedEvents.length) {
        filters.events = {
          values: selectedEvents,
          last_occurrence: eventLookbackDays,
        };
      }
      if (selectedIntentTopics.length) {
        filters.topics = selectedIntentTopics;
      }

      const response = await exploriumApi.searchBusinesses(filters, page, 20);

      if (response.success) {
        setBusinesses(response.data || []);
        setTotalResults(response.total_results || 0);
        toast({
          title: "Search Complete",
          description: `Found ${(response.total_results || 0).toLocaleString()} potential buyers.`,
        });
      } else {
        toast({
          title: "Search Failed",
          description: response.error || "Unable to fetch buyer data.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Error",
        description: "Failed to search for buyers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatchBusiness = async () => {
    if (!matchInput.trim()) {
      toast({
        title: "Enter business details",
        description: "Please enter a company name or domain to match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const isUrl = matchInput.includes(".");
      const response = await exploriumApi.matchBusinesses([
        isUrl
          ? { domain: matchInput.trim() }
          : { name: matchInput.trim() },
      ]);

      if (response.success && response.matched_businesses?.length) {
        setBusinesses(response.matched_businesses);
        setTotalResults(response.total_matches || 0);
        toast({
          title: "Match Found",
          description: `Found ${response.total_matches || 0} matching businesses.`,
        });
      } else {
        toast({
          title: "No Matches",
          description: "No businesses found matching your criteria.",
        });
        setBusinesses([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error("Match error:", error);
      toast({
        title: "Error",
        description: "Failed to match business. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSaved = (businessId: string) => {
    setSavedBuyers((prev) => {
      const next = new Set(prev);
      if (next.has(businessId)) {
        next.delete(businessId);
      } else {
        next.add(businessId);
      }
      return next;
    });
  };

  const toggleFilter = (
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const clearFilters = () => {
    setSelectedCountries([]);
    setSelectedRegions([]);
    setSelectedSizes([]);
    setSelectedRevenue([]);
    setSelectedAges([]);
    setSelectedIndustries([]);
    setSelectedTechCategories([]);
    setSelectedEvents([]);
    setSelectedIntentTopics([]);
    setSelectedLocations([]);
    setSearchKeyword("");
    setBusinesses([]);
    setTotalResults(0);
  };

  const activeFiltersCount =
    selectedCountries.length +
    selectedRegions.length +
    selectedSizes.length +
    selectedRevenue.length +
    selectedAges.length +
    selectedIndustries.length +
    selectedTechCategories.length +
    selectedEvents.length +
    selectedIntentTopics.length +
    selectedLocations.length +
    (searchKeyword ? 1 : 0);

  // Get available regions based on selected countries
  const availableRegions = selectedCountries.flatMap(
    (country) => regionCodes[country] || []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            AI Buyer Discovery
          </h1>
          <p className="text-muted-foreground">
            Search 80M+ businesses worldwide • Find buyers actively looking for your products
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={matchMode ? "default" : "outline"}
            onClick={() => setMatchMode(!matchMode)}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {matchMode ? "Filter Search" : "Match Company"}
          </Button>
        </div>
      </div>

      {/* Match Mode */}
      {matchMode ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">
                  Enter company name or domain to find a match
                </Label>
                <Input
                  placeholder="e.g., Apple Inc. or apple.com"
                  value={matchInput}
                  onChange={(e) => setMatchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleMatchBusiness()}
                />
              </div>
              <Button
                onClick={handleMatchBusiness}
                disabled={isLoading}
                className="self-end"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Matching...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Find Match
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Search Bar */}
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by keyword (e.g., organic cotton, sustainable packaging, electronics)..."
                    className="pl-10"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Advanced Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                  <Button onClick={() => handleSearch()} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Find Buyers
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Filters Panel */}
          <Collapsible open={showFilters} onOpenChange={setShowFilters}>
            <CollapsibleContent>
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Advanced Search Filters for Exporters
                    </CardTitle>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear All ({activeFiltersCount})
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Location Filters */}
                  <Collapsible open={openSections.location} onOpenChange={() => toggleSection("location")}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium">Target Markets & Location</span>
                        {(selectedCountries.length + selectedRegions.length) > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {selectedCountries.length + selectedRegions.length}
                          </Badge>
                        )}
                      </div>
                      {openSections.location ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Target Countries (Select markets you want to export to)
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {countryCodes.slice(0, 15).map((country) => (
                            <Badge
                              key={country.code}
                              variant={
                                selectedCountries.includes(country.code)
                                  ? "default"
                                  : "outline"
                              }
                              className="cursor-pointer transition-colors"
                              onClick={() =>
                                toggleFilter(
                                  country.code,
                                  selectedCountries,
                                  setSelectedCountries
                                )
                              }
                            >
                              {country.name}
                            </Badge>
                          ))}
                          <Select
                            onValueChange={(value) =>
                              toggleFilter(value, selectedCountries, setSelectedCountries)
                            }
                          >
                            <SelectTrigger className="w-[160px] h-7">
                              <SelectValue placeholder="More countries..." />
                            </SelectTrigger>
                            <SelectContent>
                              {countryCodes.slice(15).map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {availableRegions.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium mb-3 block">
                            Specific Regions/States
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {availableRegions.map((region) => (
                              <Badge
                                key={region.code}
                                variant={
                                  selectedRegions.includes(region.code)
                                    ? "default"
                                    : "outline"
                                }
                                className="cursor-pointer transition-colors"
                                onClick={() =>
                                  toggleFilter(
                                    region.code,
                                    selectedRegions,
                                    setSelectedRegions
                                  )
                                }
                              >
                                {region.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Company Profile Filters */}
                  <Collapsible open={openSections.company} onOpenChange={() => toggleSection("company")}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-primary" />
                        <span className="font-medium">Company Profile</span>
                        {(selectedSizes.length + selectedRevenue.length + selectedAges.length + selectedLocations.length) > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {selectedSizes.length + selectedRevenue.length + selectedAges.length + selectedLocations.length}
                          </Badge>
                        )}
                      </div>
                      {openSections.company ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4">
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                          <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Company Size
                          </Label>
                          <div className="space-y-2">
                            {companySizes.map((size) => (
                              <div
                                key={size.value}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`size-${size.value}`}
                                  checked={selectedSizes.includes(size.value)}
                                  onCheckedChange={() =>
                                    toggleFilter(
                                      size.value,
                                      selectedSizes,
                                      setSelectedSizes
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`size-${size.value}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {size.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Annual Revenue
                          </Label>
                          <div className="space-y-2">
                            {revenueRanges.map((rev) => (
                              <div
                                key={rev.value}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`rev-${rev.value}`}
                                  checked={selectedRevenue.includes(rev.value)}
                                  onCheckedChange={() =>
                                    toggleFilter(
                                      rev.value,
                                      selectedRevenue,
                                      setSelectedRevenue
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`rev-${rev.value}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {rev.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Company Age
                          </Label>
                          <div className="space-y-2">
                            {companyAges.map((age) => (
                              <div
                                key={age.value}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`age-${age.value}`}
                                  checked={selectedAges.includes(age.value)}
                                  onCheckedChange={() =>
                                    toggleFilter(
                                      age.value,
                                      selectedAges,
                                      setSelectedAges
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`age-${age.value}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {age.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Number of Locations
                          </Label>
                          <div className="space-y-2">
                            {numberOfLocations.map((loc) => (
                              <div
                                key={loc.value}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`loc-${loc.value}`}
                                  checked={selectedLocations.includes(loc.value)}
                                  onCheckedChange={() =>
                                    toggleFilter(
                                      loc.value,
                                      selectedLocations,
                                      setSelectedLocations
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`loc-${loc.value}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {loc.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Industry Filters */}
                  <Collapsible open={openSections.industry} onOpenChange={() => toggleSection("industry")}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <span className="font-medium">Industry & Sector</span>
                        {selectedIndustries.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {selectedIndustries.length}
                          </Badge>
                        )}
                      </div>
                      {openSections.industry ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4">
                      <Label className="text-sm font-medium mb-3 block">
                        Target Industries (Find buyers in specific sectors)
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {industries.map((industry) => (
                          <Badge
                            key={industry.value}
                            variant={
                              selectedIndustries.includes(industry.value)
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer transition-colors"
                            onClick={() =>
                              toggleFilter(
                                industry.value,
                                selectedIndustries,
                                setSelectedIndustries
                              )
                            }
                          >
                            {industry.label}
                          </Badge>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Technology Filters */}
                  <Collapsible open={openSections.technology} onOpenChange={() => toggleSection("technology")}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-primary" />
                        <span className="font-medium">Technology Stack</span>
                        {selectedTechCategories.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {selectedTechCategories.length}
                          </Badge>
                        )}
                      </div>
                      {openSections.technology ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4">
                      <Label className="text-sm font-medium mb-3 block">
                        Technology Categories (Find companies using specific tech)
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {techCategories.map((tech) => (
                          <Badge
                            key={tech.value}
                            variant={
                              selectedTechCategories.includes(tech.value)
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer transition-colors"
                            onClick={() =>
                              toggleFilter(
                                tech.value,
                                selectedTechCategories,
                                setSelectedTechCategories
                              )
                            }
                          >
                            {tech.label}
                          </Badge>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Business Signals Filters */}
                  <Collapsible open={openSections.signals} onOpenChange={() => toggleSection("signals")}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="font-medium">Business Signals (Buying Intent)</span>
                        {selectedEvents.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {selectedEvents.length}
                          </Badge>
                        )}
                      </div>
                      {openSections.signals ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 space-y-4">
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">Pro Tip:</strong> Companies with recent business events like funding rounds, new offices, or hiring are more likely to be actively looking for suppliers and partners.
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Business Events (Within last {eventLookbackDays} days)
                        </Label>
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Lookback Period</span>
                            <span className="text-sm font-medium">{eventLookbackDays} days</span>
                          </div>
                          <Slider
                            value={[eventLookbackDays]}
                            onValueChange={([value]) => setEventLookbackDays(value)}
                            min={30}
                            max={90}
                            step={5}
                            className="w-full"
                          />
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {businessEvents.map((event) => (
                            <div
                              key={event.value}
                              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                selectedEvents.includes(event.value)
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                              onClick={() =>
                                toggleFilter(
                                  event.value,
                                  selectedEvents,
                                  setSelectedEvents
                                )
                              }
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{event.icon}</span>
                                <div>
                                  <p className="font-medium text-sm">{event.label}</p>
                                  <p className="text-xs text-muted-foreground">{event.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Buyer Intent Topics */}
                  <Collapsible open={openSections.intent} onOpenChange={() => toggleSection("intent")}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="font-medium">Buyer Intent Topics</span>
                        {selectedIntentTopics.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {selectedIntentTopics.length}
                          </Badge>
                        )}
                      </div>
                      {openSections.intent ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4">
                      <Label className="text-sm font-medium mb-3 block">
                        Find buyers researching these topics (AI-powered intent data)
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {buyerIntentTopics.map((topic) => (
                          <Badge
                            key={topic.value}
                            variant={
                              selectedIntentTopics.includes(topic.value)
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer transition-colors"
                            onClick={() =>
                              toggleFilter(
                                topic.value,
                                selectedIntentTopics,
                                setSelectedIntentTopics
                              )
                            }
                          >
                            {topic.label}
                          </Badge>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </>
      )}

      {/* Results Header */}
      {totalResults > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {businesses.length} of {totalResults.toLocaleString()} potential buyers
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Bookmark className="h-3 w-3" />
              {savedBuyers.size} saved
            </Badge>
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-none h-8"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-none h-8"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Business Cards */}
      <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
        {businesses.map((business) => (
          <Card
            key={business.business_id}
            className="border-border/50 hover:border-primary/30 transition-colors"
          >
            <CardContent className={viewMode === "grid" ? "p-4" : "p-6"}>
              <div className={viewMode === "grid" ? "space-y-3" : "flex flex-col lg:flex-row lg:items-start justify-between gap-4"}>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      {business.logo_url ? (
                        <img
                          src={business.logo_url}
                          alt={business.name}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <Building2 className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">
                        {business.name || "Unknown Company"}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {business.linkedin_category || business.industry || "Industry not specified"}
                      </p>
                    </div>
                  </div>

                  {viewMode === "list" && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {business.description || "No description available."}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 text-sm">
                    {(business.city || business.country) && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        <span className="truncate">
                          {[business.city, business.region, business.country]
                            .filter(Boolean)
                            .slice(0, 2)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                    {(business.company_size || business.number_of_employees) && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {business.company_size ||
                          `${business.number_of_employees?.toLocaleString()} emp`}
                      </div>
                    )}
                    {(business.company_revenue || business.revenue) && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {business.company_revenue || business.revenue}
                      </div>
                    )}
                  </div>
                </div>

                <div className={viewMode === "grid" ? "flex flex-wrap gap-2" : "flex flex-row lg:flex-col gap-2 shrink-0"}>
                  <Button
                    variant={
                      savedBuyers.has(business.business_id) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => toggleSaved(business.business_id)}
                    className="gap-2"
                  >
                    {savedBuyers.has(business.business_id) ? (
                      <>
                        <BookmarkCheck className="h-4 w-4" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4" />
                        Save
                      </>
                    )}
                  </Button>
                  {business.domain && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-2"
                    >
                      <a
                        href={`https://${business.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Website
                      </a>
                    </Button>
                  )}
                  {business.linkedin_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-2"
                    >
                      <a
                        href={business.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && businesses.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Find Your Ideal Buyers</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Use the advanced filters above to search through 80M+ businesses worldwide.
              Filter by target markets, company size, industry, and buyer intent signals
              to find the perfect buyers for your export products.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="gap-1">
                <MapPin className="h-3 w-3" />
                Target Markets
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Building className="h-3 w-3" />
                Company Profile
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Globe className="h-3 w-3" />
                Industry
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Zap className="h-3 w-3" />
                Buying Signals
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Target className="h-3 w-3" />
                Intent Topics
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalResults > 20 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1 || isLoading}
            onClick={() => handleSearch(currentPage - 1)}
          >
            Previous
          </Button>
          <Button variant="outline" disabled>
            Page {currentPage} of {Math.ceil(totalResults / 20)}
          </Button>
          <Button
            variant="outline"
            disabled={businesses.length < 20 || isLoading}
            onClick={() => handleSearch(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
