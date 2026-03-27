import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';
import { Settings } from 'lucide-react';

const EncrewSettings = () => (
  <StaggerContainer className="space-y-6">
    <StaggerItem>
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      <p className="text-sm text-muted-foreground">Application preferences and configuration</p>
    </StaggerItem>
    <StaggerItem>
      <div className="glass-card p-12 text-center space-y-4">
        <Settings className="w-12 h-12 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Settings</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Configuration options including departments, roles, notification preferences, and integrations will be available soon.
        </p>
      </div>
    </StaggerItem>
  </StaggerContainer>
);

export default EncrewSettings;
