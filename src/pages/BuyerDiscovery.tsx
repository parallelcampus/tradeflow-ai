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
import { useToast } from "@/hooks/use-toast";
import {
  exploriumApi,
  countryCodes,
  companySizes,
  revenueRanges,
  industries,
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

  // Filter states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedRevenue, setSelectedRevenue] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  // Match business states
  const [matchMode, setMatchMode] = useState(false);
  const [matchInput, setMatchInput] = useState("");

  const handleSearch = async (page: number = 1) => {
    if (
      !selectedCountries.length &&
      !selectedSizes.length &&
      !selectedRevenue.length &&
      !selectedIndustries.length &&
      !searchKeyword.trim()
    ) {
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
      if (selectedSizes.length) {
        filters.company_size = selectedSizes;
      }
      if (selectedRevenue.length) {
        filters.company_revenue = selectedRevenue;
      }
      if (selectedIndustries.length) {
        filters.linkedin_category = selectedIndustries;
      }
      if (searchKeyword.trim()) {
        filters.website_keywords = [searchKeyword.trim()];
      }

      const response = await exploriumApi.searchBusinesses(filters, page, 20);

      if (response.success) {
        setBusinesses(response.data || []);
        setTotalResults(response.total_results || 0);
        toast({
          title: "Search Complete",
          description: `Found ${response.total_results || 0} potential buyers.`,
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
    setSelectedSizes([]);
    setSelectedRevenue([]);
    setSelectedIndustries([]);
    setSearchKeyword("");
    setBusinesses([]);
    setTotalResults(0);
  };

  const activeFiltersCount =
    selectedCountries.length +
    selectedSizes.length +
    selectedRevenue.length +
    selectedIndustries.length +
    (searchKeyword ? 1 : 0);

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
            Search 80M+ businesses worldwide with AI-powered matching
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
                    placeholder="Search by keyword (e.g., organic, sustainable, electronics)..."
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
                    Filters
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
                        Search Buyers
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters Panel */}
          <Collapsible open={showFilters} onOpenChange={setShowFilters}>
            <CollapsibleContent>
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Search Filters</CardTitle>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear All
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Countries */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Target Countries
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {countryCodes.slice(0, 12).map((country) => (
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
                        <SelectTrigger className="w-[140px] h-7">
                          <SelectValue placeholder="More countries..." />
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.slice(12).map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Industries */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Industries
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {industries.slice(0, 8).map((industry) => (
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
                      <Select
                        onValueChange={(value) =>
                          toggleFilter(value, selectedIndustries, setSelectedIndustries)
                        }
                      >
                        <SelectTrigger className="w-[140px] h-7">
                          <SelectValue placeholder="More industries..." />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.slice(8).map((industry) => (
                            <SelectItem key={industry.value} value={industry.value}>
                              {industry.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Company Size & Revenue */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Company Size
                      </Label>
                      <div className="space-y-2">
                        {companySizes.slice(0, 5).map((size) => (
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
                      <Label className="text-sm font-medium mb-3 block">
                        Annual Revenue
                      </Label>
                      <div className="space-y-2">
                        {revenueRanges.slice(0, 5).map((rev) => (
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
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </>
      )}

      {/* Results */}
      {totalResults > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {businesses.length} of {totalResults.toLocaleString()} results
          </p>
          <Badge variant="secondary">{savedBuyers.size} saved</Badge>
        </div>
      )}

      {/* Business Cards */}
      <div className="space-y-4">
        {businesses.map((business) => (
          <Card
            key={business.business_id}
            className="border-border/50 hover:border-primary/30 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
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
                    <div>
                      <h3 className="font-semibold text-lg">
                        {business.name || "Unknown Company"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {business.linkedin_category || business.industry || "Industry not specified"}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {business.description || "No description available."}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    {(business.city || business.country) && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        {[business.city, business.region, business.country]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}
                    {(business.company_size || business.number_of_employees) && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {business.company_size ||
                          `${business.number_of_employees?.toLocaleString()} employees`}
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

                <div className="flex flex-row lg:flex-col gap-2 shrink-0">
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
            <h3 className="font-semibold text-lg mb-2">Find Your Next Buyer</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Use the filters above to search through 80M+ businesses worldwide.
              Filter by country, industry, company size, and revenue to find
              your ideal buyers.
            </p>
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
            Page {currentPage}
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
