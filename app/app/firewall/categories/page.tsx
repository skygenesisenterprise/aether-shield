"use client";

import { CategoryListWidget } from "@/components/firewall/categories/category-list-widget";
import { CategoryStatsWidget } from "@/components/firewall/categories/category-stats-widget";
import { CategoryUsageWidget } from "@/components/firewall/categories/category-usage-widget";
import { CategoryTypesWidget } from "@/components/firewall/categories/category-types-widget";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

export default function FirewallCategoriesPage() {
  return (
    <div className="h-screen bg-gray-900 overflow-hidden">
      <main className="h-full p-4 overflow-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-100">
                Firewall Categories
              </h1>
              <p className="text-sm text-gray-300">
                Manage and monitor firewall categories for efficient rule
                organization
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Category
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Stats Column */}
          <div className="space-y-4">
            <CategoryStatsWidget />
          </div>

          {/* Usage Column */}
          <div className="space-y-4">
            <CategoryUsageWidget />
          </div>

          {/* Types Column */}
          <div className="space-y-4">
            <CategoryTypesWidget />
          </div>

          {/* List Column - Full Width on all screens */}
          <div className="space-y-4 lg:col-span-3">
            <CategoryListWidget />
          </div>
        </div>
      </main>
    </div>
  );
}
