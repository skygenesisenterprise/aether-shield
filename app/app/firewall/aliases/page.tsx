import { AliasListWidget } from "@/components/firewall/aliases/alias-list-widget";
import { AliasStatsWidget } from "@/components/firewall/aliases/alias-stats-widget";
import { AliasUsageWidget } from "@/components/firewall/aliases/alias-usage-widget";
import { AliasTypesWidget } from "@/components/firewall/aliases/alias-types-widget";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

export default function FirewallAliasesPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="p-4">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-100">
                Firewall Aliases
              </h1>
              <p className="text-sm text-gray-300">
                Manage and monitor firewall aliases for efficient rule
                management
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Alias
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Stats Column */}
          <div className="space-y-4">
            <AliasStatsWidget />
            <AliasTypesWidget />
          </div>

          {/* Usage Column */}
          <div className="space-y-4 lg:col-span-2 xl:col-span-1">
            <AliasUsageWidget />
          </div>

          {/* List Column - Full Width on all screens */}
          <div className="space-y-4 lg:col-span-2 xl:col-span-3">
            <AliasListWidget />
          </div>
        </div>
      </main>
    </div>
  );
}
