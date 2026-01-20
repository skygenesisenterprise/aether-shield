import { BackupConfiguration } from "@/components/system/config/backup/backup-configuration";
import { BackupHistory } from "@/components/system/config/backup/backup-history";
import { ScheduledBackups } from "@/components/system/config/backup/scheduled-backups";
import { BackupStorage } from "@/components/system/config/backup/backup-storage";

export default function BackupConfigPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="p-4">
        {/* Backup Configuration Title */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-100">
            Aether Shield - Backup Configuration
          </h1>
          <p className="text-sm text-gray-300">
            Manage system backups and recovery settings
          </p>
        </div>

        {/* Backup Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Column 1 */}
          <div className="space-y-4">
            <BackupConfiguration />
            <ScheduledBackups />
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <BackupStorage />
          </div>
        </div>

        {/* Full Width Row */}
        <div className="mt-4">
          <BackupHistory />
        </div>
      </main>
    </div>
  );
}
