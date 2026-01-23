import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Signal, Wifi } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const signalData = [
  { ssid: "Aether-Network", strength: 85, channel: 6 },
  { ssid: "Aether-Guest", strength: 72, channel: 11 },
  { ssid: "Aether-IoT", strength: 65, channel: 1 },
];

export function WirelessSignalWidget() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-100 flex items-center gap-2">
          <Signal className="h-5 w-5" />
          Signal Strength
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {signalData.map((network) => (
          <div key={network.ssid} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-blue-400" />
                <span className="text-gray-200 font-medium">
                  {network.ssid}
                </span>
                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                  Ch {network.channel}
                </span>
              </div>
              <span className="text-gray-200 font-bold">
                {network.strength}%
              </span>
            </div>
            <Progress
              value={network.strength}
              className="h-2 bg-gray-700"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
