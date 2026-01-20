import { AliasListWidget } from "@/components/firewall/aliases/alias-list-widget";
import { AliasStatsWidget } from "@/components/firewall/aliases/alias-stats-widget";
import { AliasUsageWidget } from "@/components/firewall/aliases/alias-usage-widget";
import { AliasTypesWidget } from "@/components/firewall/aliases/alias-types-widget";

export default function FirewallAliasesPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="p-4">
        {/* Page Title */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-100">
            Aether Shield - Firewall Aliases
          </h1>
          <p className="text-sm text-gray-300">
            Manage and monitor firewall aliases
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Column 1 */}
          <div className="space-y-4">
            <AliasStatsWidget />
            <AliasTypesWidget />
          </div>

          {/* Column 2 */}
          <div className="space-y-4 lg:col-span-2 xl:col-span-1">
            <AliasUsageWidget />
          </div>

          {/* Column 3 - Full Width */}
          <div className="space-y-4 lg:col-span-2 xl:col-span-3">
            <AliasListWidget />
          </div>
        </div>
      </main>
    </div>
  );
}
