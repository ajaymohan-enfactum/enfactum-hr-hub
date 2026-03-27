import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';
import { BarChart3 } from 'lucide-react';

const Utilization = () => (
  <StaggerContainer className="space-y-6">
    <StaggerItem>
      <h1 className="text-2xl font-bold text-foreground">Utilization</h1>
      <p className="text-sm text-muted-foreground">Track team capacity and utilization rates</p>
    </StaggerItem>
    <StaggerItem>
      <div className="glass-card p-12 text-center space-y-4">
        <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Coming Soon</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Utilization tracking with project assignments, billable hours, and capacity planning will be available in a future update.
        </p>
      </div>
    </StaggerItem>
  </StaggerContainer>
);

export default Utilization;
