import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MasterDataTable,
  ColumnConfig,
} from "@/components/admin/MasterDataTable";
import {
  useMasterCountries,
  useMasterRegions,
  useMasterCompanySizes,
  useMasterRevenueRanges,
  useMasterCompanyAges,
  useMasterTechCategories,
  useMasterBusinessEvents,
  useMasterIntentTopics,
  useMasterTrainingCategories,
  useMasterEventTypes,
  useMasterSchemeCategories,
} from "@/hooks/useMasterData";
import {
  Globe,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Cpu,
  Zap,
  Target,
  GraduationCap,
  CalendarDays,
  FileText,
} from "lucide-react";

// Column configurations for each master data type
const countryColumns: ColumnConfig[] = [
  { key: "code", label: "Code", type: "text", required: true, placeholder: "US" },
  { key: "name", label: "Name", type: "text", required: true, placeholder: "United States" },
  { key: "region", label: "Region", type: "text", placeholder: "North America" },
  { key: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
  { key: "is_active", label: "Active", type: "boolean" },
];

const regionColumns: ColumnConfig[] = [
  { key: "country_code", label: "Country Code", type: "text", required: true, placeholder: "US" },
  { key: "code", label: "Region Code", type: "text", required: true, placeholder: "US-CA" },
  { key: "name", label: "Name", type: "text", required: true, placeholder: "California" },
  { key: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
  { key: "is_active", label: "Active", type: "boolean" },
];

const companySizeColumns: ColumnConfig[] = [
  { key: "code", label: "Code", type: "text", required: true, placeholder: "small" },
  { key: "label", label: "Label", type: "text", required: true, placeholder: "Small (1-50)" },
  { key: "min_employees", label: "Min Employees", type: "number", placeholder: "1" },
  { key: "max_employees", label: "Max Employees", type: "number", placeholder: "50" },
  { key: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
  { key: "is_active", label: "Active", type: "boolean" },
];

const revenueRangeColumns: ColumnConfig[] = [
  { key: "code", label: "Code", type: "text", required: true, placeholder: "1m-10m" },
  { key: "label", label: "Label", type: "text", required: true, placeholder: "$1M - $10M" },
  { key: "min_revenue", label: "Min Revenue", type: "number", placeholder: "1000000" },
  { key: "max_revenue", label: "Max Revenue", type: "number", placeholder: "10000000" },
  { key: "currency", label: "Currency", type: "text", placeholder: "USD" },
  { key: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
  { key: "is_active", label: "Active", type: "boolean" },
];

const companyAgeColumns: ColumnConfig[] = [
  { key: "code", label: "Code", type: "text", required: true, placeholder: "1-5" },
  { key: "label", label: "Label", type: "text", required: true, placeholder: "1-5 Years" },
  { key: "min_years", label: "Min Years", type: "number", placeholder: "1" },
  { key: "max_years", label: "Max Years", type: "number", placeholder: "5" },
  { key: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
  { key: "is_active", label: "Active", type: "boolean" },
];

const techCategoryColumns: ColumnConfig[] = [
  { key: "code", label: "Code", type: "text", required: true, placeholder: "cloud" },
  { key: "name", label: "Name", type: "text", required: true, placeholder: "Cloud Services" },
  { key: "description", label: "Description", type: "textarea", placeholder: "Description..." },
  { key: "icon", label: "Icon", type: "text", placeholder: "Cloud" },
  { key: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
  { key: "is_active", label: "Active", type: "boolean" },
];

const businessEventColumns: ColumnConfig[] = [
  { key: "code", label: "Code", type: "text", required: true, placeholder: "funding" },
  { key: "name", label: "Name", type: "text", required: true, placeholder: "Recent Funding" },
  { key: "description", label: "Description", type: "textarea", placeholder: "Description..." },
  { key: "category", label: "Category", type: "text", placeholder: "Growth" },
  { key: "icon", label: "Icon", type: "text", placeholder: "TrendingUp" },
  { key: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
  { key: "is_active", label: "Active", type: "boolean" },
];

const intentTopicColumns: ColumnConfig[] = [
  { key: "code", label: "Code", type: "text", required: true, placeholder: "expansion" },
  { key: "name", label: "Name", type: "text", required: true, placeholder: "Business Expansion" },
  { key: "description", label: "Description", type: "textarea", placeholder: "Description..." },
  { key: "category", label: "Category", type: "text", placeholder: "Growth" },
  { key: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
  { key: "is_active", label: "Active", type: "boolean" },
];

const trainingCategoryColumns: ColumnConfig[] = [
  { key: "code", label: "Code", type: "text", required: true, placeholder: "export-basics" },
  { key: "name", label: "Name", type: "text", required: true, placeholder: "Export Basics" },
  { key: "description", label: "Description", type: "textarea", placeholder: "Description..." },
  { key: "icon", label: "Icon", type: "text", placeholder: "BookOpen" },
  { key: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
  { key: "is_active", label: "Active", type: "boolean" },
];

const eventTypeColumns: ColumnConfig[] = [
  { key: "code", label: "Code", type: "text", required: true, placeholder: "exhibition" },
  { key: "name", label: "Name", type: "text", required: true, placeholder: "Trade Exhibition" },
  { key: "description", label: "Description", type: "textarea", placeholder: "Description..." },
  { key: "icon", label: "Icon", type: "text", placeholder: "Calendar" },
  { key: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
  { key: "is_active", label: "Active", type: "boolean" },
];

const schemeCategoryColumns: ColumnConfig[] = [
  { key: "code", label: "Code", type: "text", required: true, placeholder: "subsidy" },
  { key: "name", label: "Name", type: "text", required: true, placeholder: "Export Subsidy" },
  { key: "description", label: "Description", type: "textarea", placeholder: "Description..." },
  { key: "icon", label: "Icon", type: "text", placeholder: "Banknote" },
  { key: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
  { key: "is_active", label: "Active", type: "boolean" },
];

export default function AdminMasterData() {
  const countries = useMasterCountries();
  const regions = useMasterRegions();
  const companySizes = useMasterCompanySizes();
  const revenueRanges = useMasterRevenueRanges();
  const companyAges = useMasterCompanyAges();
  const techCategories = useMasterTechCategories();
  const businessEvents = useMasterBusinessEvents();
  const intentTopics = useMasterIntentTopics();
  const trainingCategories = useMasterTrainingCategories();
  const eventTypes = useMasterEventTypes();
  const schemeCategories = useMasterSchemeCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Master Data Management</h1>
        <p className="text-muted-foreground">
          Manage all reference data used across the platform. Changes here affect filters and options in all modules.
        </p>
      </div>

      <Tabs defaultValue="countries" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="countries" className="gap-2">
            <Globe className="h-4 w-4" />
            Countries
          </TabsTrigger>
          <TabsTrigger value="regions" className="gap-2">
            <MapPin className="h-4 w-4" />
            Regions
          </TabsTrigger>
          <TabsTrigger value="company-sizes" className="gap-2">
            <Users className="h-4 w-4" />
            Company Sizes
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue Ranges
          </TabsTrigger>
          <TabsTrigger value="ages" className="gap-2">
            <Calendar className="h-4 w-4" />
            Company Ages
          </TabsTrigger>
          <TabsTrigger value="tech" className="gap-2">
            <Cpu className="h-4 w-4" />
            Tech Categories
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Zap className="h-4 w-4" />
            Business Events
          </TabsTrigger>
          <TabsTrigger value="intent" className="gap-2">
            <Target className="h-4 w-4" />
            Intent Topics
          </TabsTrigger>
          <TabsTrigger value="training" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Training Categories
          </TabsTrigger>
          <TabsTrigger value="event-types" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Event Types
          </TabsTrigger>
          <TabsTrigger value="schemes" className="gap-2">
            <FileText className="h-4 w-4" />
            Scheme Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="countries">
          <MasterDataTable
            title="Countries"
            description="Target markets for exporters. Define countries where buyers can be searched."
            data={countries.data}
            isLoading={countries.isLoading}
            columns={countryColumns}
            onCreate={(item) => countries.createMutation.mutate(item as any)}
            onUpdate={(item) => countries.updateMutation.mutate(item as any)}
            onDelete={(id) => countries.deleteMutation.mutate(id)}
            isCreating={countries.createMutation.isPending}
            isUpdating={countries.updateMutation.isPending}
            isDeleting={countries.deleteMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="regions">
          <MasterDataTable
            title="Regions"
            description="States/regions within countries for granular location targeting."
            data={regions.data}
            isLoading={regions.isLoading}
            columns={regionColumns}
            onCreate={(item) => regions.createMutation.mutate(item as any)}
            onUpdate={(item) => regions.updateMutation.mutate(item as any)}
            onDelete={(id) => regions.deleteMutation.mutate(id)}
            isCreating={regions.createMutation.isPending}
            isUpdating={regions.updateMutation.isPending}
            isDeleting={regions.deleteMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="company-sizes">
          <MasterDataTable
            title="Company Sizes"
            description="Employee count ranges for filtering businesses by size."
            data={companySizes.data}
            isLoading={companySizes.isLoading}
            columns={companySizeColumns}
            onCreate={(item) => companySizes.createMutation.mutate(item as any)}
            onUpdate={(item) => companySizes.updateMutation.mutate(item as any)}
            onDelete={(id) => companySizes.deleteMutation.mutate(id)}
            isCreating={companySizes.createMutation.isPending}
            isUpdating={companySizes.updateMutation.isPending}
            isDeleting={companySizes.deleteMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="revenue">
          <MasterDataTable
            title="Revenue Ranges"
            description="Annual revenue brackets for buyer qualification."
            data={revenueRanges.data}
            isLoading={revenueRanges.isLoading}
            columns={revenueRangeColumns}
            onCreate={(item) => revenueRanges.createMutation.mutate(item as any)}
            onUpdate={(item) => revenueRanges.updateMutation.mutate(item as any)}
            onDelete={(id) => revenueRanges.deleteMutation.mutate(id)}
            isCreating={revenueRanges.createMutation.isPending}
            isUpdating={revenueRanges.updateMutation.isPending}
            isDeleting={revenueRanges.deleteMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="ages">
          <MasterDataTable
            title="Company Ages"
            description="Company age ranges (years in business)."
            data={companyAges.data}
            isLoading={companyAges.isLoading}
            columns={companyAgeColumns}
            onCreate={(item) => companyAges.createMutation.mutate(item as any)}
            onUpdate={(item) => companyAges.updateMutation.mutate(item as any)}
            onDelete={(id) => companyAges.deleteMutation.mutate(id)}
            isCreating={companyAges.createMutation.isPending}
            isUpdating={companyAges.updateMutation.isPending}
            isDeleting={companyAges.deleteMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="tech">
          <MasterDataTable
            title="Tech Categories"
            description="Technology stack categories for buyer tech profiling."
            data={techCategories.data}
            isLoading={techCategories.isLoading}
            columns={techCategoryColumns}
            onCreate={(item) => techCategories.createMutation.mutate(item as any)}
            onUpdate={(item) => techCategories.updateMutation.mutate(item as any)}
            onDelete={(id) => techCategories.deleteMutation.mutate(id)}
            isCreating={techCategories.createMutation.isPending}
            isUpdating={techCategories.updateMutation.isPending}
            isDeleting={techCategories.deleteMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="events">
          <MasterDataTable
            title="Business Events"
            description="Business signals like funding, hiring, product launches."
            data={businessEvents.data}
            isLoading={businessEvents.isLoading}
            columns={businessEventColumns}
            onCreate={(item) => businessEvents.createMutation.mutate(item as any)}
            onUpdate={(item) => businessEvents.updateMutation.mutate(item as any)}
            onDelete={(id) => businessEvents.deleteMutation.mutate(id)}
            isCreating={businessEvents.createMutation.isPending}
            isUpdating={businessEvents.updateMutation.isPending}
            isDeleting={businessEvents.deleteMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="intent">
          <MasterDataTable
            title="Intent Topics"
            description="Buyer intent signals for identifying active buyers."
            data={intentTopics.data}
            isLoading={intentTopics.isLoading}
            columns={intentTopicColumns}
            onCreate={(item) => intentTopics.createMutation.mutate(item as any)}
            onUpdate={(item) => intentTopics.updateMutation.mutate(item as any)}
            onDelete={(id) => intentTopics.deleteMutation.mutate(id)}
            isCreating={intentTopics.createMutation.isPending}
            isUpdating={intentTopics.updateMutation.isPending}
            isDeleting={intentTopics.deleteMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="training">
          <MasterDataTable
            title="Training Categories"
            description="Categories for training programs and courses."
            data={trainingCategories.data}
            isLoading={trainingCategories.isLoading}
            columns={trainingCategoryColumns}
            onCreate={(item) => trainingCategories.createMutation.mutate(item as any)}
            onUpdate={(item) => trainingCategories.updateMutation.mutate(item as any)}
            onDelete={(id) => trainingCategories.deleteMutation.mutate(id)}
            isCreating={trainingCategories.createMutation.isPending}
            isUpdating={trainingCategories.updateMutation.isPending}
            isDeleting={trainingCategories.deleteMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="event-types">
          <MasterDataTable
            title="Event Types"
            description="Types of trade events and exhibitions."
            data={eventTypes.data}
            isLoading={eventTypes.isLoading}
            columns={eventTypeColumns}
            onCreate={(item) => eventTypes.createMutation.mutate(item as any)}
            onUpdate={(item) => eventTypes.updateMutation.mutate(item as any)}
            onDelete={(id) => eventTypes.deleteMutation.mutate(id)}
            isCreating={eventTypes.createMutation.isPending}
            isUpdating={eventTypes.updateMutation.isPending}
            isDeleting={eventTypes.deleteMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="schemes">
          <MasterDataTable
            title="Scheme Categories"
            description="Categories for government schemes and subsidies."
            data={schemeCategories.data}
            isLoading={schemeCategories.isLoading}
            columns={schemeCategoryColumns}
            onCreate={(item) => schemeCategories.createMutation.mutate(item as any)}
            onUpdate={(item) => schemeCategories.updateMutation.mutate(item as any)}
            onDelete={(id) => schemeCategories.deleteMutation.mutate(id)}
            isCreating={schemeCategories.createMutation.isPending}
            isUpdating={schemeCategories.updateMutation.isPending}
            isDeleting={schemeCategories.deleteMutation.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
